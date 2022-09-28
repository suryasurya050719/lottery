import { Component, OnInit } from '@angular/core';
import { live_result } from '../../service/live_result';

@Component({
  selector: 'app-game-centre',
  templateUrl: './game-centre.component.html',
  styleUrls: ['./game-centre.component.css'],
})
export class GameCentreComponent implements OnInit {
  constructor(private live_result: live_result) {}
  list: any = [];
  ngOnInit(): void {
    this.ourInfoList();
  }
  ourInfoList() {
    this.live_result.list().subscribe((data) => {
      this.list = data.data;
      console.log('this.list', this.list);
    });
  }
}
