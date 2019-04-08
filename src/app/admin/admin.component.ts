import { Component, OnInit } from '@angular/core';
import {User} from "../model/user.model";
import {Authorities} from "../model/authorities.model";
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ConfirmationService} from "primeng/primeng";
import {AuthenticationService, TOKEN_USER} from "../authentication.service";
import {AdminService} from "./admin.service";
import {MessageServiceExt} from "../messages/messageServiceExt";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    public user: User = new User();
    public usersList: User[] = [];
    public authorities: Authorities[] = [];
    public formSubmitted: boolean = false;
    public passwordDontMatch: any = null;
    public passwordConfirm: string = '';
    public status: string = '';
    public body: string = '';
    public changeModal : boolean = false;
    public selectedUser: User = new User();
    public authoritiesToSave: Authorities []=[];
    public loading: boolean;

    constructor(private userService: UserService, private router: Router, private confirmationService: ConfirmationService,public authenticationService: AuthenticationService,
                public adminService: AdminService, private messageServiceExt : MessageServiceExt) {
        userService.getAuthorities().subscribe(data => {
            this.authorities = data
        });
        userService.getUsers().subscribe(data => {
            this.usersList = data
        })
    }

    ngOnInit() {
    }

    refreshData() {
        this.userService.getUsers().subscribe(data => this.usersList = data)
    }

    submitForm(form: NgForm) {
        this.formSubmitted = true;
        if (form.valid) {

            if (this.user.password != this.passwordConfirm) {
                this.passwordDontMatch = "Hasła są różne";
            } else {
                this.passwordDontMatch = null;
                this.userService.saveUser(this.user).subscribe(data => {
                        this.user = new User();
                        this.status = data.text();
                        this.refreshData();
                        this.formSubmitted = false;
                        form.reset();
                    },
                    err => {
                        if (err.status == 500) {
                            this.status = "Błąd połączenia z bazą danych"
                        } else {
                            this.status = err.text();
                        }
                    });
            }
        }
    }
    submitChangeAuthForm(form: NgForm){
        this.selectedUser.authorities = this.authoritiesToSave;
        this.userService.updateUser(this.selectedUser).subscribe(data=>{
            this.authoritiesToSave = null;
            this.changeModal = false;
        },err=>{
            console.log("Problem przy modyfikowaniu uprawnień użytkownika")
        });

    }

    ShowConfirmModal(user: User) {
        this.confirmationService.confirm({
            key:"removeDialog",
            message: 'Jesteś pewny że chcesz usunąć użytkownika  ' + user.login + ' ?',
            accept: () => {
                var currentUser = localStorage.getItem(TOKEN_USER);
                if (user.login != currentUser){
                    this.userService.deleteUser(user.login).subscribe(data => {
                        this.refreshData();
                    });
                }else{
                        console.log("Uwaga Nie można usunąć konta na którym jesteś zalogowany")
                    }

            },
            reject: () => {

            }
        });
    }
    ShowConfirmResetModal(user: User) {
        this.confirmationService.confirm({
            key:"resetDialog",
            message: 'Jesteś pewny że chcesz zresetować hasło użytkownikowi:  ' + user.login + ' ?',
            accept: () => {
                this.userService.resetPassword(user.login).subscribe(data => {
                });

            },
            reject: () => {

            }
        });
    }


    showChangeDialog(user: User) {
        this.changeModal = true;
        this.selectedUser = user;
    }

    resetDbAllStockState(){
        this.confirmationService.confirm({
            key:"resetState",
            message: 'Jesteś pewny że chcesz zresetować stan magazynowy ?',
            accept: () => {

            this.adminService.resetProductsStates().subscribe(

                data => {
                    setTimeout(() => {
                        this.messageServiceExt.addMessageWithTime('success', 'Status', 'Wyzerowano stany magazynowe',5000);
                    }, 400);
                },
                error => {
                    setTimeout(() => {
                        console.log(error);
                        this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error._body + ' '  );
                    }, 400);
                } )


            },
            reject: () => {

            }
        });
    }

}
