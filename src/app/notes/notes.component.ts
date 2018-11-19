import { Component, OnInit } from '@angular/core';
import {NotesService} from "./notes-service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  public notes: any[];
  public noteEditDialogShow: boolean= false;

  constructor(notesService :NotesService) {
    notesService.getNotes().subscribe(notes => {
      this.notes=notes;
    })
  }

  ngOnInit() {
  }

    setMyStyles(prior : number) {
        let styles = {
            'color': prior == 1 ? 'red' : 'green',

        };
        return styles;
    }


    editNote(){
    this.noteEditDialogShow = true;
    }

    cancelEditNote(){
        this.noteEditDialogShow = false;

    }

}
