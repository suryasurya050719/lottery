import { Component, OnInit } from '@angular/core';
import { Transection } from '../../service/transection';
import { Dashboard } from '../../service/dashboard';
import { Account } from '../../service/accoount';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  constructor(
    private transection: Transection,
    private Dashboard: Dashboard,
    private Account: Account
  ) {}
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
  // account
  AccountNumber: string = '';
  Branchname: string = '';
  IFSCcode: string = '';
  HolderName: string = '';

  // error account
  AccountNumberError: boolean = false;
  BranchnameError: boolean = false;
  IFSCcodeError: boolean = false;
  HolderNameError: boolean = false;
  accountListAdmin: any = [];
  //payment for details

  paymentForType: string = '';
  paymentForAmount: number = 0;
  paymentForReferal_id: string = '';
  paymentForStatus: string = '';

  ownAccountList: any = [];
  Amount: String = '';
  AccountDetails: any = '';
  popUp: Boolean = false;

  ngOnInit(): void {
    this.alluser();
    this.walletLIst();
    this.singleuser();
    this.singleTransection();
    this.getAccount();
    this.getwidrowaccoount();
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
  getAccount() {
    this.Dashboard.AccountList().subscribe((data) => {
      console.log('data', data);
      this.accountListAdmin = data.data[0]?.Admin[0].List;
      console.log('this.accountListAdmin', this.accountListAdmin);
    });
  }
  getwidrowaccoount() {
    let data = Number(localStorage.getItem('lottryuserid'));
    console.log('data', data);
    this.Account.OwnAccountList(data).subscribe((data) => {
      console.log('>> ownAccountList', data);
      this.ownAccountList = data.data;
    });
  }
  Addaccount() {
    if (this.AccountNumber == '') {
      this.AccountNumberError = true;
    } else {
      this.AccountNumberError = false;
    }
    if (this.Branchname == '') {
      this.BranchnameError = true;
    } else {
      this.BranchnameError = false;
    }
    if (this.IFSCcode == '') {
      this.IFSCcodeError = true;
    } else {
      this.IFSCcodeError = false;
    }
    if (this.HolderName == '') {
      this.HolderNameError = true;
    } else {
      this.HolderNameError = false;
    }
    if (
      this.AccountNumber !== '' &&
      this.Branchname !== '' &&
      this.IFSCcode !== '' &&
      this.HolderName !== ''
    ) {
      let data = {
        user_id: localStorage.getItem('lottryuserid'),
        AccountNumber: this.AccountNumber,
        Branchname: this.Branchname,
        IFSCcode: this.IFSCcode,
        HolderName: this.HolderName,
      };
      console.log('data', data);
      this.Account.AccountCreate(data).subscribe((data) => {
        console.log('data', data);
        this.AccountReset();
      });
    }
  }
  AccountReset() {
    this.AccountNumber = '';
    this.Branchname = '';
    this.IFSCcode = '';
    this.HolderName = '';
  }
  myrequest() {
    console.log('this.Amount', this.Amount);
    console.log('this.AccountDetails', this.AccountDetails);
    let Account = this.ownAccountList[this.AccountDetails];
    let prepareDate = {
      user_id: localStorage.getItem('lottryuserid'),
      role_id: 3,
      account_id:Account.account_id,
      account_type:Account.type,
      account_details:
        Account.type == 1
          ? Account.account_number
          : Account.type == 2
          ? Account.phone
          : Account.type == 3
          ? Account.phone
          : Account.type == 4
          ? Account.phone
          : Account.upi_id,
      user_name: localStorage.getItem('lottryname'),
      amount: this.Amount,
      phone: localStorage.getItem('lottryphone'),
    };
    this.Account.WidrawRequest(prepareDate).subscribe((data) => {
      console.log('Data', data);
      this.popUp = !this.popUp;
      window.location.reload();
    });
  }
  widrawOpen() {
    console.log('this.popUp', this.popUp);
    this.popUp = !this.popUp;
    console.log('this.popUp', this.popUp);
  }
}
