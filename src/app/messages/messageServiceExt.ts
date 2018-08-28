import { Injectable, OnInit} from '@angular/core';
import {Message, MessageService} from "primeng/api";




@Injectable()
export class MessageServiceExt  implements OnInit {

  constructor(private messageService :MessageService) {

  }

  ngOnInit() {
  }


  addMessage(messageType: string, textHeader : string, text: string){
    this.messageService.add({
      severity: messageType,
      summary: textHeader,
      detail: text,
      life: 10000
    });
  }

}
