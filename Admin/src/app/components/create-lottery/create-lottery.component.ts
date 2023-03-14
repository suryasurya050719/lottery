import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Board } from '../../service/board';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Dropdown } from 'src/app/service/dropdown';

@Component({
  selector: 'app-create-lottery',
  templateUrl: './create-lottery.component.html',
  styleUrls: ['./create-lottery.component.css'],
})
export class CreateLotteryComponent implements OnInit {
  constructor(
    private changeRef: ChangeDetectorRef,
    public board: Board,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private Dropdown:Dropdown
  ) {
    this.form = this.formBuilder.group({
      participants: new FormArray([]),
    });
    // this.addCheckboxes();
  }
  selected_board = new FormControl();
  // selectedBoards: any = [];
  form: FormGroup;
  interestFormGroup: FormGroup;
  CreateBoardPopup: boolean = false;
  t: boolean = false;
  array: any = [];
  selectedValue: any = [];
  // get participantsFormArray() {
  //   return this.form.controls['participantIds'] as FormArray;
  // }
  // private addCheckboxes() {
  //   this.participantIds.forEach((element) =>
  //     this.participantsFormArray.push(element)
  //   );
  // }
  // formgroups: any = [
  //   { name: 'pepperoni', checked: false },
  //   { name: 'extracheese', checked: false },
  //   { name: 'mushroom', checked: false },
  // ];
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
  activeticketPattern: string = '';
  color: string = '';
  id: any = '';
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
  startDateone: any = '';
  startDatetwo: any = '';
  endDate: any = '';
  endDateone: any = '';
  endDatetwo: any = '';
  resultDate: any = '';
  published: boolean = false;
  gameeditable: boolean = false;
  show_date: any = [];
  // pattern edite

  patternEdite: boolean = false;

  // game error validation
  GameNameError: Boolean = false;
  BoardIDError: Boolean = false;
  showCountError: Boolean = false;
  startDateError: Boolean = false;
  endDateError: Boolean = false;
  resultDateError: Boolean = false;

  // dropdown

  PriceDropDown:any=[]
  BoardDropdown:any=[]
  result: {
    selectedFruit: any;
  } = { selectedFruit: [] };

  // slot add popup credientials
  showTime: string = '';
  closeShowTime: string = '';
  slotTimeList: any = [];

  ngOnInit(): void {
    // this.CreateBoardBtn();
    // this.removeDubilicateletters();
    // this.id = setInterval(() => {
    //   countDown(this.GameListdata);
    // }, 1000);
    // this.form = new FormGroup({
    //   boards: new FormArray([]),
    // });
    this.BoardList();
    this.gameList();
    this.priceDropDown();
    this.boardDropDown()
    console.log('boardEdit', this.boardEdit);
  }

