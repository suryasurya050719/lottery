import { Component, OnInit } from '@angular/core';
import { Transection } from '../../service/transection';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  constructor(private transection: Transection) {}
  PaymentForPopup: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  singleTransectionList: any = [];
  transectionlist: any = [];

  ngOnInit(): void {
    // this.singleTransection()
    this.singleuser();
    this.singleTransection();
  }
  PaymentForBtn() {
    this.PaymentForPopup = !this.PaymentForPopup;
  }

  singleuser() {
    let id = localStorage.getItem('lottryuserid');
    let filterdata = {
      id: id,
    };
    this.transection.singleuser(filterdata).subscribe((data) => {
      console.log('transection all user ', data.data);
      let filterdata: any = [];

      this.transectionlist = data.data;
    });
  }
  singleTransection() {
    let currentUser_id = localStorage.getItem('lottryuserid');
    console.log("currentUser_id",currentUser_id)
    let data = {
      user_id: currentUser_id,
      graterthan: this.toDate,
      lessthan: this.fromDate,
      commission:""
    };
    this.transection.singleTransectionList(data).subscribe((data: any) => {
      this.singleTransectionList = data.data;
      console.log('this.singleTransectionList', this.singleTransectionList);
    });
  }
}
