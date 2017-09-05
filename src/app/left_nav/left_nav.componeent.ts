import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
@Component({
    selector: 'left-nav',
    templateUrl: './left_nav.component.html'
})

export class LeftNavComponent implements OnInit {

    private items: MenuItem[];

    ngOnInit() {
        this.items = [{
            label: 'File',
            items: [
                {label: 'New', icon: 'fa-plus'},
                {label: 'Open', icon: 'fa-download'}
            ]
        },
            {
                label: 'Edit',
                items: [
                    {label: 'Strona1', icon: 'fa-refresh',url: 'http://www.primefaces.org/primeng'},
                ]
            }];
    }
}