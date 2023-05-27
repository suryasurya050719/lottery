import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Transection } from '../../service/transection';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  navStatus: boolean = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transection: Transection
  ) {}
  OtpSubmitInfo: boolean = false;
  paymenturlshow: boolean = false;
  paymenturl: string = '';
  amount: string = '';
  transectionType: string = '';
  reason: string = '';
  persentage: string = '';
  percentageAmount: string = '';
  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      this.navStatus = true;
    });
  }
  logout() {
    this.router.navigateByUrl('/login');
    localStorage.removeItem('lottrytoken');
    localStorage.removeItem('lottryname');
    localStorage.removeItem('lottryuserid');
  }
  ownWalletEdit() {
    this.OtpSubmitInfo = true;
  }
  ClosePopupInfo() {
    this.OtpSubmitInfo = false;
  }
  paymenttransection() {
    let data = {
      amount: this.amount,
      user_id: localStorage.getItem('lottryuserid'),
      position: 'INC',
    };
    this.transection.payment(data).subscribe((data) => {
      console.log('data for payment', data);
      this.paymenturlshow = true;
      let paymentUrl = data.data.data.payment_url;
      // this.paymenturl = paymentUrl;
      window.open(`${paymentUrl}`, '_self');
    });
  }
  @Output() childEvent = new EventEmitter();

  nav_menu() {
    this.childEvent.emit('test');
    this.navStatus = !this.navStatus;
  }
}
