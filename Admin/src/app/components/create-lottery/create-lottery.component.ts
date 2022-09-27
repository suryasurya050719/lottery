import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Board } from '../../service/board';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-lottery',
  templateUrl: './create-lottery.component.html',
  styleUrls: ['./create-lottery.component.css'],
})
export class CreateLotteryComponent implements OnInit {
  constructor(
    private changeRef: ChangeDetectorRef,
    public board: Board,
    public datePipe: DatePipe
  ) {}
  CreateBoardPopup: boolean = false;
  t: boolean = false;

  // input crediential
  ticketPatern: String = '';
  boardName: String = '';
  ticketPattenArry: any = [];
  ticketLetter: any = [];
  ticketValue: string = '';
  GamePrice: any = [];
  BoardListdata: any = [];
  GameListdata: any = [];
  activeBoardINdex: number = 0;
  activeGameIndex: number = 0;
  activeBoarddata: any = {};
  activegamedata: any = {};
  boardEdit: boolean = false;
  activeticketPattern: number = 0;
  // board validation

  boardNameError: boolean = false;
  ticketPaternError: boolean = false;
  ticketValueError: boolean = false;
  GamePriceError: boolean = false;

  //ticket price
  ticketname: string = '';
  ticketPrice: string = '';
  ticketnameError: boolean = false;
  ticketPriceError: boolean = false;
  // game crediential
  GameName: string = '';
  BoardID: string = '';
  showCount: string = '';
  startDate: any = '';
  endDate: any = '';
  resultDate: any = '';
  published: boolean = false;
  gameeditable: boolean = false;

  // game error validation
  GameNameError: Boolean = false;
  BoardIDError: Boolean = false;
  showCountError: Boolean = false;
  startDateError: Boolean = false;
  endDateError: Boolean = false;
  resultDateError: Boolean = false;

  ngOnInit(): void {
    // this.CreateBoardBtn();
    // this.removeDubilicateletters();
    this.BoardList();
    this.gameList();
    console.log('boardEdit', this.boardEdit);
  }
  change() {
    this.activeBoarddata = this.BoardListdata[this.activeBoardINdex];
    console.log('this.activeBoarddata', this.activeBoarddata);
  }
  removeDubilicateletters() {
    let data = this.ticketPattenArry;
    let endLetters = [];
    data.forEach((data: any) => {
      let formation = data.match(/.{1,1}/g);
      formation?.forEach((value: any) => {
        if (this.ticketLetter.includes(value) !== true) {
          this.ticketLetter.push(value);
        }
      });
      // console.log('formation', formation);
      // console.log('this.ticketLetter', this.ticketLetter);
    });
  }

  CreateBoardBtn() {
    this.CreateBoardPopup = !this.CreateBoardPopup;
    this.t = !this.t;

    console.log(this.CreateBoardPopup);
    this.changeRef.detectChanges();
  }
  CloseBoardPopup() {
    this.CreateBoardPopup = !this.CreateBoardPopup;

    this.t = !this.t;
    // this.CreateBoardPopup = false;
  }

  // Create Game
  CreateGameFormPopup = false;
  CreateGameBtn() {
    this.CreateGameFormPopup = !this.CreateGameFormPopup;
  }
  CloseCreateGamePopup() {
    this.CreateGameFormPopup = false;
    console.log(this.CreateBoardPopup);
  }

  // Create price popup

  CreatePriceAmountPopup = false;
  CreatePriceAmount() {
    this.CreatePriceAmountPopup = !this.CreatePriceAmountPopup;
  }
  ClosePricePopup() {
    this.CreatePriceAmountPopup = false;
  }

  // add ticket pattern in array

  AddTickPattern() {
    // alert(`add patern is working ${this.ticketPatern}`);
    // console.log('add patern workin ');
    if (this.ticketPatern !== '') {
      this.ticketPattenArry.push(this.ticketPatern);
    }
  }

  // add price amount

  AddPriceAmount() {
    if (this.ticketname !== '' && this.ticketPrice !== '') {
      let data = {
        name: this.ticketname,
        price: this.ticketPrice,
      };
      this.GamePrice.push(data);
    }
    console.log('game', this.GamePrice);
  }

