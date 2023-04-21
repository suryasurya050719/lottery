import { Component } from '@angular/core';
import { APK } from '../../service/apk';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-lottery-home',
  templateUrl: './lottery-home.component.html',
  styleUrls: ['./lottery-home.component.css']
})
export class LotteryHomeComponent {
 Link: string = '';
 list: any = [];

  constructor(private APK: APK) {

  }
  ngOnInit(): void {
    this.ourInfoList();
    this.Link = `${environment.apiurl}/images/`;
 
  }
  ourInfoList() {
    this.APK.getLink().subscribe((data) => {
      this.list = data.data;
      console.log('this.list', this.list);
    });
  }
}
