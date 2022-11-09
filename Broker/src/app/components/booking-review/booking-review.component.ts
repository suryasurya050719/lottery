import { Component, OnInit } from '@angular/core';
import { Booking } from '../../service/booking';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css'],
})
export class BookingReviewComponent implements OnInit {
  config: any;
  constructor(private booking: Booking) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 1,
    };
  }
  reviewList: any = [];
  BookingListdata: any = [];
  viewmorepopupdata: any = [];
  activateUserID: string = '';
  // filter data
  fromDate: any = '';
  toDate: any = '';
  user_type: any = '';
  game_type: any = '';
  board_type: any = '';
  user_id: any = '';
  phone: any = '';
  ngOnInit(): void {
    this.BookingReviewList(this.config.currentPage);
  }
  BookingReviewList(newPage: number) {
    let data = {
      user_id: this.user_id,
      phonenumber: this.phone,
    };
    this.booking.BookingReviewList(data).subscribe((data) => {
      this.reviewList = data.data;
      console.log('this review list', this.reviewList);
      this.config.currentPage = newPage;
      let currentData = this.reviewList[newPage - 1];
      this.activateUserID = currentData.user_id;
      this.singleBookingRecords();
    });
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
