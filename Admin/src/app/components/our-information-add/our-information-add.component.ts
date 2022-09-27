import { Component, OnInit } from '@angular/core';
import { ourInformation } from '../../service/ourInformation';

@Component({
  selector: 'app-our-information-add',
  templateUrl: './our-information-add.component.html',
  styleUrls: ['./our-information-add.component.css'],
})
export class OurInformationAddComponent implements OnInit {
  // ngmodel
  title: string = '';
  information: string = '';
  /// edit option

  recordEdit: boolean = false;
  // list store key
  list: any = [];
  currentRecordId: string = '';

  // ng model error
  titleError: boolean = false;
  informationError: boolean = false;
  constructor(private ourInformation: ourInformation) {}

  ngOnInit(): void {
    this.ourInfoList();
  }
  ourInfoList() {
    this.ourInformation.list().subscribe((data) => {
      this.list = data.data;
      console.log('this.list', this.list);
    });
  }
  submit() {
    console.log('>>>>>>>');
    if (this.title == '') {
      this.titleError = true;
    }
    if (this.information == '') {
      this.informationError = true;
    }
    if (this.title !== '' && this.information !== '') {
      let data = {
        title: this.title,
        information: this.information,
      };
      if (this.recordEdit === false) {
        this.ourInformation.create(data).subscribe((data) => {
          if (data.statuscode == 200) {
            this.ourInfoList();
            alert('Our Info created sucessfully');
          }
        });
      } else if (this.recordEdit === true) {
        this.ourInformation
          .update(data, this.currentRecordId)
          .subscribe((data) => {
            if (data.statuscode == 200) {
              this.ourInfoList();
              this.recordEdit = false;
              alert(' updated sucessfully');
            }
          });
      }
      this.title = '';
      this.information = '';
    }
  }
  delete(id: any) {
    if (confirm('Are you sure you want to delete this record')) {
      this.ourInformation.delete(id).subscribe((data) => {
        this.ourInfoList();
        alert('records delete sucessfully');
      });
    }
  }
  edit(id: any) {
    this.recordEdit = true;
    this.currentRecordId = id;
    this.ourInformation.singleRecord(id).subscribe((data) => {
      console.log('dtaa', data);
      this.title = data.data.title;
      this.information = data.data.information;
    });
  }
}
