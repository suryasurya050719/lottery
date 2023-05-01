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
  transection_type:string=''
  filterdata: any = {};
  currentUserId: any = '';
  ActiveWallet: string = '';
  ActiveWallet_role_id: string = '';
  currentpage: number = 1;
  // Amount add fields

  amount: string = '';
  transectionType: string = '';
  reason: string = '';

  // Amount add fields error
  amountError: boolean = false;
  TrypeError: boolean = false;
  reasonError: boolean = false;

  //payment for details

  paymentForType: string = '';
  paymentForReason: string = '';
  paymentForAmount: number = 0;
  paymentForReferal_id: string = '';
  paymentForStatus: string = '';
  paymentForRole_id: number = 0;

  onChange(newValue: string, transection: any, transection_role_id: any) {
    console.log('data', transection);
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
    reason: string,
    type: string,
    amount: number,
    referal_id: string,
    status: string,
    role_id: number
  ) {
    this.paymentForType = type;
    this.paymentForReason = reason;
    this.paymentForAmount = amount;
    this.paymentForReferal_id = referal_id;
    this.paymentForStatus = status;
    this.paymentForRole_id = role_id;
    this.PaymentForPopup = !this.PaymentForPopup;
  }
  ClosePaymentPopup() {
    this.PaymentForPopup = false;
  }
  // OtpSubmitInfo: boolean = false;
  paymenturlshow: boolean = false;
  singlrUser: any = '';
  paymenturl: string = '';
  charges: string = '';
  chargesType: string = '';
  persentage: string = '';
  percentageAmount: string = '';

  ngOnInit(): void {
    this.alluser(this.config.currentPage);

    console.log('fromDate', this.fromDate);
    console.log('toDate', this.toDate);
    console.log('transectionDetails',this.transectionType)
    this.currentUserId = localStorage.getItem('lottryroleid');
    this.alluser(1);
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
    this.filterdata['user_id'] = this.user_id;
    this.filterdata['phonenumber'] = this.phonenumber;
    this.filterdata['role_type'] = this.role_type;
    this.filterdata['Page'] = newPage;
    this.currentpage = newPage;
    // this.filterdata['toDate'] = this.toDate;
    console.log("filterdata",this.filterdata)
    this.transection.Alluser(this.filterdata).subscribe((data) => {
      console.log('transection all user ', data.data);
      let filterdata01: any = [];
      data.data.forEach((element: any) => {
        console.log('element', element);
        if (element.role_id !== 1 && element.isOtpVerify !== false) {
          filterdata01.push(element);
        }
      });
      this.alluserList = filterdata01;
      console.log('this.alluserList', this.alluserList);
      this.config.currentPage = newPage;
      let transection = this.alluserList[newPage - 1];
      // console.log('transectionUser data', transection.role_id);
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
    console.log("this.transectionType",this.transectionType)
    let data = {
      user_id: this.transectionUser_id,
      graterthan: this.toDate,
      lessthan: this.fromDate,
      commission:this.transectionType=='2'?false:this.transectionType=='3'?true:''
    };
    console.log("data for transection details ",data)
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
      };
      this.transection.Addmony(data).subscribe((data) => {
        let PrepareDate = {
          amount: this.amount,
          user_id:localStorage.getItem('lottryuserid'),
          transection_from_userid: localStorage.getItem('lottryuserid'),
          transection_from_roleid: localStorage.getItem('lottryroleid'),
          transection_to_userid: this.ActiveWallet,
          transection_to_roleid: this.ActiveWallet_role_id,
          transection_from_type: 'Wallet',
          transection_to_type: 'Wallet',
          reason: this.reason,
          position: "DETECT",
        };
        this.transection.Addmony(PrepareDate).subscribe((data) => {
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
    }
  }
}
