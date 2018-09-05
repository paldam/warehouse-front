import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {AuthenticationService, TOKEN, TOKEN_USER} from "../../authentication.service";
import {PasswordChange} from "../../model/password_change.model";
import {UserService} from "../../user.service";
import {NgForm} from "@angular/forms";

declare var jquery:any;
declare var $ :any;
@Component({
    selector: 'left-nav',
    templateUrl: './left-nav.component.html',
    styleUrls: ['./left-nav.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class LeftNavComponent implements OnInit {
    public clickNavNumber: number=0;
    userName: string;

    public changePasswordModal : boolean = false;
    public passwordDontMatch: any = null;
    public passwordConfirm: string = '';
    public formSubmitted: boolean = false;
    public passwordChange: PasswordChange = new PasswordChange();
    public status :any;

    constructor(public authenticationService: AuthenticationService,private userService: UserService ){
        this.userName = localStorage.getItem(TOKEN_USER);
        this.passwordChange.login = localStorage.getItem(TOKEN_USER);
        authenticationService.getLoggedInName.subscribe(name => {
            this.changeName(name);
            this.passwordChange.login = name;
        });
    }

    public changeName(name: string): void {
        this.userName = name;
    }


    ngOnInit(

    ) {


    }


    ngAfterViewInit(): void{
        $(document).ready(function(){
            if($(window).width() < 650) {
                $("#black").addClass("black_background");
            }



            $("#menu h3").click(function(){
                //slide up all the link lists

                    $("#menu ul ul" ).slideUp();

                //slide down the link list below the h3 clicked - only if its closed
                if(!$(this).next().is(":visible" ))
                {
                    $(this).next().slideDown();
                }
            })

            $("#accordian h3").click(function() {

            })
        })
    }

     slidNav(){
        if(this.clickNavNumber%2==0) {
            $("#menu_slide_icon").addClass("fa-rotate-180");
            $("#mySidenav").css("width", "0px");
            $("#main").css("marginLeft", "0px");
            $("#black").removeClass("black_background");
            this.clickNavNumber+=1;

        }else{
            $("#menu_slide_icon").removeClass("fa-rotate-180")
            if($(window).width() > 650){
                $("#mySidenav").css("width", "190px");
                $("#main").css("marginLeft", "190px");


            }else{
                $("#mySidenav").css("width", "190px");
                $("#main").css("marginLeft", "0px");
                $("#black").addClass("black_background")
            }
            this.clickNavNumber+=1;
        }

     }

    isAdmin() : boolean {
         return this.authenticationService.isAdmin();
    }
    isUser() : boolean {
        return this.authenticationService.isUser();
    }
    isSuperUser() : boolean {
        return this.authenticationService.isSuperUser();
    }
    isBiuroUser() : boolean {
        return this.authenticationService.isBiuroUser();
    }
    isMagazynUser() : boolean {
        return this.authenticationService.isMagazynUser();
    }
    isProdukcjaUser() : boolean {
        return this.authenticationService.isProdukcjaUser();
    }
    isWysylkaUser() : boolean {
        return this.authenticationService.isWysylkaUser();
    }
    getUser(){
        return this.authenticationService.getCurrentUser;
    }

    isMagazynOrProdukcjaOrAdmin(): boolean{



        if (this.authenticationService.isMagazynUser() || this.authenticationService.isProdukcjaUser()||this.authenticationService.isAdmin()){
            return true;
        }else{
            false
        }

    }

    submitChangePassForm(form: NgForm) {
        this.formSubmitted = true;
        if (form.valid) {
            if (this.passwordChange.newPassword != this.passwordConfirm) {
                this.passwordDontMatch = "Hasła są różne";
            } else {
                this.passwordDontMatch = null;
                this.userService.changePassword(this.passwordChange).subscribe(data => {
                        form.reset();
                        this.formSubmitted = false;
                        this.status = data.text();
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


    showChangePasswordDialog() {
        if(this.userName=="wylogowano"){

        }else{
            this.changePasswordModal = true;
        }

    }


}

