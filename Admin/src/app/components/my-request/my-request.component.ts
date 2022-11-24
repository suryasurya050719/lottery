import { Component, OnInit } from '@angular/core';
import {Myrequest} from '../../service/my-request'

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.css']
})
export class MyRequestComponent implements OnInit {

  constructor(  public myrequest: Myrequest,) { }
  MyRequestList:any=[]
  imagedata: any = {};
  File = '';
  activeId:any=''
  Reason:any=''
  reasonError:boolean=false
  FileError:boolean=false

  ngOnInit(): void {
    this.myRequestlist()
  }
  myRequestlist(){
    let data={
      status:1
    }
    this.myrequest.MyrquestList(data).subscribe((data)=>[
      console.log("data",data.data),
      this.MyRequestList=data.data
    ])
  }
  approve_popup = false;
  reject_popup = false;
  onChange(deviceValue:any,_id:any) {
    this.activeId=_id
    let GetValue:any = deviceValue.target.value
    if(GetValue == 1){
      this.approve_popup = true
    }
    else if(GetValue == 2){
      this.reject_popup = true
    }
}
CloseMoreViewPopup3(){
  this.approve_popup = false
}
CloseMoreViewPopup4(){
  this.reject_popup = false
}
Filedata(event: any) {
  console.log('file', event.target.files[0]);
  this.imagedata = event.target.files[0];
}
Onsubmit(){
  console.log("console",this.File)
  if(this.File==''){
    this.FileError=true
  }else{
    console.log("this. file",this.imagedata)
    let data={
      imagedata:this.imagedata,
      id:this.activeId
    }
    console.log("data",data)
    this.myrequest.Myrquesapproved(data).subscribe((data)=>{
     console.log("approved result data",)
     if(data.statuscode==200){
      this.approve_popup = false
      alert('approved successfully')
    }
    })
  }
}
rejected(){
  if(this.Reason==''){
    this.reasonError=true
  }else{
    console.log("reson ",this.Reason)
    let data={
      Reason:this.Reason,
      id:this.activeId
    }
    this.myrequest.Myrquesrejected(data).subscribe((data)=>{
      console.log("rejected data",data)
      if(data.statuscode==200){
        this.reject_popup = false
        alert('Rejected successfully')
      }
    })
  }
}
}
