import { Component, OnInit } from '@angular/core';
import { TicketPrice } from '../../service/ticket_price';

@Component({
  selector: 'app-ticket-price-details',
  templateUrl: './ticket-price-details.component.html',
  styleUrls: ['./ticket-price-details.component.css'],
})
export class TicketPriceDetailsComponent implements OnInit {
  constructor(private ticketPrice: TicketPrice) {}
  priceAmouont: string = '';
  TicketPrice: string = '';
  Board: string = '';
  Title: string = '';
  EditDate: boolean = false;
  DataList: any = [];
  ActiveData: any = {};
  // validation
  priceAmouontError: boolean = false;
  TicketPriceError: boolean = false;
  BoardError: boolean = false;
  TitleError: boolean = false;
  ngOnInit(): void {
    this.alldata();
  }
  submit() {
    if (this.priceAmouont == '') {
      this.priceAmouontError = true;
    } else {
      this.priceAmouontError = false;
    }
    if (this.TicketPrice == '') {
      this.TicketPriceError = true;
    } else {
      this.TicketPriceError = false;
    }
    if (this.Board == '') {
      this.BoardError = true;
    } else {
      this.BoardError = false;
    }
    if (this.Title == '') {
      this.TitleError = true;
    } else {
      this.TitleError = false;
    }
    if (
      this.Title !== '' &&
      this.Board !== '' &&
      this.priceAmouont !== '' &&
      this.TicketPrice !== ''
    ) {
      let data = {
        ticket_price_id: this.ActiveData.ticket_price_id,
        title: this.Title,
        board: this.Board,
        ticket_price: this.TicketPrice,
        price_amount: this.priceAmouont,
      };
      if (this.EditDate) {
        this.ticketPrice.TicketPriceUpdate(data).subscribe((data) => {
          console.log('data', data);
          this.EditDate = false;
          alert('Ticket update successfully');
          this.alldata();
        });
      } else if (this.EditDate == false) {
        // create ticket

        this.ticketPrice.TicketPriceCreate(data).subscribe((data) => {
          console.log('data', data);
          alert('Ticket create successfully');
          this.alldata();
        });
      }
    }
  }
  alldata() {
    this.ticketPrice.TicketPriceList().subscribe((data) => {
      console.log('data', data);
      this.DataList = data.data;
    });
  }
  Edit(index: number) {
    this.ActiveData = this.DataList[index];
    console.log('>>>>>>', this.ActiveData);
    this.EditDate = true;
    this.Title = this.ActiveData.title;
    this.Board = this.ActiveData.board;
    this.TicketPrice = this.ActiveData.ticket_price;
    this.priceAmouont = this.ActiveData.price_amount;
  }
  remove(id: number) {
    if (confirm('Are you sure you want to remove this record')) {
      this.ticketPrice.TicketPriceRemove(id).subscribe((data) => {
        console.log('data', data);
        alert('records delete successfully');
        this.alldata();
      });
    }
  }
}
