import { Component, OnInit } from '@angular/core';
import { APK } from '../../service/apk';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-apk',
  templateUrl: './apk.component.html',
  styleUrls: ['./apk.component.css']
})
export class ApkComponent implements OnInit {
 // ngmodel
 title: string = '';
 url: string = '';
 File = '';
 imagedata: any = {};


 // store data
 list: any = [];
 Link: string = '';
 activeData: any = {};
 Edite: boolean = false;
 //ngmodel error
 titleError: boolean = false;
 urlError: boolean = false;
 FileError: Boolean = false;
 constructor(private APK: APK) {}

 ngOnInit(): void {
   this.ourInfoList();
   this.Link = `${environment.apiurl}/images/`;

 }
 Filedata(event: any) {
  console.log('file', event.target.files[0]);
  this.imagedata = event.target.files[0];
}
 ourInfoList() {
   this.APK.list().subscribe((data) => {
     this.list = data.data;
     console.log('this.list', this.list);
   });
 }
 submit() {
  console.log("dfcvghbnj/......")
  console.log("this.title",this.title)
  console.log("this.imagedata",this.imagedata)
   if (this.title == '') {
     this.titleError = true;
   }
   if (this.imagedata?.name == '' && Object.keys(this.imagedata).length == 0) {
    this.FileError = true;
  } else {
    this.FileError = false;
  }

   if (this.title !== '' && this.imagedata?.name !== '') {
     let data = {
      apk_id: this.activeData.apk_id,
       hint: this.title,
       apkFile: this.imagedata,
     };
     console.log("data",data)
     if (this.Edite) {
       this.APK.edite(data).subscribe((data) => {
         console.log('data', data);
         this.Edite = false;
         this.reset();
         this.ourInfoList();
       });
     } else if (this.Edite == false) {
       this.APK.create(data).subscribe((data) => {
         console.log('data', data);
         this.reset();
         this.ourInfoList();
         if (data.statuscode == 200) {
           alert('Create sucessfully');
         }
       });
     }
   }
 }
 delete(id: any) {
   console.log('data', id);
   if (confirm('Are you sure you want to delete this record')) {
     this.APK.delete(Number(id)).subscribe((data) => {
       this.ourInfoList();
       alert('records delete sucessfully');
     });
   }
 }
 Edit(index: number) {
   this.Edite = true;
   console.log("index",index)
   this.activeData = this.list[index];
   this.title = this.activeData.hint;
   this.url = this.activeData.url;
 }
 reset() {
   this.title = '';
   this.url = '';
 }
}
