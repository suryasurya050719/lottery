import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css']
})
export class BookingReviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  ViewMorePopupPanel = false;
  ViewMorePopup(){
    this.ViewMorePopupPanel = !this.ViewMorePopupPanel
  }

  CloseMoreViewPopup(){
    this.ViewMorePopupPanel = false;
  }
}
