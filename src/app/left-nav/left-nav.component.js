"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var LeftNavComponent = (function () {
    function LeftNavComponent() {
        this.clickNavNumber = 0;
    }
    LeftNavComponent.prototype.ngOnInit = function () {
    };
    LeftNavComponent.prototype.ngAfterViewInit = function () {
        $(document).ready(function () {
            $("#menu h3").click(function () {
                //slide up all the link lists
                $("#menu ul ul").slideUp();
                //slide down the link list below the h3 clicked - only if its closed
                if (!$(this).next().is(":visible")) {
                    $(this).next().slideDown();
                }
            });
            $("#accordian h3").click(function () {
            });
        });
    };
    LeftNavComponent.prototype.slidNav = function () {
        if (this.clickNavNumber % 2 == 0) {
            $("#menu_slide_icon").addClass("fa-rotate-180");
            $("#mySidenav").css("width", "0px");
            $("#main").css("marginLeft", "0px");
            this.clickNavNumber += 1;
        }
        else {
            $("#menu_slide_icon").removeClass("fa-rotate-180");
            $("#mySidenav").css("width", "190px");
            $("#main").css("marginLeft", "190px");
            this.clickNavNumber += 1;
        }
    };
    return LeftNavComponent;
}());
LeftNavComponent = __decorate([
    core_1.Component({
        selector: 'left-nav',
        templateUrl: './left-nav.component.html',
        styleUrls: ['./left-nav.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    })
], LeftNavComponent);
exports.LeftNavComponent = LeftNavComponent;
//# sourceMappingURL=left-nav.component.js.map