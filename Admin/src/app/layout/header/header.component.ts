import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Transection } from '../../service/transection';
import { InstandFound } from '../../service/InstandFound';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transection: Transection,
    private instandFound:InstandFound
  ) {}
  OtpSubmitInfo: boolean = false;
  paymenturlshow: boolean = false;
  paymenturl: string = '';
  amount: string = '';
  transectionType: string = '';
  reason: string = '';
  persentage: string = '';
  percentageAmount: string = '';
  collaps_memu: boolean = false;
  InstandFoundStatus:Boolean=false
  InstandFoundId:string=""
  ngOnInit(): void {
    this.coloapsMenu();
    this.InstandFoundList()
  }
  InstandFoundList(){
    this.instandFound.list().subscribe((data)=>{
      console.log("data",data)
      this.InstandFoundStatus=data.data[0].instandFound_status
      this.InstandFoundId=data.data[0]._id
    })
  }
  InstandFoundStatusChange(){
  let data ={
    _id:this.InstandFoundId,
    instandFound_status:this.InstandFoundStatus
  }
  this.instandFound.update(data).subscribe((result)=>{
    alert("Instand Found Updated Successfully")
    this.InstandFoundList()
  })
  }
  coloapsMenu() {
    console.log("this.collaps_memu",this.collaps_memu)
    this.collaps_memu = !this.collaps_memu;
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
}
