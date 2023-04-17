import { Component, OnInit } from '@angular/core';
import {Myrequest} from '../../service/my-request'


@Component({
  selector: 'app-my-request-rejected',
  templateUrl: './my-request-rejected.component.html',
  styleUrls: ['./my-request-rejected.component.css']
})
export class MyRequestRejectedComponent implements OnInit {

  constructor(public myrequest: Myrequest) { }
  MyRequestList:any=[]

  ngOnInit(): void {
    this.myRequestlist()
  }
  myRequestlist(){
    let data={
      status:3,
      user_id:localStorage.getItem("lottryuserid")
    }
    this.myrequest.MyrquestList(data).subscribe((data)=>[
      console.log("data",data.data),
      this.MyRequestList=data.data
    ])
  }
}
