import { Component, OnInit } from '@angular/core';
import {NotesService} from "./notes-service";
import {Notes} from "../model/notes.model";
import {NgForm} from "@angular/forms";
import {MessageServiceExt} from "../messages/messageServiceExt";
import {Order} from "../model/order.model";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  public notes: Notes[];
  public note: Notes = new Notes();
  public noteEditDialogShow: boolean= false;
  public formSubmitted: boolean = false;

  constructor(private notesService :NotesService,private  messageServiceExt: MessageServiceExt,private confirmationService: ConfirmationService) {
    notesService.getNotes().subscribe(notes => {
      this.notes=notes;
    })
  }

  ngOnInit() {
    setTimeout(() => {
        console.log(this.notes) ;
    },3000 );
  }

    setMyStyles(prior : number) {
        let styles = {
            'color': prior == 1 ? 'red' : 'green',

        };
        return styles;
    }


    editNote(id: number){
    this.noteEditDialogShow = true;
    this.notesService.getNote(id).subscribe(value => {
        this.note = value
      })
    }

    createNote(){
      this.note = new Notes();
      this.noteEditDialogShow = true;
    }

    cancelEditNote(){
        this.noteEditDialogShow = false;

    }

    editForm(noteForm: NgForm){
        this.formSubmitted = true;


        if (noteForm.valid) {

          if(this.note.notesId == null){
            this.note.noteStatus =1;
          }

            this.notesService.saveOrUpdateNote(this.note).subscribe(value => {
                this.noteEditDialogShow = false;
                this.refreshNotesList();
                this.formSubmitted = false;

                if(this.note.notesId == null){
                    this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano notatkę',1000);

                }else{
                    this.messageServiceExt.addMessageWithTime('success', 'Status', 'Edytowano notatkę',1000);

                }

            }, error => {

                this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);



            });
        }

    }

    refreshNotesList(){

        this.notesService.getNotes().subscribe(notes => {
            this.notes=notes;
        })

    }

    ShowConfirmModal(note: Notes) {



        this.confirmationService.confirm({
            message: 'Jesteś pewny że chcesz usunąć notatkę',
            accept: () => {
                note.noteStatus = 0;


                this.notesService.saveOrUpdateNote(note).subscribe(data => {

                    this.refreshNotesList();
                })

            },
            reject: () => {

            }
        });

    }

    sortNotesDESC() {
        this.notes.sort((a, b)=> {
            return new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime();
        });
    }

    sortNotesASC() {
        this.notes.sort((a, b)=> {
            return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        });
    }


}
