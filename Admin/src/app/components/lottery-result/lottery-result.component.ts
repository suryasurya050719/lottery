import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Board } from '../../service/board';

@Component({
  selector: 'app-lottery-result',
  templateUrl: './lottery-result.component.html',
  styleUrls: ['./lottery-result.component.css'],
})
export class LotteryResultComponent implements OnInit {
  pokemonControl = new FormControl('');

  constructor(private board: Board) {}
  letterFormat: any = [];
  game_type: any = '';
  result_data: boolean = false;
  GameName: any = '';
  fromDate: any = '';
  toppingList: any = [];
  gamelistdata: any = [];
  result_numerick: any = {
    X: '',
    A: '',
    B: '',
    C: '',
  };
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
    let lengthofdata = this.toppingList[0].brd.length;
    this.letterFormat = this.toppingList[0].brd[lengthofdata - 1].board_letters;
    console.log('data', this.letterFormat);
    // }
    // console.log('this.toppingList', this.toppingList);
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
}
