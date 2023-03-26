import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Board } from '../../service/board';
import { LotteryResult } from '../../service/lottery_result';

@Component({
  selector: 'app-winning-report',
  templateUrl: './winning-report.component.html',
  styleUrls: ['./winning-report.component.css']
})
export class WinningReportComponent implements OnInit {

  constructor(private board: Board, private lotteryResult: LotteryResult) { }
  gamelistdata: any = [];
  game_type: any = '';
  boardList: any = [];
  toppingList: any = [];
  GameName: any = '';
    publishedstatus: any = [];
  publishedstatusHTML: any = [];
  currentGame: any = {};
  letterFormat: any = [];
  unpublished_result: string = '';
  unpublished_data: any = {};
  result_data: boolean = false;






  
  ngOnInit(): void {
      this.gameList();
  }
    gameList() {
    this.board.gameandboard().subscribe((data) => {
      console.log('data for game list', data.data);
      this.gamelistdata = data.data;
    });
  }
    publishedStatus() {
    let name =
      this.gamelistdata[this.game_type]?.game_name !== undefined
        ? this.gamelistdata[this.game_type]?.game_name
        : '';

    console.log('data===>>>>', name);
    this.lotteryResult.publishedStatus(name).subscribe(async (data) => {
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
    unpublished_status() {
    console.log('unpublished_result', this.unpublished_result);
     console.log('unpublished_result', this.publishedstatus);
    this.unpublished_data = this.publishedstatus[this.unpublished_result];
    console.log('data', this.unpublished_data);
  }
    searchData() {
    this.result_data = true;
    // this.BookingReviewList(this.config.currentPage);
  }
}
