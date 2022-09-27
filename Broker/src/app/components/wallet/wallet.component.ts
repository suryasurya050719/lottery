import { Component, OnInit } from '@angular/core';
import { Transection } from '../../service/transection';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  constructor(private transection: Transection) {}
  filterdata: any = {};
  alluserList: any = [];
  walletList: any = [];
  walletAmount: string = '';
  Activeamount: number = 0;
  PaymentForPopup: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  singleTransectionList: any = [];
  transectionlist: any = [];

  //payment for details

  paymentForType: string = '';
  paymentForAmount: number = 0;
  paymentForReferal_id: string = '';
  paymentForStatus: string = '';

  ngOnInit(): void {
    this.alluser();
    this.walletLIst();
    this.singleuser();
    this.singleTransection();
  }
  AddFundPanel = false;

  ShowAddFund() {
    this.AddFundPanel = !this.AddFundPanel;
  }
  isVisible: any;
  isSelected: boolean = true;

  ActiveClass = false;
  AmountActive(amount: number) {
    this.Activeamount = amount;
    // this.ActiveClass = !this.ActiveClass;
  }
  alluser() {
    // console.log('fromDate', new Date(this.fromDate));
    // console.log('toDate', new Date(this.toDate));
    let curentUserID = localStorage.getItem('lottryuserid');
    console.log('curentUserID', curentUserID);
    this.filterdata['user_id'] = '';
    this.filterdata['id'] = curentUserID;
    this.filterdata['phonenumber'] = '';
    this.filterdata['role_type'] = '';
    // this.filterdata['Page'] = newPage;
    // this.currentpage = newPage;
    // this.filterdata['toDate'] = this.toDate;
    this.transection
      .referalTransectionList(this.filterdata)
      .subscribe((data) => {
        console.log('transection all user ', data.data);
        let filterdata: any = [];
        data.data.forEach((element: any) => {
          console.log('>>>>>>>>>', element.role_id !== 1);

          if (element.role_id !== 1) {
            filterdata.push(element);
          }
        });
        this.alluserList = filterdata;

        // this.config.currentPage = newPage;
        // let transection = this.alluserList[newPage - 1];
        // console.log('transectionUser data', transection.role_id);
        // this.transectionUser_id = transection.user_id;
        // this.singleTransection();
      });
  }
  walletLIst() {
    let curentUserID = localStorage.getItem('lottryuserid');
    console.log('curentUserID', curentUserID);
    // this.filterdata['user_id'] = '';
    this.filterdata['user_id'] = curentUserID;
    this.filterdata['phonenumber'] = '';
    this.filterdata['role_type'] = '';
    this.transection
      .singleUserTransection(this.filterdata)
      .subscribe((data) => {
        // console.log('data', data);
        this.walletList = data.data[0];
        console.log('this.walletList', this.walletList);
        console.log('this.alluserList', this.alluserList);
        this.walletAmount = this.walletList.walletsList[0].current_amount;
        console.log(' this.walletAmount ', this.walletAmount);
      });
  }
  paymenttransection() {
    let loginUser_id = localStorage.getItem('lottryuserid');
    let data = {
      amount: this.Activeamount,
      user_id: localStorage.getItem('lottryuserid'),
      position: 'INC',
      transection_from_userid: loginUser_id,
      transection_to_userid: loginUser_id,
      transection_from_type: 'QR code',
      transection_to_type: 'Wallet',
      Dedection_status: 'OWN',
    };
    this.transection.payment(data).subscribe((data) => {
      console.log('data for payment', data);
      // this.paymenturlshow = true;
      let paymentUrl = data.data.data.payment_url;
      // this.paymenturl = paymentUrl;
      window.open(`${paymentUrl}`, '_self');
    });
  }
  ClosePaymentPopup() {
    this.PaymentForPopup = false;
  }
  PaymentForBtn(
    type: string,
    amount: number,
    // referal_id: string,
    status: string
  ) {
    this.paymentForType = type;
    this.paymentForAmount = amount;
    // this.paymentForReferal_id = referal_id;
    this.paymentForStatus = status;
    this.PaymentForPopup = !this.PaymentForPopup;
  }
  // PaymentForBtn() {
  //   this.PaymentForPopup = !this.PaymentForPopup;
  // }
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
    let data = {
      user_id: currentUser_id,
      graterthan: this.toDate,
      lessthan: this.fromDate,
    };
    this.transection.singleTransectionList(data).subscribe((data: any) => {
      this.singleTransectionList = data.data;
      console.log('this.singleTransectionList', this.singleTransectionList);
    });
  }
}
