import { Component, OnInit } from '@angular/core';
import {Myrequest} from '../../service/my-request'


@Component({
  selector: 'app-my-request-approved',
  templateUrl: './my-request-approved.component.html',
  styleUrls: ['./my-request-approved.component.css']
})
export class MyRequestApprovedComponent implements OnInit {

  constructor(public myrequest: Myrequest) { }
  MyRequestList:any=[]

  ngOnInit(): void {
    this.myRequestlist()
  }
  myRequestlist(){
    let data={
      status:2
    }
    this.myrequest.MyrquestList(data).subscribe((data)=>[
      console.log("data",data.data),
      this.MyRequestList=data.data
    ])
  }
}
