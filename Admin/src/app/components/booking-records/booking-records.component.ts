import { Component, OnInit } from '@angular/core';
import { Booking } from '../../service/booking';
import { Board } from '../../service/board';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-booking-records',
  templateUrl: './booking-records.component.html',
  styleUrls: ['./booking-records.component.css'],
})
export class BookingRecordsComponent implements OnInit {
  pokemonControl = new FormControl('');
  BoardNameControler = new FormControl('');
  //pagination
  config: any;
  bookingDataConfid: any;
  // search filter model
  searchType: string = '';
  fromDate: string = '';
  toDate: string = '';
  gameType: string = '';

  // advance search
  advanceSearch: boolean = false;
  phone: string = '';
  user_id: string = '';

  //search filter
  user_type: any = '';
  referal_user_id: string = '';
  gamelistdata: any = [];
  game_type: any = '';
  toppingList: any = {};
  board_type: any = [{}];
  newDate: Date = new Date();
  game_name: string = '';
  GameName: string = '';

  // booking list data
  BookingListdata: any = [];
  userbasedBooking: any = [];
  viewmorepopupdata: any = {};
  TotalBookingAmount: number = 0;
  constructor(private booking: Booking, private board: Board) {
    this.config = {
      id: 'pagination1',
      currentPage: 1,
      itemsPerPage: 5,
    };
    this.bookingDataConfid = {
      id: 'pagination2',
      currentPage: 1,
      itemsPerPage: 5,
    };
  }

  ngOnInit(): void {
    this.BookingList(this.config.currentPage);
    this.gameList();
  }
  gameList() {
    this.board.GameList().subscribe((data) => {
      console.log('data for game list', data.data);
      this.gamelistdata = data.data;
    });
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
    console.log(' this.toppingList', this.toppingList);
  }
  AdvancedSearch() {
    this.advanceSearch = !this.advanceSearch;

    console.log('this.advanceSearch', this.advanceSearch);
  }
  show_time() {
    console.log('board_type', this.board_type);
  }
  board_detail() {
    console.log('board_type', this.BoardNameControler);
  }
  BookingList(newPage: number) {
    console.log('searchType', this.searchType);
    console.log('user_type', this.user_type);
    console.log('this.GameName', this.GameName);

    let data = {
      searchType: this.searchType,
      role_id: this.user_type,
      show_time: this.pokemonControl.value,
      board_name: this.BoardNameControler.value,
      fromdate: this.fromDate !== '' ? new Date(this.fromDate) : '',
      todate: this.toDate !== '' ? new Date(this.toDate) : '',
      game_name: this.GameName,
      phonenumber: this.phone,
      user_id: this.user_id,
      referal_user_id: this.referal_user_id,
    };
    this.booking.BookingRecordsList(data).subscribe((data) => {
      this.BookingListdata = data.data;
      this.config.currentPage = newPage;
      console.log('booking data', this.BookingListdata);
      console.log(' this.config', this.config);
    });
    this.booking.UserBasedBookingsList(data).subscribe((data) => {
      this.userbasedBooking = data.data;
      this.TotalBookingAmount = data.total;
      console.log('userbasedBooking', data);
    });
  }
  ViewMorePopupPanel = false;
  ViewMorePopup() {
    this.ViewMorePopupPanel = !this.ViewMorePopupPanel;
  }

  CloseMoreViewPopup() {
    this.ViewMorePopupPanel = false;
  }

  ViewMorePopupPanel2 = false;
  ViewMorePopup2(i: any) {
    let overAllCount = this.config.currentPage * this.config.itemsPerPage;
    let indexCount = this.config.itemsPerPage - (i + 1);

    let index = overAllCount - indexCount;
    console.log('index>>>>>>>>>>>', index);
    this.viewmorepopupdata = this.BookingListdata[index];
    console.log('this.viewmorepopupdata', this.viewmorepopupdata);
    this.ViewMorePopupPanel2 = !this.ViewMorePopupPanel2;
  }

  CloseMoreViewPopup2() {
    this.ViewMorePopupPanel2 = false;
  }

  ViewMorePopupPanel3 = false;
  ViewMorePopup3(i: any) {
    this.viewmorepopupdata = this.BookingListdata[i];
    console.log('this.viewmorepopupdata', this.viewmorepopupdata);
    this.ViewMorePopupPanel3 = !this.ViewMorePopupPanel3;
  }

  CloseMoreViewPopup3() {
    this.ViewMorePopupPanel3 = false;
  }
  ViewMorePopupPanel4 = false;
  ViewMorePopup4(i: any) {
    this.viewmorepopupdata = this.BookingListdata[i];
    console.log('this.viewmorepopupdata', this.viewmorepopupdata);
    this.ViewMorePopupPanel4 = !this.ViewMorePopupPanel4;
  }
  CloseMoreViewPopup4() {
    this.ViewMorePopupPanel4 = false;
  }
  Search() {
    this.BookingList(this.config.currentPage);
  }
  advancesearch() {
    this.BookingList(this.config.currentPage);
  }
}
