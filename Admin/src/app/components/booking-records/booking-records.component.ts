import { Component, OnInit } from '@angular/core';
import  {Booking} from '../../service/booking'

@Component({
  selector: 'app-booking-records',
  templateUrl: './booking-records.component.html',
  styleUrls: ['./booking-records.component.css']
})
export class BookingRecordsComponent implements OnInit {
  // search filter model
  searchType:string=''
  fromDate:string=''
  toDate:string=''
  gameType:string=''

  // booking list data
  BookingListdata:any=[]
  constructor(
    private booking:Booking
  ) { }

  ngOnInit(): void {
    this.BookingList()
  }
  BookingList(){
   this.booking.BoardList().subscribe((data)=>{
     this.BookingListdata=data.data
     console.log("booking data", this.BookingListdata)
   })
  }
  ViewMorePopupPanel = false;
  ViewMorePopup(){
    this.ViewMorePopupPanel = !this.ViewMorePopupPanel
  }

  CloseMoreViewPopup(){
    this.ViewMorePopupPanel = false;
  }


  ViewMorePopupPanel2 = false;
  ViewMorePopup2(){
    this.ViewMorePopupPanel2 = !this.ViewMorePopupPanel2
  }

  CloseMoreViewPopup2(){
    this.ViewMorePopupPanel2 = false;
  }


  ViewMorePopupPanel3 = false;
  ViewMorePopup3(){
    this.ViewMorePopupPanel3 = !this.ViewMorePopupPanel3
  }

  CloseMoreViewPopup3(){
    this.ViewMorePopupPanel3 = false;
  }



}
