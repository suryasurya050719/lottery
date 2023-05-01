import { Component, OnInit } from '@angular/core';
import { Booking } from '../../service/booking';
import { Board } from '../../service/board';
import { FormControl } from '@angular/forms';
// import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css'],
})
export class BookingReviewComponent implements OnInit {
  pokemonControl = new FormControl('');
  BoardNameControler = new FormControl('');
  config: any;
  bookingDataConfid: any;
  constructor(private booking: Booking, private board: Board) {
    this.config = {
      id: 'pagination1',
      currentPage: 1,
      itemsPerPage: 1,
    };
    this.bookingDataConfid = {
      id: 'pagination2',
      currentPage: 1,
      itemsPerPage: 5,
    };
  }
  referal_user_id: string = '';
  reviewList: any = [];
  BookingListdata: any = [];
  viewmorepopupdata: any = [];
  activateUserID: string = '';
  // filter data
  fromDate: any = '';
  toDate: any = '';
  user_type: any = '2';
  game_type: any = '';
  board_type: any = [{}];
  user_id: any = '';
  phone: any = '';
  toppingList: any = [];
  gamelistdata: any = [];
  ShowTime_details: string = '';
  GameName: string = '';
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
      refered_role_id: this.user_type,
      referal_user_id: localStorage.getItem('lottryuserid'),
    };
    console.log('data', data);
    this.booking.ReferedBookingList(data).subscribe((data) => {
      this.reviewList = data.data;
      console.log('this review list', this.reviewList);
      this.config.currentPage = newPage;
      let currentData = this.reviewList[newPage - 1];
      this.activateUserID = currentData.user_id;
      // this.singleBookingRecords(this.bookingDataConfid.currentPage);
      this.singleBookingRecords(this.bookingDataConfid.bookingcurrentPage);
    });
  }
  show_time() {
    console.log('board_type', this.pokemonControl);
  }
  board_detail() {
    console.log('board_type', this.BoardNameControler);
  }
  game() {
    console.log('this.game_type', typeof this.game_type);
    if (this.game_type == '') {
      this.toppingList = this.gamelistdata;
      this.GameName = '';
    } else {
      // console.log("this.gamelistdata[this.game_type];",this.gamelistdata[this.game_type])
      this.toppingList = [];
      this.toppingList.push(this.gamelistdata[this.game_type]);
      this.GameName = this.gamelistdata[this.game_type].game_name;
    }
  }
  ShowTime(data: any) {
    console.log('ShowTime_details', data);
  }
  ViewMorePopupPanel = false;
  singleBookingRecords(newPage: number) {
    // console.log('singleBookingRecords'), newPage;
    let data = {
      fromdate: this.fromDate !== '' ? new Date(this.fromDate) : '',
      todate: this.toDate !== '' ? new Date(this.toDate) : '',
      user_id: this.activateUserID,
      game_name: this.GameName,
      phonenumber: this.phone,
      show_time: this.pokemonControl.value,
      board_name: this.BoardNameControler.value,
    };
    console.log('pokemonControl', this.pokemonControl.value);
    console.log('BoardNameControler', this.BoardNameControler.value);
    this.booking.BookingList(data).subscribe((data) => {
      this.BookingListdata = data.data;
      // this.bookingDataConfid.currentPage = newPage;
      this.bookingDataConfid.currentPage = newPage;
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
    this.singleBookingRecords(this.bookingDataConfid.bookingcurrentPage);
    // this.singleBookingRecords(this.bookingDataConfid.currentPage);
  }
}
