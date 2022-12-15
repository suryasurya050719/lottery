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

  constructor(private board: Board, private lotteryResult: LotteryResult) {}
  letterFormat: any = [];
  previewData: any = [];
  game_type: any = '';
  board_type: any = '';
  result_data: boolean = false;
  GameName: any = '';
  boardName: String = '';
  fromDate: any = '';
  toppingList: any = [];
  gamelistdata: any = [];
  result_numerick: any = {
    A: '',
    B: '',
    C: '',
  };
  totalTickets: string = '';
  totalCollection: number = 0;
  totalcomissiondetect: number = 0;
  netAmount: number = 0;
  winingPrice: number = 0;
  totalIncome: number = 0;
  gameStatus: string = '';
  status: string = '';
  currentGame: any = {};
  inputDisabled: boolean = false;
  ngOnInit(): void {
    this.gameList();
  }
  show_time() {
    console.log('board_type', this.pokemonControl);
  }
  game() {
    console.log('this.game_type', this.game_type);
    // if (this.game_type == '') {
    //   this.toppingList = this.gamelistdata;
    //   this.GameName = '';
    // } else {
    // console.log("this.gamelistdata[this.game_type];",this.gamelistdata[this.game_type])
    this.toppingList = [];
    this.toppingList.push(this.gamelistdata[this.game_type]);
    this.GameName = this.gamelistdata[this.game_type].game_name;
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
  ViewMorePopup2() {
    this.ViewMorePopupPanel2 = !this.ViewMorePopupPanel2;
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

  // preview

  Preview() {
    this.lotteryResult.Preview().subscribe((data) => {
      console.log('preview data===>', data.result);
      this.previewData = data.result.data;
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
  }
}
