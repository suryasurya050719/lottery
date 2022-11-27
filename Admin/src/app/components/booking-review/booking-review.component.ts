import { Component, OnInit } from '@angular/core';
import { Booking } from '../../service/booking';
import { Board } from '../../service/board';
// import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css'],
})
export class BookingReviewComponent implements OnInit {
  config: any;
  constructor(private booking: Booking, private board: Board) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 1,
    };
  }
  referal_user_id:string=''
  reviewList: any = [];
  BookingListdata: any = [];
  viewmorepopupdata: any = [];
  activateUserID: string = '';
  // filter data
  fromDate: any = '';
  toDate: any = '';
  user_type: any = '';
  game_type: any = '';
  board_type: any = [{}];
  user_id: any = '';
  phone: any = '';
  toppingList: any = {};
  gamelistdata: any = [];
  ngOnInit(): void {
    this.gameList();
    this.BookingReviewList(this.config.currentPage);
  }
  gameList() {
    this.board.GameList().subscribe((data) => {
      console.log('data for game list', data.data);
      this.gamelistdata = data.data;
    });
  }
  BookingReviewList(newPage: number) {
    let data = {
      user_id: this.user_id,
      phonenumber: this.phone,
      refered_role_id:this.user_type,
      referal_user_id:this.referal_user_id
    };
    console.log("data",data)
    this.booking.ReferedBookingList(data).subscribe((data) => {
      this.reviewList = data.data;
      console.log('this review list', this.reviewList);
      this.config.currentPage = newPage;
      let currentData = this.reviewList[newPage - 1];
      this.activateUserID = currentData.user_id;
      this.singleBookingRecords();
    });
  }
  show_time() {
    console.log('board_type', this.board_type);
  }
  game() {
    this.toppingList = this.gamelistdata[this.game_type];
    console.log('game_type', this.game_type);
  }
  ViewMorePopupPanel = false;
  singleBookingRecords() {
    let data = {
      fromdate: this.fromDate !== '' ? new Date(this.fromDate) : '',
      todate: this.toDate !== '' ? new Date(this.toDate) : '',
      user_id: this.activateUserID,
      game_name: this.game_type,
      phonenumber: this.phone,
    };
    this.booking.BookingList(data).subscribe((data) => {
      this.BookingListdata = data.data;
      console.log('booking data', this.BookingListdata);
    });
  }
  ViewMorePopup(i: any) {
    this.viewmorepopupdata = this.BookingListdata[i];

    this.ViewMorePopupPanel = !this.ViewMorePopupPanel;
  }

  CloseMoreViewPopup() {
    this.ViewMorePopupPanel = false;
  }
  searchData() {
    this.BookingReviewList(this.config.currentPage);
  }
  searchDataSingleBooking() {
    this.singleBookingRecords();
  }
}
