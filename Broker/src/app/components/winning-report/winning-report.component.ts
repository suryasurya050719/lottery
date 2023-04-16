import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Board } from '../../service/board'
import { LotteryResult } from '../../service/lottery_result'

@Component({
  selector: 'app-winning-report',
  templateUrl: './winning-report.component.html',
  styleUrls: ['./winning-report.component.css']
})
export class WinningReportComponent implements OnInit {

  constructor(private board: Board, private lotteryResult: LotteryResult) { }
  gamelistdata: any = []
  game_type: any = ''
  boardList: any = []
  toppingList: any = []
  GameName: any = ''
  publishedstatus: any = []
  publishedstatusHTML: any = []
  currentGame: any = {}
  letterFormat: any = []
  unpublished_result: string = ''
  unpublished_data: any = {}
  result_data: boolean = false
  searchType: string = ''
  fromDate: any = ''
  toDate: any = ''
  winningRecords: any = []
  winningBookingRecords: any = []

  totalTickets: any = ''
  totalCollection: any = ''
  totalcomissiondetect: any = ''
  netAmount = this.totalCollection - this.totalcomissiondetect
  winingPrice: any = ''
  totalIncome = this.netAmount - this.winingPrice
  status: string = ''
  gameStatus: any = ''
  activrBookingData: any = {}
  winning_number_letters: any = {}
  user_id:string=""
  ngOnInit(): void {
    this.gameList()
  }
  gameList() {
    this.board.gameandboard().subscribe((data) => {
      console.log('data for game list', data.data)
      this.gamelistdata = data.data
    })
  }
  publishedStatus() {
    let name =
      this.gamelistdata[this.game_type]?.game_name !== undefined
        ? this.gamelistdata[this.game_type]?.game_name
        : ''

    let prepareData: any = {
      game_name: name,
    }
    if (this.searchType == '2') {
      prepareData['toDate'] = new Date()
      prepareData['fromDate'] = new Date()
    } else if (this.searchType == '3') {
      prepareData['toDate'] = this.toDate
      prepareData['fromDate'] = this.fromDate
    }
    console.log('data===>>>>', prepareData)
    this.lotteryResult.published(prepareData).subscribe(async (data) => {
      console.log('published status data', data.data)
      this.publishedstatus = await data.data
      await data.data.forEach(async (element: any) => {
        console.log('element.showTime', element.showTime)
        let time = new Date(element.showTime)
        time.setUTCHours(time.getUTCHours() + 5)
        time.setUTCMinutes(time.getUTCMinutes() + 30)
        element['showTime'] = await time.toUTCString()
        console.log('elememt', element)
      })
      this.publishedstatusHTML = data.data
    })
  }
  game() {
    console.log('this.game_type', this.game_type)
    if (this.game_type == '') {
      this.boardList = this.gamelistdata
      // this.GameName = '';
    } else {
      this.boardList = []
      this.boardList.push(this.gamelistdata[this.game_type])
      // this.GameName = this.gamelistdata[this.game_type].game_name;
    }
    this.toppingList = []
    this.toppingList.push(this.gamelistdata[this.game_type])
    this.GameName = this.gamelistdata[this.game_type].game_name
    this.publishedStatus()
    this.currentGame = this.gamelistdata[this.game_type]
    let lengthofdata = this.toppingList[0].brd.length
    this.letterFormat = this.toppingList[0].brd[lengthofdata - 1].board_letters
    console.log('data', this.letterFormat)
    // }
    // console.log('this.toppingList', this.toppingList);
  }
  unpublished_status() {
    console.log('unpublished_result', this.unpublished_result)
    console.log('unpublished_result', this.publishedstatus)
    this.unpublished_data = this.publishedstatus[this.unpublished_result]
    console.log('data', this.unpublished_data)
  }
  searchData() {
    this.result_data = true
    // this.BookingReviewList(this.config.currentPage);
  }

  winningRecordes() {
    console.log('log>>>>>>>')
    let time = new Date(this.unpublished_data.showTime)
    time.setUTCHours(time.getUTCHours() - 5)
    time.setUTCMinutes(time.getUTCMinutes() - 30)
    let prepareData: any = {
      game_name: this.GameName,
      showTime: time.toISOString(),
      user_id:this.user_id,
      refered_user_id:localStorage.getItem("lottryuserid")
    }

    this.lotteryResult.winningRecord(prepareData).subscribe(async (data) => {
      console.log('data', data.data)
      // let result =this.winningRecords[0]
      data.data[0]['booking_data'] = []
      data.data[0].wining_booking.forEach((winningData: any) => {
        console.log('data', data)
        if (winningData.winning_data.length > 0) {
          data.data[0].booking_data.push(winningData)
        }
      })
      delete data.data[0].wining_booking
      this.winningRecords = data.data[0]
      const arr = Object.entries(
        this.winningRecords.winning_number_letters,
      ).map(([key, value]) => ({
        key,
        value,
      }))
      this.winning_number_letters = arr

      console.log("this.winning_number_letters",this.winning_number_letters)
      this.totalTickets = this.winningRecords.overallTicket
      this.totalCollection = this.winningRecords.overallTicetprice
      this.totalcomissiondetect = this.winningRecords.total_refered_comission
      this.netAmount = this.totalCollection - this.totalcomissiondetect
      this.winingPrice = this.winningRecords.overalluserprice
      this.totalIncome = this.netAmount - this.winingPrice
      this.gameStatus =
        this.netAmount - this.winingPrice > 0 ? 'Profit' : 'Loss'
      this.status = 'publish'
      console.log('this.winningRecords', this.winningRecords)
    })

    console.log('loged', prepareData)
  }
  ViewMorePopupPanel2 = false

  ViewMorePopup2(index: any) {
    console.log('index', index)
    console.log(
      'this.winningRecords.wining_booking',
      this.winningRecords.booking_data[index],
    )
    this.activrBookingData = this.winningRecords.booking_data[0]
    console.log('this.activrBookingData', this.activrBookingData)
    this.ViewMorePopupPanel2 = !this.ViewMorePopupPanel2
  }
  ViewMorePopupPanel4 = false
  ViewMorePopupPanel5 = false
  ViewMorePopup4() {
    this.ViewMorePopupPanel4 = true
  }
  ViewMorePopup5() {
    this.ViewMorePopupPanel5 = true
  }
  CloseMoreViewPopup2() {
    this.ViewMorePopupPanel2 = false
  }
  CloseMoreViewPopup4() {
    this.ViewMorePopupPanel4 = false
  }
  CloseMoreViewPopup5() {
    this.ViewMorePopupPanel5 = false
  }

}