  BoardCreate() {
    this.removeDubilicateletters();
    if (this.boardName == '') {
      this.ticketnameError = true;
    } else if (this.boardName !== '') {
      this.ticketnameError = false;
    }
    if (this.ticketValue == '') {
      this.ticketValueError = true;
    } else {
      this.ticketValueError = false;
    }
    if (this.ticketPattenArry.length == 0) {
      this.ticketPaternError = true;
    } else {
      this.ticketPaternError = false;
    }
    if (this.GamePrice.length == 0) {
      this.GamePriceError = true;
    } else {
      this.GamePriceError = false;
    }
    let data = {
      board_id: this.activeBoarddata.board_id,
      board_name: this.boardName,
      ticket_price: this.ticketValue,
      board_letters: this.ticketLetter,
      board_leter_format: this.ticketPattenArry,
      price_amount: this.GamePrice,
    };
    if (
      this.ticketname !== '' &&
      this.ticketValue !== '' &&
      this.ticketPattenArry.length !== 0 &&
      this.GamePrice.length !== 0
    ) {
      if (this.boardEdit == true) {
        this.board.BoardUpdate(data).subscribe((data) => {
          console.log('><<<<<<<<<', data);
          if (data.statuscode == 200) {
            alert('Board updated successfully');
          }
          this.boardEdit = false;
        });
      } else {
        this.board.BoardCreate(data).subscribe((data) => {
          if (data.statuscode == 200) {
            alert('Board created successfully');
          }
          console.log('>>>>>>', data);
        });
      }
    }
  }
  EditBoard() {
    alert('asjcdnaks');
    this.boardEdit = true;
    this.boardName = this.activeBoarddata.board_name;
    this.ticketPattenArry = this.activeBoarddata.board_leter_format;
    this.GamePrice = this.activeBoarddata.price_amount;
    this.ticketValue = this.activeBoarddata.ticket_price;
  }
  RemoveBoard() {
    let id = this.activeBoarddata.board_id;
    if (confirm('Are you sure you want to remove this Board')) {
      this.board.BoardRemove(Number(id)).subscribe((data) => {
        console.log('data', data);
        this.BoardList();
      });
    }
  }
  GamePriceDelete(index: number) {
    this.GamePrice.splice(index, 1);

    console.log('this.GamePrice', this.GamePrice);
  }
  BoardList() {
    this.board.BoardList().subscribe((data: any) => {
      this.BoardListdata = data.data;
      console.log('this.bord list', this.BoardListdata);
    });
  }
  activeletterpatters(index: any) {
    this.ticketPatern = this.ticketPattenArry[index];
    this.activeticketPattern = index;
  }
  removeticketPattern() {
    if (this.ticketPatern !== '') {
      this.ticketPattenArry.splice(this.activeticketPattern, 1);
    }
  }

  // create board

  GameCreate() {
    if (this.GameName == '') {
      this.GameNameError = true;
    } else {
      this.GameNameError = false;
    }
    if (this.BoardID == '') {
      this.BoardIDError = true;
    } else {
      this.BoardIDError = false;
    }
    if (this.showCount == '') {
      this.showCountError = true;
    } else {
      this.showCountError = false;
    }
    if (this.startDate == '') {
      this.startDateError = true;
    } else {
      this.startDateError = false;
    }
    if (this.endDate == '') {
      this.endDateError = true;
    } else {
      this.endDateError = false;
    }
    if (this.resultDate == '') {
      this.resultDateError = true;
    } else {
      this.resultDateError = false;
    }
    let data = {
      game_id: this.activegamedata.game_id,
      game_name: this.GameName,
      board_id: this.BoardID,
      status: this.published,
      showCount: this.showCount,
      color: '',
      stacrt_date: this.startDate,
      end_date: this.endDate,
      result_date: this.resultDate,
    };
    if (
      this.GameName !== '' &&
      this.BoardID !== '' &&
      this.showCount !== '' &&
      this.startDate !== '' &&
      this.endDate !== '' &&
      this.resultDate !== ''
    ) {
      if (this.gameeditable == true) {
        this.board.GameUpdate(data).subscribe((data) => {
          this.CreateGameFormPopup = false;
          if (data.statuscode == 200) {
            alert('Game updated successfully');
          }
          this.gameeditable = false;
          this.gameList();
        });
      } else {
        this.board.GameCreate(data).subscribe((data) => {
          if (data.statuscode == 200) {
            alert('Game created successfully');
          }
          this.CreateGameFormPopup = false;
          this.gameList();
        });
      }
    }
  }

  gameList() {
    this.board.GameList().subscribe((data) => {
      console.log('data', data.data);
      this.GameListdata = data.data;
    });
  }
  EditGame(index: any) {
    this.CreateGameFormPopup = !this.CreateGameFormPopup;
    this.gameeditable = true;
    console.log('index', index);
    this.activeGameIndex = index;
    this.activegamedata = this.GameListdata[index];
    console.log('activegamedata', this.activegamedata);
    this.GameName = this.activegamedata.game_name;
    this.BoardID = '2';
    this.showCount = this.activegamedata.showCount;
    //  this.color = this.activegamedata.color
    this.startDate = this.datePipe.transform(
      this.activegamedata.stacrt_date,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.endDate = this.datePipe.transform(
      this.activegamedata.end_date,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.resultDate = this.datePipe.transform(
      this.activegamedata.result_date,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.published = this.activegamedata.status;
  }
  removeGame() {
    if (confirm('Are you sure you want to remove this Game')) {
      this.board.GameRemove(this.activegamedata.game_id).subscribe((data) => {
        console.log('data is working', data);
        if (data.statuscode == 200) {
          alert('Game removed successfully');
        }
        this.CreateGameFormPopup = false;
        this.gameList();
      });
    }
  }
  Unpublised(id: number, status: string) {
    if (confirm('Are you sure you want to change status')) {
      this.board.GameStatusChange(id, status).subscribe((data) => {
        if (data.statuscode == 200) {
          alert('Game status change successfully');
        }
        console.log('data', data);
        this.gameList();
      });
    }
  }
}
