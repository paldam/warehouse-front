import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {AuthenticationService, TOKEN, TOKEN_USER} from "../authentication.service";

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

    constructor(private authenticationService: AuthenticationService){
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
    getUser(){
        return this.authenticationService.getCurrentUser;
    }

}

