import { Component, OnInit } from '@angular/core';
import { Booking } from '../../service/booking';
import { Board } from '../../service/board';


@Component({
  selector: 'app-booking-records',
  templateUrl: './booking-records.component.html',
  styleUrls: ['./booking-records.component.css'],
})
export class BookingRecordsComponent implements OnInit {
  // search filter model
  searchType: string = '';
  fromDate: string = '';
  toDate: string = '';
  gameType: string = '';

  // advance search
  phone: string = '';
  user_id: string = '';

  //search filter 
  user_type: any = '';
  referal_user_id:string=''
  gamelistdata: any = [];
  game_type: any = '';
  toppingList: any = {};
  board_type: any = [{}];
 newDate:Date=new Date()
game_name:string=''


  // booking list data
  BookingListdata: any = [];
  viewmorepopupdata: any = {};
  constructor(private booking: Booking,private board: Board) {}

  ngOnInit(): void {
    this.BookingList();
    this.gameList()
  }
  gameList() {
    this.board.GameList().subscribe((data) => {
      console.log('data for game list', data.data);
      this.gamelistdata = data.data;
    });
  }
  game() {
    this.toppingList = this.gamelistdata[this.game_type];
    this.game_name=this.toppingList.game_name
    console.log('game_type', this.game_type);
  }
  show_time() {
    console.log('board_type', this.board_type);
  }
  BookingList() {
    let data = {
      fromdate: this.fromDate !== '' ? new Date(this.fromDate) : '',
      todate: this.toDate !== '' ? new Date(this.toDate) : '',
      game_name: this.gameType,
      phonenumber: this.phone,
      user_id: this.user_id,
    };
    this.booking.BookingList(data).subscribe((data) => {
      this.BookingListdata = data.data;
      console.log('booking data', this.BookingListdata);
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
    this.viewmorepopupdata = this.BookingListdata[i];
    console.log('this.viewmorepopupdata', this.viewmorepopupdata);
    this.ViewMorePopupPanel2 = !this.ViewMorePopupPanel2;
  }

  CloseMoreViewPopup2() {
    this.ViewMorePopupPanel2 = false;
  }

  ViewMorePopupPanel3 = false;
  ViewMorePopup3() {
    this.ViewMorePopupPanel3 = !this.ViewMorePopupPanel3;
  }

  CloseMoreViewPopup3() {
    this.ViewMorePopupPanel3 = false;
  }
  Search() {
    this.BookingList();
  }
  advancesearch() {
    this.BookingList();
  }
}
