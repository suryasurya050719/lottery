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
  File = '';
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
  onChange(deviceValue:any) {
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
Onsubmit(){
  console.log("console",this.File)
  if(this.File==''){
    this.FileError=true
  }else{
    console.log("this. file",this.File)
  }
}
}
