import { Component, OnInit } from '@angular/core';
import { CustomerCare } from '../../service/customer_care';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customer-care-add',
  templateUrl: './customer-care-add.component.html',
  styleUrls: ['./customer-care-add.component.css'],
})
export class CustomerCareAddComponent implements OnInit {
  Question: string = '';
  Answer: string = '';
  imagedata: any = {};
  File = '';
  Link: string = '';
  GetListDate: any = [];
  ActiveRecords: any = {};
  isEditable: boolean = false;

  // validation
  QuestionError: Boolean = false;
  AnswerError: Boolean = false;
  FileError: Boolean = false;
  constructor(private CustomerCare: CustomerCare) {}

  ngOnInit(): void {
    this.GetList();
    this.Link = `${environment.apiurl}/images/`;
  }
  Filedata(event: any) {
    console.log('file', event.target.files[0]);
    this.imagedata = event.target.files[0];
  }
  GetList() {
    this.CustomerCare.GetList().subscribe((data) => {
      console.log('dta', data);
      this.GetListDate = data.data;
    });
  }
  Onsubmit() {
    if (this.Question == '') {
      this.QuestionError = true;
    } else {
      this.QuestionError = false;
    }
    if (this.Answer == '') {
      this.AnswerError = true;
    } else {
      this.AnswerError = false;
    }
    if (Object.keys(this.imagedata).length == 0) {
      this.FileError = true;
    } else {
      this.FileError = false;
    }

    if (
      this.Answer !== '' &&
      this.Question !== '' &&
      Object.keys(this.imagedata).length !== 0
    ) {
      console.log('this.Answer', this.Answer);
      console.log('this.Answer', this.Question);
      console.log('this.Answer', this.File);
      let id = localStorage.getItem('lottryuserid');
      this.CustomerCare.QuestionCreate(
        this.Question,
        this.Answer,
        this.imagedata,
        id
      ).subscribe((data) => {
        console.log('data', data);
      });
    }
  }
  Edit(index: number) {
    this.isEditable = true;
    this.ActiveRecords = this.GetListDate[index];
    this.Question = this.ActiveRecords.question;
    this.Answer = this.ActiveRecords.answer;
    this.File = this.ActiveRecords.file_name;
  }
  remove(id: number) {
    if (confirm('Are you sure you want to remove records')) {
      this.CustomerCare.Remove(id).subscribe((data) => {
        console.log('data', data);
        this.GetList();
      });
    }
  }
}
