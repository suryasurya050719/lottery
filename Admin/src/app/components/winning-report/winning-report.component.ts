import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Board } from '../../service/board';
import { LotteryResult } from '../../service/lottery_result';

@Component({
  selector: 'app-winning-report',
  templateUrl: './winning-report.component.html',
  styleUrls: ['./winning-report.component.css'],
})
export class WinningReportComponent implements OnInit {
  constructor(private board: Board, private lotteryResult: LotteryResult) {}
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
  searchType: string = '';
  fromDate: any = '';
  toDate: any = '';
  winningRecords:any=[]
  winningBookingRecords:any=[]

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

    let prepareData: any = {
      game_name: name,
    };
    if (this.searchType == '2') {
      prepareData['toDate'] = new Date();
      prepareData['fromDate'] = new Date();
    } else if (this.searchType == '3') {
      prepareData['toDate'] = this.toDate;
      prepareData['fromDate'] = this.fromDate;
    }
    console.log('data===>>>>', prepareData);
    this.lotteryResult.published(prepareData).subscribe(async (data) => {
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

  winningRecordes() {
    console.log('log>>>>>>>');
    let time = new Date(this.unpublished_data.showTime);
    time.setUTCHours(time.getUTCHours() - 5);
    time.setUTCMinutes(time.getUTCMinutes() - 30);
    let prepareData: any = {
      game_name: this.GameName,
      showTime: time.toISOString(),
    };

    this.lotteryResult.winningRecord(prepareData).subscribe(async (data) => {
      console.log("data",data)
      this.winningRecords=data.data
      let result =this.winningRecords[0]
      result["booking_data"]=[]
      result.wining_booking.forEach((data:any)=>{
         if (data.winning_data>0) {
          result.booking_data.push(data)
         }
      })
      delete result.wining_booking
      console.log("this.winningRecords",this.winningRecords)
    })

    console.log('loged', prepareData);
  }
}
