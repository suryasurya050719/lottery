import { Component, OnInit } from '@angular/core';
import { live_result } from '../../service/liveResult';

@Component({
  selector: 'app-game-centre',
  templateUrl: './game-centre.component.html',
  styleUrls: ['./game-centre.component.css'],
})
export class GameCentreComponent implements OnInit {
  // ngmodel
  title: string = '';
  url: string = '';
  // store data
  list: any = [];
  activeData: any = {};
  Edite: boolean = false;
  //ngmodel error
  titleError: boolean = false;
  urlError: boolean = false;
  constructor(private live_result: live_result) {}

  ngOnInit(): void {
    this.ourInfoList();
  }

  ourInfoList() {
    this.live_result.list().subscribe((data) => {
      this.list = data.data;
      console.log('this.list', this.list);
    });
  }
  submit() {
    if (this.title == '') {
      this.titleError = true;
    }
    if (this.url == '') {
      this.urlError = true;
    }
    if (this.title !== '' && this.url !== '') {
      let data = {
        live_result_id: this.activeData.live_result_id,
        title: this.title,
        url: this.url,
      };
      if (this.Edite) {
        this.live_result.edite(data).subscribe((data) => {
          console.log('data', data);
          this.Edite = false;
          this.reset();
          this.ourInfoList();
        });
      } else if (this.Edite == false) {
        this.live_result.create(data).subscribe((data) => {
          console.log('data', data);
          this.reset();
          this.ourInfoList();
          if (data.data.statuscode == 200) {
            alert('Create sucessfully');
          }
        });
      }
    }
  }
  delete(id: any) {
    console.log('data', id);
    if (confirm('Are you sure you want to delete this record')) {
      this.live_result.delete(Number(id)).subscribe((data) => {
        this.ourInfoList();
        alert('records delete sucessfully');
      });
    }
  }
  Edit(index: number) {
    this.Edite = true;
    this.activeData = this.list[index];
    this.title = this.activeData.title;
    this.url = this.activeData.url;
  }
  reset() {
    this.title = '';
    this.url = '';
  }
}
