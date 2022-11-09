import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.css']
})
export class MyRequestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
}
