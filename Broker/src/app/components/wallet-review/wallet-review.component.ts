import { Component, OnInit } from '@angular/core';
import { Transection } from '../../service/transection';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from '../../service/login';
@Component({
  selector: 'app-wallet-review',
  templateUrl: './wallet-review.component.html',
  styleUrls: ['./wallet-review.component.css'],
})
export class WalletReivewComponent implements OnInit {
  config: any;
  collection = [];
  constructor(
    private transection: Transection,
    private login: Login,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 1,
    };
  }
  OtpSubmitInfos: boolean = false;
  selectedDevice: any;
  transectionUser_id: number = 0;
  alluserList: any = [];
  singleTransectionList: any = [];
  role_type: string = '';
  user_id: string = '';
  phonenumber: string = '';
  fromDate: string = '';
  toDate: string = '';
  filterdata: any = {};
  currentUserId: any = '';
  ActiveWallet: string = '';
  ActiveWallet_role_id: string = '';
  currentpage: number = 1;
  walletList: any = [];
  walletAmount: string = '';
  // Amount add fields error
  amountError: boolean = false;
  TrypeError: boolean = false;
  reasonError: boolean = false;

  //payment for details

  paymentForType: string = '';
  paymentForAmount: number = 0;
  paymentForRole_id: number = 0;
  paymentForReason: string = '';
  paymentForReferal_id: string = '';
  paymentForStatus: string = '';

  onChange(newValue: string, transection: any, transection_role_id: any) {
    this.selectedDevice = true;
    this.ActiveWallet = transection;
    this.ActiveWallet_role_id = transection_role_id;
  }
  ClosePopup() {
    this.selectedDevice = '';
  }

  OtpSubmitInfo = false;
  OtpSubmitBtn() {
    this.OtpSubmitInfo = !this.OtpSubmitInfo;
  }
  ClosePopupInfo() {
    this.OtpSubmitInfo = false;
    this.OtpSubmitInfos = false;
    this.selectedDevice = false;
  }

  PaymentForPopup = false;
  PaymentForBtn(
    type: string,
    reason: string,
    amount: number,
    referal_id: string,
    status: string,
    role_id: number
  ) {
    this.paymentForType = type;
    this.paymentForReason = reason;
    this.paymentForRole_id = role_id;
    this.paymentForAmount = amount;
    this.paymentForReferal_id = referal_id;
    this.paymentForStatus = status;
    this.PaymentForPopup = !this.PaymentForPopup;
  }
  ClosePaymentPopup() {
    this.PaymentForPopup = false;
  }
  // OtpSubmitInfo: boolean = false;
  paymenturlshow: boolean = false;
  singlrUser: any = '';
  paymenturl: string = '';
  amount: string = '';
  transectionType: string = '';
  reason: string = '';
  charges: string = '';
  chargesType: string = '';
  persentage: string = '';
  percentageAmount: string = '';

  ngOnInit(): void {
    this.alluser(this.config.currentPage);

    console.log('fromDate', this.fromDate);
    console.log('toDate', this.toDate);
    this.currentUserId = localStorage.getItem('lottryroleid');
    this.alluser(1);
    this.walletLIst();
  }
  singleUserLIst() {
    this.login.singleUser(this.currentUserId).subscribe((data) => {
      console.log('single user', data);
      this.singlrUser = data.data[0];
    });
  }
  alluser(newPage: number) {
    console.log('fromDate', new Date(this.fromDate));
    console.log('toDate', new Date(this.toDate));
    let curentUserID = localStorage.getItem('lottryuserid');
    this.filterdata['user_id'] = this.user_id;
    this.filterdata['id'] = curentUserID;
    this.filterdata['phonenumber'] = this.phonenumber;
    this.filterdata['role_type'] = this.role_type;
    this.filterdata['Page'] = newPage;
    this.currentpage = newPage;
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
        console.log('this.alluserList', this.alluserList);
        this.config.currentPage = newPage;
        let transection = this.alluserList[newPage - 1];
        console.log('transectionUser data', transection.role_id);
        this.transectionUser_id = transection.user_id;
        this.singleTransection();
      });
  }
  // dateFilter() {
  //   console.log('fromDate', new Date(this.fromDate));
  //   console.log('toDate', new Date(this.toDate));
  //   this.filterdata['user_id'] = this.user_id;
  //   this.filterdata['phonenumber'] = Number(this.phonenumber);
  //   this.filterdata['role_type'] = Number(this.role_type);
  //   // this.filterdata['fromDate'] = this.fromDate;
  //   // this.filterdata['toDate'] = this.toDate;
  //   this.transection.Alluser(this.filterdata).subscribe((data) => {
  //     // console.log('transection all user ', data);
  //     this.alluserList = data.data;
  //   });
  // }s
  ownWalletEdit() {
    this.OtpSubmitInfos = true;
  }
  singleTransection() {
    let data = {
      user_id: this.transectionUser_id,
      graterthan: this.fromDate,
      lessthan: this.toDate,
      commission:
        this.transectionType == '2'
          ? false
          : this.transectionType == '3'
          ? true
          : '',
    };
    console.log('data', data);
    this.transection.singleTransectionList(data).subscribe((data) => {
      this.singleTransectionList = data.data;
      console.log('this.singleTransectionList', this.singleTransectionList);
    });
  }
  paymenttransection() {
    let loginUser_id = localStorage.getItem('lottryuserid');
    let data = {
      amount: this.amount,
      user_id: localStorage.getItem('lottryuserid'),
      position: 'ADD',
      transection_from_userid: loginUser_id,
      transection_to_userid: loginUser_id,
      transection_from_type: 'QR code',
      transection_to_type: 'Wallet',
      Dedection_status: 'OWN',
    };
    this.transection.payment(data).subscribe((data) => {
      console.log('data for payment', data);
      this.paymenturlshow = true;
      let paymentUrl = data.data.data.payment_url;
      // this.paymenturl = paymentUrl;
      window.open(`${paymentUrl}`, '_self');
    });
  }
  paymenttransectionOthers() {
    // console.log(
    //   'paymet format data ',
    //   this.amount,
    //   this.transectionType,
    //   this.reason,
    //   this.charges,
    //   this.chargesType
    // );
    // if (Number(this.charges) == 1) {
    //   if (Number(this.chargesType)==1) {

    //   }
    // }
    // let sendamount
    let loginUser_id = localStorage.getItem('lottryuserid');
    let data = {
      amount: this.amount,
      user_id: this.ActiveWallet,
      position: 'ADD',
      transection_from_userid: loginUser_id,
      transection_to_userid: this.ActiveWallet,
      transection_from_type: 'QR code',
      transection_to_type: 'Wallet',
      Dedection_status: 'OTHERS',
    };
    console.log('data', data);
    this.transection.payment(data).subscribe((data) => {
      console.log('data for payment', data);
      this.paymenturlshow = true;
      let paymentUrl = data.data.data.payment_url;
      // this.paymenturl = paymentUrl;
      window.open(`${paymentUrl}`, '_self');
    });
  }
  AddMony() {
    console.log('this.transectionType', this.transectionType);
    if (this.amount == '') {
      this.amountError = true;
    } else {
      this.amountError = false;
    }
    if (this.transectionType == '') {
      this.TrypeError = true;
    }
    if (this.reason == '') {
      this.reasonError = true;
    }
    if (
      this.amount !== '' &&
      this.transectionType !== '' &&
      this.reason !== ''
    ) {
      if (this.walletAmount >= this.amount) {
        let data = {
          amount: this.amount,
          user_id: this.ActiveWallet,
          transection_from_userid: localStorage.getItem('lottryuserid'),
          transection_from_roleid: localStorage.getItem('lottryroleid'),
          transection_to_userid: this.ActiveWallet,
          transection_to_roleid: this.ActiveWallet_role_id,
          transection_from_type: 'Wallet',
          transection_to_type: 'Wallet',
          reason: this.reason,
          position: this.transectionType,
          topup: false,
        };
        this.transection.Addmony(data).subscribe((data) => {
          console.log('data for payment', data);
          let prepareData = {
            amount: this.amount,
            user_id: localStorage.getItem('lottryuserid'),
            transection_from_userid: localStorage.getItem('lottryuserid'),
            transection_from_roleid: localStorage.getItem('lottryroleid'),
            transection_to_userid: this.ActiveWallet,
            transection_to_roleid: this.ActiveWallet_role_id,
            transection_from_type: 'Wallet',
            transection_to_type: 'Wallet',
            reason: this.reason,
            position: "DETECT",
            topup: false,
          };
          this.transection.Addmony(prepareData).subscribe((data) => {
            console.log('data for payment', data);
            this.ClosePopupInfo();
            this.singleTransection();
            this.singleUserLIst();
            this.alluser(this.currentpage);
            // this.paymenturlshow = true;
            // let paymentUrl = data.data.data.payment_url;
            // this.paymenturl = paymentUrl;
            // window.open(`${paymentUrl}`, '_self');
          });
          this.ClosePopupInfo();
          this.singleTransection();
          this.singleUserLIst();
          this.alluser(this.currentpage);
          // this.paymenturlshow = true;
          // let paymentUrl = data.data.data.payment_url;
          // this.paymenturl = paymentUrl;
          // window.open(`${paymentUrl}`, '_self');
        });
        
      } else {
        alert('your wallet is to low please check your wallet');
      }
    }
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
        console.log('data', data);
        this.walletList = data.data[0];
        console.log('this.walletList', this.walletList);
        console.log('this.alluserList', this.alluserList);
        this.walletAmount = this.walletList.walletsList[0].current_amount;
        console.log(' this.walletAmount ', this.walletAmount);
      });
  }
}
