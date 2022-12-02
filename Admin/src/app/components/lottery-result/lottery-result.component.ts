import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Board } from '../../service/board';



@Component({
  selector: 'app-lottery-result',
  templateUrl: './lottery-result.component.html',
  styleUrls: ['./lottery-result.component.css']
})
export class LotteryResultComponent implements OnInit {
  pokemonControl = new FormControl('');

  constructor(private board: Board) { }
  game_type: any = '';
  result_data:boolean=false
  GameName:any=''
  fromDate:any=''
  toppingList: any = [];
  gamelistdata: any = [];
  ngOnInit(): void {
    this.gameList()
  }
  show_time() {
    console.log('board_type', this.pokemonControl);
  }
  game() {
    console.log("this.game_type", this.game_type)
    if (this.game_type == '') {
      this.toppingList = this.gamelistdata;
      this.GameName=""
    } else {
      // console.log("this.gamelistdata[this.game_type];",this.gamelistdata[this.game_type])
      this.toppingList=[]
      this.toppingList.push(this.gamelistdata[this.game_type]);
      this.GameName=this.gamelistdata[this.game_type].game_name
    }
  }
  ViewMorePopupPanel2 = false;
  ViewMorePopup2(){
    this.ViewMorePopupPanel2 = !this.ViewMorePopupPanel2
  }
  searchData() {
    this.result_data=true
    // this.BookingReviewList(this.config.currentPage);
  }
  CloseMoreViewPopup2(){
    this.ViewMorePopupPanel2 = false;
  }
  gameList() {
    this.board.GameList().subscribe((data) => {
      console.log('data for game list', data.data);
      this.gamelistdata = data.data;
    });
  }

  ViewMorePopupPanel3 = false;
  ViewMorePopup3(){
    this.ViewMorePopupPanel3 = !this.ViewMorePopupPanel3
  }

  CloseMoreViewPopup3(){
    this.ViewMorePopupPanel3 = false;
  }


}
