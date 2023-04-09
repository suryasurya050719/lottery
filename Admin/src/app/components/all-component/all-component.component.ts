import { Component, OnInit } from '@angular/core';
import { Notification } from '../../service/notification';


@Component({
  selector: 'app-all-component',
  templateUrl: './all-component.component.html',
  styleUrls: ['./all-component.component.css']
})
export class AllComponentComponent implements OnInit {

  constructor(private Notification: Notification) { }
  GetListDate:any=[]
  ngOnInit(): void {
    this.GetList()
  }
  GetList() {
    this.Notification.GetList().subscribe((data) => {
      console.log('dta', data);
      this.GetListDate = data.data;
    });
  }
}
