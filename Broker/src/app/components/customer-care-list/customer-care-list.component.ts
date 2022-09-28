import { CustomerCare } from '../../service/customer_care';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customer-care-list',
  templateUrl: './customer-care-list.component.html',
  styleUrls: ['./customer-care-list.component.css'],
})
export class CustomerCareListComponent implements OnInit {
  constructor(private CustomerCare: CustomerCare) {}
  GetListDate: any = [];
  Link: string = '';
  ngOnInit(): void {
    this.Link = `${environment.apiurl}/images/`;
    this.GetList();
  }
  GetList() {
    this.CustomerCare.GetList().subscribe((data) => {
      console.log('data', data.data);
      this.GetListDate = data.data;
    });
  }
}
