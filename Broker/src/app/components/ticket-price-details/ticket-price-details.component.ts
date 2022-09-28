import { Component, OnInit } from '@angular/core';
import { TicketPrice } from '../../service/ticket_price';

@Component({
  selector: 'app-ticket-price-details',
  templateUrl: './ticket-price-details.component.html',
  styleUrls: ['./ticket-price-details.component.css'],
})
export class TicketPriceDetailsComponent implements OnInit {
  constructor(private ticketPrice: TicketPrice) {}
  DataList: any = [];
  ngOnInit(): void {
    this.alldata();
  }
  alldata() {
    this.ticketPrice.TicketPriceList().subscribe((data) => {
      console.log('data', data);
      this.DataList = data.data;
    });
  }
}
