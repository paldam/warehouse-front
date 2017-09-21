import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
@Component({
    selector: 'left-nav',
    templateUrl: './left-nav.component.html',
    styleUrls: ['./left-nav.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class LeftNavComponent implements OnInit {

    private items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'fa-file-o',
                items: [{
                    label: 'New',
                    icon: 'fa-plus',
                    items: [
                        {label: 'Project'},
                        {label: 'Other'},
                    ]
                },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },
            {
                label: 'Produkty',
                icon: 'fa-edit',
                items: [
                    {label: 'Przeglądaj', icon: 'fa-plus ', routerLink:['/product']},
                    {label: 'Dodaj', icon: 'fa-plus ', routerLink:['/product/add']},
                    {label: 'Aktualizuj', icon: 'fa-mail-reply',routerLink:['/product/add'] }
                ]
            },
            {
                label: 'Kosze',
                icon: 'fa-question',
                items: [
                    {label: 'Kreator Koszy', icon: 'fa-search',routerLink:['/baskets']}

                ]
            },
            {
                label: 'Profil',
                icon: 'fa-gear',
                items: [
                    {
                        label: 'Edit',
                        icon: 'fa-refresh',
                        items: [
                            {label: 'Save', icon: 'fa-save'},
                            {label: 'Update', icon: 'fa-save'},
                        ]
                    },
                    {
                        label: 'Other',
                        icon: 'fa-phone',
                        items: [
                            {label: 'Delete', icon: 'fa-minus'}
                        ]
                    }
                ]
            }
        ];
    }
}