  get ordersFormArray() {
    return this.form.controls?.['orders'] as FormArray;
  }
  boardDropDown(){
    this.Dropdown.board().subscribe((data)=>{
      console.log("data",data)
      this.BoardDropdown=data.data
    })
  }
  priceDropDown(){
this.Dropdown.price().subscribe((data)=>{
  console.log("price drop",data)
  this.PriceDropDown=data.data
})
  }
  getCheckboxes() {
    console.log('selectedValue', this.selectedValue);
    // this.selectedValue = this.array.filter((x: any) => x).map((x: any) => x);
    // console.log('sdafsdf', this.selectedValue);
  }
  change() {
    // alert(">>>>>>>>>>>>>>>>>>>>")
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
  BoardReset() {
    this.boardName = '';
    this.ticketPatern = '';
    this.ticketValue = '';
    this.ticketname = '';
    this.ticketPrice = '';
    this.GamePrice = [];
    this.ticketPattenArry = [];
  }
  CreateBoardBtn() {
    this.BoardReset();
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
    this.selectedValue = [];
    this.GameName = '';
    this.selected_board.reset();
    this.slotTimeList = [];
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
  CreateSlotPopup = false;
  CreateSlotTime() {
    this.CreateSlotPopup = !this.CreateSlotPopup;
  }
  ClosePricePopup() {
    this.CreatePriceAmountPopup = false;
  }
  closeSlotPopup() {
    this.CreateSlotPopup = false;
  }

  // add ticket pattern in array

  AddTickPattern() {
    if (this.ticketPatern !== '' && this.patternEdite == false) {
      this.ticketPattenArry.push(this.ticketPatern);
      this.ticketPatern = '';
    } else {
      this.ticketPattenArry[this.activeticketPattern] = this.ticketPatern;
      this.patternEdite = false;
      this.activeticketPattern = '';
      this.ticketPatern = '';
    }
    console.log('pattern array', this.ticketPattenArry);
    console.log(' this.boardEdit', this.boardEdit);
  }

  // add price amount

  AddPriceAmount() {
    if (this.ticketname !== '' && this.ticketPrice !== '') {
      let data = {
        name: this.ticketname,
        price: this.ticketPrice,
      };
      this.GamePrice.push(data);
      this.ticketname = '';
      this.ticketPrice = '';
    }
    console.log('game', this.GamePrice);
  }
  AddSlotTime() {
    if (this.GameName == '') {
      alert('Game name is required');
    }
    if (
      this.showTime !== '' &&
      this.closeShowTime !== '' &&
      this.GameName !== ''
    ) {
      let data = {
        id: this.slotTimeList.length + 1,
        showTime: this.showTime,
        game_name: this.GameName,
        closeShowTime: this.closeShowTime,
      };
      this.slotTimeList.push(data);
      this.showTime = '';
      this.closeShowTime = '';
    }
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
    console.log(
      'board data ',
      this.boardName !== '' &&
        this.ticketValue !== '' &&
        this.ticketPattenArry.length !== 0 &&
        this.GamePrice.length !== 0
    );
    if (
      this.boardName !== '' &&
      this.ticketValue !== '' &&
      this.ticketPattenArry.length !== 0 &&
      this.GamePrice.length !== 0
    ) {
      if (this.boardEdit == true) {
        this.board.BoardUpdate(data).subscribe((data) => {
          console.log('><<<<<<<<<', data);
          if (data.statuscode == 200) {
            alert('Board updated successfully');
            if (data.statuscode == 200) {
              this.CreateBoardPopup = false;
            }
          }
          this.boardEdit = false;
        });
      } else {
        console.log('dfhd');
        this.board.BoardCreate(data).subscribe((data) => {
          if (data.statuscode == 200) {
            alert('Board created successfully');
          }
          console.log('>>>>>>', data);
          if (data.statuscode == 200) {
            this.CreateBoardPopup = false;
          }
        });
      }
    }
  }
  EditBoard() {
    // this.boardEdit = true;
    this.patternEdite = true;
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
  SlotTimeDelete(index: number) {
    this.slotTimeList.splice(index, 1);
  }
  GamePriceDelete(index: number) {
    this.GamePrice.splice(index, 1);

    console.log('this.GamePrice', this.GamePrice);
  }
  BoardList() {
    this.board.BoardList().subscribe(async (data: any) => {
      this.BoardListdata = data.data;
      await this.BoardListdata.forEach((element: any) => {
        let name = element.board_name;
        let data: any = {};
        // this.formgroups[name] = false;
        data['name'] = name;
        data['checked'] = false;
        this.array.push(data);
        // this.checkbox.push(data);
      });
      // console.log('this.bord list', this.checkbox);
    });
  }
  activeletterpatters(index: any) {
    this.patternEdite = true;
    this.ticketPatern = this.ticketPattenArry[index];
    this.activeticketPattern = index;
  }
  removeticketPattern() {
    if (this.ticketPatern !== '') {
      this.ticketPattenArry.splice(this.activeticketPattern, 1);
    }
  }
  // date time countDown

  // create board

  GameCreate() {
    console.log('xjfc');
    if (this.GameName == '') {
      this.GameNameError = true;
    } else {
      this.GameNameError = false;
    }
    if (this.selectedValue.length == 0) {
      this.BoardIDError = true;
    } else {
      this.BoardIDError = false;
    }
    if (this.slotTimeList.length == 0) {
      this.showCountError = true;
    } else {
      this.showCountError = false;
    }
    if (
      this.GameName !== '' &&
      this.selectedValue.length !== 0 &&
      this.slotTimeList.length !== 0
    ) {
      this.gamesubmit();
    }

    // if (this.showCount == '1') {
    //   console.log('sample', this.showCount, this.startDate, this.endDate);
    //   if (new Date(this.startDate) < new Date(this.endDate)) {
    //     console.log('shoe count one is working');
    //     this.gamesubmit();
    //   } else alert('please choose correct Date and time on First start slot');
    // }
    // if (this.showCount == '2') {
    //   if (
    //     new Date(this.startDate) < new Date(this.startDateone) &&
    //     new Date(this.endDate) < new Date(this.endDateone)
    //   ) {
    //     if (new Date(this.startDate) < new Date(this.endDate)) {
    //       if (new Date(this.startDateone) < new Date(this.endDateone)) {
    //         this.gamesubmit();
    //       } else
    //         alert(
    //           'please choose correct Date and time on second slot start and end date'
    //         );
    //     } else
    //       alert(
    //         'please choose correct Date and time on first slot start and end date'
    //       );
    //   } else alert('please choose correct Date and time on second  slot');
    // }
    // if (this.showCount == '3') {
    //   if (
    //     new Date(this.startDate) < new Date(this.startDateone) &&
    //     new Date(this.endDate) < new Date(this.endDateone)
    //   ) {
    //     if (new Date(this.startDate) < new Date(this.endDate)) {
    //       if (new Date(this.startDateone) < new Date(this.endDateone)) {
    //         if (
    //           new Date(this.startDateone) < new Date(this.startDatetwo) &&
    //           new Date(this.endDateone) < new Date(this.endDatetwo)
    //         ) {
    //           if (new Date(this.startDatetwo) < new Date(this.endDatetwo)) {
    //             this.gamesubmit();
    //           } else
    //             alert(
    //               'please choose correct Date and time on third start and end date '
    //             );
    //         } else
    //           alert('please choose correct Date and time on third start slot ');
    //       } else
    //         alert(
    //           'please choose correct Date and time on second slot start and end date'
    //         );
    //     } else
    //       alert(
    //         'please choose correct Date and time on first slot start and end date'
    //       );
    //   } else alert('please choose correct Date and time on second  slot');
    //   // if (
    //   //   new Date(this.startDate) < new Date(this.startDateone) &&
    //   //   new Date(this.endDate) < new Date(this.endDateone) &&
    //   //   new Date(this.startDate) < new Date(this.endDate) &&
    //   //   new Date(this.startDateone) < new Date(this.endDateone)
    //   // ) {
    //   //   if (
    //   //     new Date(this.startDateone) < new Date(this.startDatetwo) &&
    //   //     new Date(this.endDateone) < new Date(this.endDatetwo) &&
    //   //     new Date(this.startDateone) < new Date(this.endDateone) &&
    //   //     new Date(this.startDatetwo) < new Date(this.endDatetwo)
    //   //   ) {
    //   //     this.gamesubmit();
    //   //   } else {
    //   //     alert('please choose correct Date and time on third start slot ');
    //   //   }
    //   // } else {
    //   //   alert('please choose correct Date and time second start slot ');
    //   // }
    // }
  }
 async gamesubmit() {
    // if (
    //   this.showCount == '1' ||
    //   this.showCount == '2' ||
    //   this.showCount == '3'
    // ) {
    //   let data = {
    //     startDate: this.startDate,
    //     endDate: this.endDate,
    //   };
    //   this.show_date.push(data);
    // }
    // if (this.showCount == '2' || this.showCount == '3') {
    //   let data = {
    //     startDateone: this.startDateone,
    //     endDateone: this.endDateone,
    //   };
    //   this.show_date.push(data);
    // }
    // if (this.showCount == '3') {
    //   let data = {
    //     startDatetwo: this.startDatetwo,
    //     endDatetwo: this.endDatetwo,
    //   };
    //   this.show_date.push(data);
    // }
    let preparedata = {
      game_id: this.activegamedata.game_id,
      game_name: this.GameName,
      board_id: this.array,
      status: this.published,
      showCount: this.showCount,
      color: this.color,
      show_date: this.slotTimeList,
    };
       preparedata.show_date.forEach(async (element:any) => {
      let date = ISOtoLOCALDATE(new Date());
      console.log("date", date);
      //  console.log("preparedata", preparedata);
      let newCloseDate = `${date}T${element.closeShowTime}`;
      let newShowDate = `${date}T${element.showTime}`;
      element.showTime = new Date( newShowDate);
      element.closeShowTime =new Date( newCloseDate);
    });
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>.', this.GameName, this.array.length, this.slotTimeList);
     console.log('>>>>>>>>>>>',JSON.stringify(preparedata) );
    if (
      this.GameName !== '' &&
      this.selectedValue.length !== 0 &&
      this.slotTimeList.length !== 0
    ) {
      console.log('asf entered');
      if (this.gameeditable == true) {
        console.log('asj updated');

        this.board.GameUpdate(preparedata).subscribe((data) => {
          this.CreateGameFormPopup = false;
          if (data.statuscode == 200) {
            alert('Game updated successfully');
          }
          this.gameeditable = false;
          this.gameList();
        });
      } else {
        this.board.GameCreate(preparedata).subscribe((data) => {
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
      var countDownDate = new Date('2022-09-30T19:41:00.000Z').getTime();
      console.log(countDownDate);
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
    this.array = this.activegamedata.board_id;
    this.showCount = this.activegamedata.showCount;
    this.color = this.activegamedata.color;
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
    this.slotTimeList = this.activegamedata.show_date;
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
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}
// function countDown(futureDate: any) {
//   let date = new Date();
//   let hourse = futureDate.getTime() - date.getTime();
//   let data = llocateTimeUnits(hourse);
//   console.log('Welcome to Programiz!', date.getTime());
//   console.log('Welcome to Programiz!', futureDate.getTime());
//   console.log('Welcome to Programiz!', hourse);
//   return data;
// }
// function llocateTimeUnits(timeDifference: any) {
//   let secondsToDday = Math.floor((timeDifference / 1000) % 60);
//   let minutesToDday = Math.floor((timeDifference / (1000 * 60)) % 60);
//   let hoursToDday = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
//   let daysToDday = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   let data = {
//     secondsToDday: secondsToDday,
//     minutesToDday: minutesToDday,
//     hoursToDday: hoursToDday,
//     daysToDday: daysToDday,
//   };
//   console.log('secondsToDday', secondsToDday);
//   console.log('minutesToDday', minutesToDday);
//   console.log('hoursToDday', hoursToDday);
//   console.log('daysToDday', daysToDday);
//   return data;
// }
function ISOtoLOCALDATE(params:any) {
  let date = new Date(params);
 let  year = date.getFullYear();
 let  month:any = date.getMonth() + 1;
 let  dt:any = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
   month = "0" + month;
  }
  return year + "-" + month + "-" + dt;
}