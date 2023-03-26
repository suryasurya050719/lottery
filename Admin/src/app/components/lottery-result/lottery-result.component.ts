import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Board } from '../../service/board';
import { LotteryResult } from '../../service/lottery_result';

@Component({
  selector: 'app-lottery-result',
  templateUrl: './lottery-result.component.html',
  styleUrls: ['./lottery-result.component.css'],
})
export class LotteryResultComponent implements OnInit {
  pokemonControl = new FormControl('');
  BoardNameControler = new FormControl('');
  config: any;
  bookingDataConfid: any;
  constructor(private board: Board, private lotteryResult: LotteryResult) {
    this.config = {
      id: 'pagination1',
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.bookingDataConfid = {
      id: 'pagination2',
      currentPage: 1,
      itemsPerPage: 10,
    };
  }
  previewPaggination: Boolean = false;
  publishedPaggination: Boolean = true;
  letterFormat: any = [];
  previewData: any = [];
  game_type: any = '';
  board_type: any = '';
  result_data: boolean = false;
  GameName: any = '';
  boardName: String = '';
  fromDate: any = '';
  toppingList: any = [];
  boardList: any = [];
  gamelistdata: any = [];
  result_numerick: any = {
    A: '',
    B: '',
    C: '',
  };
  AdminEnteredShowNumber: any = [];
  // advance search
  advanceSearch: boolean = false;
  totalTickets: string = '';
  totalCollection: number = 0;
  totalcomissiondetect: number = 0;
  netAmount: number = 0;
  winingPrice: number = 0;
  totalIncome: number = 0;
  gameStatus: string = '';
  status: string = '';
  numerick_type: string = '';
  currentGame: any = {};
  activrBookingData: any = {};
  inputDisabled: boolean = false;
  ViewMorePopupPanel4: boolean = false;
  ViewMorePopupPanel5: boolean = false;
  unpublished_result: string = '';
  unpublished_data: any = {};
  publishedstatus: any = [];
  publishedstatusHTML: any = [];
  ngOnInit(): void {
    this.gameList();
    this.publishedStatus();
  }
  publishedStatus() {
    let name =
      this.gamelistdata[this.game_type]?.game_name !== undefined
        ? this.gamelistdata[this.game_type]?.game_name
        : '';

    console.log('data===>>>>', name);
    this.lotteryResult.PublishedStatus(name).subscribe(async (data) => {
      console.log('published status data', data.data);
      this.publishedstatus = await data.data;
      await data.data.forEach(async (element: any) => {
        console.log('element.showTime', element.showTime);
        let time = new Date(element.showTime);
        time.setUTCHours(time.getUTCHours() + 5);
        time.setUTCMinutes(time.getUTCMinutes() + 30);
        element['showTime'] = await time.toUTCString();
        console.log('elememt', element);
      });
      this.publishedstatusHTML = data.data;
    });
  }
  unpublished_status() {
    console.log('unpublished_result', this.unpublished_result);
     console.log('unpublished_result', this.publishedstatus);
    this.unpublished_data = this.publishedstatus[this.unpublished_result];
    console.log('data', this.unpublished_data);
  }

  show_time() {
    console.log('board_type', this.pokemonControl);
  }
  board_detail() {
    console.log('board_type', this.BoardNameControler);
  }
  game() {
    console.log('this.game_type', this.game_type);
    if (this.game_type == '') {
      this.boardList = this.gamelistdata;
      // this.GameName = '';
    } else {
      this.boardList = [];
      this.boardList.push(this.gamelistdata[this.game_type]);
      // this.GameName = this.gamelistdata[this.game_type].game_name;
    }
    this.toppingList = [];
    this.toppingList.push(this.gamelistdata[this.game_type]);
    this.GameName = this.gamelistdata[this.game_type].game_name;
    this.publishedStatus();
    this.currentGame = this.gamelistdata[this.game_type];
    let lengthofdata = this.toppingList[0].brd.length;
    this.letterFormat = this.toppingList[0].brd[lengthofdata - 1].board_letters;
    console.log('data', this.letterFormat);
    // }
    // console.log('this.toppingList', this.toppingList);
  }
  activeBoard() {
    console.log('activeBoard', this.board_type);
    this.boardName = this.currentGame.brd[this.board_type].board_name;
    console.log('this.boardName', this.boardName);
  }
  ViewMorePopupPanel2 = false;
  ResultIntSrt(event: any) {
    let targetName = event.target.name;
    let targetValue = event.target.value;
    console.log('targetValue.length! > 0', targetValue.length);
    if (targetValue.length! > 0) {
      if (targetValue.length! < 2) {
        let array = { ...this.result_numerick, [targetName]: targetValue };
        console.log('array', array);
        this.result_numerick = array;
      } else {
        let array = { ...this.result_numerick, [targetName]: '' };
        console.log('array', array);
        this.result_numerick = array;
        event.target.value = '';
        alert('Must have only one Digit Numeric');
      }
    }
  }
  LockInputField() {
    const isEmpty = Object.values(this.result_numerick).every((x) => x !== '');
    console.log('isempty', isEmpty);
    if (isEmpty) {
      this.inputDisabled = true;
    } else {
      alert(' Please Fill All Numeric in Valid Format');
    }
  }
  ViewMorePopup2(index: any) {
    this.activrBookingData = this.previewData[index];
    console.log('this.activrBookingData', this.activrBookingData);
    this.ViewMorePopupPanel2 = !this.ViewMorePopupPanel2;
  }
  ViewMorePopup4() {
    this.ViewMorePopupPanel4 = true;
  }
  ViewMorePopup5() {
    this.ViewMorePopupPanel5 = true;
  }
  searchData() {
    this.result_data = true;
    // this.BookingReviewList(this.config.currentPage);
  }
  CloseMoreViewPopup2() {
    this.ViewMorePopupPanel2 = false;
  }
  gameList() {
    this.board.gameandboard().subscribe((data) => {
      console.log('data for game list', data.data);
      this.gamelistdata = data.data;
    });
  }

  ViewMorePopupPanel3 = false;
  ViewMorePopup3() {
    this.ViewMorePopupPanel3 = !this.ViewMorePopupPanel3;
  }

  CloseMoreViewPopup3() {
    this.ViewMorePopupPanel3 = false;
  }
  CloseMoreViewPopup4() {
    this.ViewMorePopupPanel4 = false;
  }
  CloseMoreViewPopup5() {
    this.ViewMorePopupPanel5 = false;
  }
  AdvancedSearch() {
    this.advanceSearch = !this.advanceSearch;

    console.log('this.advanceSearch', this.advanceSearch);
  }
  advancesearch() {
    this.Preview(this.config.currentPage);
  }
  // preview

  Preview(newPage: any) {
    (this.previewPaggination = true), (this.publishedPaggination = false);
    const isEmpty = Object.values(this.result_numerick).every((x) => x !== '');
    const data = Object.values(this.result_numerick);
    const arr = Object.entries(this.result_numerick).map(([key, value]) => ({
      key,
      value,
    }));
    this.AdminEnteredShowNumber = arr;
    console.log('this.result_numerick', arr);
    console.log('data', data);
    console.log('isempty', isEmpty);
    if (isEmpty) {
      console.log('this.unpublished_data.game_name', this.unpublished_data);
      let time =new Date(this.unpublished_data.showTime)
             time.setUTCHours(time.getUTCHours() - 5);
        time.setUTCMinutes(time.getUTCMinutes() - 30);
        // element['showTime'] = await time.toUTCString();
      let prepareData = {
        resultData: data,
        game_name: this.unpublished_data.game_name,
        show:  time.toISOString(),
        date: this.unpublished_data.date,
        board_name:
          this.BoardNameControler.value.length > 0
            ? this.BoardNameControler.value
            : '',
      };
      console.log('prepareData', prepareData);
      this.lotteryResult.Preview(prepareData).subscribe((data) => {
        console.log('preview data===>', data.result.data);
        this.previewData = data.result.data;
        this.config.currentPage = newPage;
        console.log('this.previewData', this.previewData);
        this.totalTickets = data.result.overallTicket;
        this.totalCollection = data.result.overallTicetprice;
        this.totalcomissiondetect = data.result.total_refered_comission;
        this.netAmount = this.totalCollection - this.totalcomissiondetect;
        this.winingPrice = data.result.overalluserprice;
        this.totalIncome = this.netAmount - this.winingPrice;
        this.gameStatus =
          this.netAmount - this.winingPrice > 0 ? 'Profit' : 'Loss';
        this.status = 'Unpublish';
      });
    } else {
      alert(' Please Fill All Numeric in Valid Format');
    }
  }
  Published(newPage: any) {
    (this.previewPaggination = false), (this.publishedPaggination = true);
    const isEmpty = Object.values(this.result_numerick).every((x) => x !== '');
    const data = Object.values(this.result_numerick);
    const arr = Object.entries(this.result_numerick).map(([key, value]) => ({
      key,
      value,
    }));
    this.AdminEnteredShowNumber = arr;
    console.log('this.result_numerick', arr);
    console.log('data', data);
    console.log('isempty', isEmpty);
    if (isEmpty) {
        console.log('this.unpublished_data.game_name', this.unpublished_data);
      let time =new Date(this.unpublished_data.showTime)
             time.setUTCHours(time.getUTCHours() - 5);
        time.setUTCMinutes(time.getUTCMinutes() - 30);
        // element['showTime'] = await time.toUTCString();
      let prepareData = {
        resultData: data,
        game_name: this.unpublished_data.game_name,
        show: time.toISOString(),
        date: this.unpublished_data.date,
        unpublished_id: this.unpublished_data._id,
        board_name:
          this.BoardNameControler.value.length > 0
            ? this.BoardNameControler.value
            : '',
      };
      console.log('prepareData', prepareData);
      this.lotteryResult.Published(prepareData).subscribe((data) => {
        console.log('preview data===>', data.result.data);
        this.previewData = data.result.data;
        this.bookingDataConfid.currentPage = newPage;
        console.log('this.previewData', this.previewData);
        this.totalTickets = data.result.overallTicket;
        this.totalCollection = data.result.overallTicetprice;
        this.totalcomissiondetect = data.result.total_refered_comission;
        this.netAmount = this.totalCollection - this.totalcomissiondetect;
        this.winingPrice = data.result.overalluserprice;
        this.totalIncome = this.netAmount - this.winingPrice;
        this.gameStatus =
          this.netAmount - this.winingPrice > 0 ? 'Profit' : 'Loss';
        this.status = 'publish';
      });
    } else {
      alert(' Please Fill All Numeric in Valid Format');
    }
  }
}
