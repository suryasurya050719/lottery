import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Transection } from '../../service/transection';
import { Login } from '../../service/login';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private login:Login,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private transection: Transection
  ) {}
  @Output() childEvent = new EventEmitter();

  form: FormGroup;
  OtpSubmitInfo: boolean = false;
  paymenturlshow: boolean = false;
  paymenturl: string = '';
  amount: string = '';
  transectionType: string = '';
  reason: string = '';
  persentage: string = '';
  percentageAmount: string = '';
  userName: string | null = '';
  BrokerPopup:Boolean=false
  collaps_memu: boolean = true;
  oldPassword:string=""
  newPassword:string=""
  confirmPassword:string=""
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      }
      // {
      //   validators: [Validation.match('password', 'confirmPassword')] [routerLink]="['/user-review-view']"
      // }
    );
    this.form.reset()
    this.userName = localStorage.getItem('lottryname');
    this.router.events.subscribe((val) => {
      console.log('val',val);
      this.collaps_memu = true;
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
  ChangePassword(){
    this.form.reset()
    this.BrokerPopup=!this.BrokerPopup
  }
  coloapsMenu() {
    console.log("this.collaps_memu",this.collaps_memu)
    this.collaps_memu = !this.collaps_memu;
    this.childEvent.emit('test');
  }
  onSubmit(){
   if (this.newPassword== this.confirmPassword) {
    let data ={
      user_id:localStorage.getItem("lottryuserid"),
      password:this.newPassword,
      old_password:this.oldPassword,
    }
    this.login.ChangePassword(data).subscribe((result)=>{
      console.log("result",result)
      console.log("result",result.success)
      console.log("result",result)

      if (result.success==false) {
        alert(`${result.status}`)
      }else{
        alert("Password Updated")
      }
      // alert("Password Updated")
      this.CloseBrokerPopup()
    })
   }else{
    alert("New Password and Confirm Password must be same")
   }
  }
  CloseBrokerPopup(){
    this.form.reset()
    this.BrokerPopup=!this.BrokerPopup
  }




}
