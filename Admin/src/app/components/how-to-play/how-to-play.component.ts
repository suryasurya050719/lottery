import { Component, OnInit } from '@angular/core';
import { HowToPlay } from '../../service/howToPlay';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.css']
})
export class HowToPlayComponent implements OnInit {
  public loading = false;
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
  constructor(private HowToPlay: HowToPlay) {}

  ngOnInit(): void {
    this.GetList();
    this.Link = `${environment.apiurl}/images/`;
  }
  Filedata(event: any) {
    console.log('file', event.target.files[0]);
    this.imagedata = event.target.files[0];
  }
  GetList() {
    this.HowToPlay.GetList().subscribe((data) => {
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
    console.log(
      'file data',
      this.imagedata,
      this.imagedata?.name !== '',
      this.imagedata?.name == '',
      Object.keys(this.imagedata).length
    );
    if (this.imagedata?.name == '' && Object.keys(this.imagedata).length == 0) {
      this.FileError = true;
    } else {
      this.FileError = false;
    }

    if (
      this.Answer !== '' &&
      this.Question !== '' &&
      this.imagedata?.name !== ''
    ) {
      console.log('this.Answer', this.Answer);
      console.log('this.Answer', this.Question);
      console.log('this.Answer', this.imagedata);
      let id = localStorage.getItem('lottryuserid');
      this.loading = true;
      this.HowToPlay.QuestionCreate(
        this.Question,
        this.Answer,
        this.imagedata,
        id
      ).subscribe((data) => {
        console.log('data', data);
        this.loading = false;
        this.GetList();
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
      this.HowToPlay.Remove(id).subscribe((data) => {
        console.log('data', data);
        this.GetList();
      });
    }
  }
}
