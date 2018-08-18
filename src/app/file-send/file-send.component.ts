import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Http, ResponseContentType} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {FileSendService} from "./file-send.service";
import {FileUpload} from "primeng/primeng";

@Component({
  selector: 'app-file-send',
  templateUrl: './file-send.component.html',
  styleUrls: ['./file-send.component.css']
})
export class FileSendComponent implements OnInit {

  form: FormGroup;
  uploadedFiles: any[] = [];

    @ViewChild(FileUpload) ddd: FileUpload;



  constructor(private fileSendService: FileSendService) { }

  ngOnInit() {

  }



    getFile(id: number){
      this.fileSendService.getFile(id).subscribe(res=>{
            let a = document.createElement("a")
            let blobURL = URL.createObjectURL(res)
            a.download = this.fileSendService.fileName;
            a.href = blobURL
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        });
    }


    click(){


        this.ddd.upload();
        this.ddd.onSelect
    }
  


}
