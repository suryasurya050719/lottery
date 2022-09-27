import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  AdminAccountPopup = false;
  AdminAccountPopupOpen(){
    this.AdminAccountPopup = !this.AdminAccountPopup
  }
  ClosePaymentPopup(){
    this.AdminAccountPopup = false
  }

}
