import { Component, OnInit } from '@angular/core';
import { Login } from '../../service/login';
import { sms } from '../../service/sms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { timer, Subscription } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.css'],
})
export class UserReviewComponent implements OnInit {
  BrokerPopup: boolean = false;
  popup: boolean = false;
  AllUser: any = [];
  form: FormGroup;
  submitted: boolean = false;
  type: number = 0;
  currentEditUserId: number = 0;
  heading: string = '';
  editHedding: string = '';
  user_id: string = '';
  role_type: string = '';
  editUser: boolean = false;
  currentUserId: any = '';

  // ng model

  username: string = '';
  phonenumber: string = '';
  phone: string = '';
  otp: any = '';
  countDown: Subscription;
  counter = 0;
  tick = 1000;
  constructor(
    private login: Login,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sms: sms
  ) {}
  otpStatus:number=1


  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: ['', Validators.required],
        phonenumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^\d{10}$/),
          ],
        ],
        otp: [
          '',
          [
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.required,
          ],
        ],
        password: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        confirmpassword: ['', Validators.required],
      }
      // {
      //   validators: [Validation.match('password', 'confirmPassword')] [routerLink]="['/user-review-view']"
      // }
    );
    this.currentUserId = Number(localStorage.getItem('lottryroleid'));
    this.referedUser();
    this.changeValidation();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  changeValidation() {
    if (this.editUser == true) {
      this.form.get('password')?.clearValidators();
      this.form.get('confirmpassword')?.clearValidators();
      this.form.get('otp')?.clearValidators();
      this.form.controls['password'].updateValueAndValidity();
      this.form.controls['confirmpassword'].updateValueAndValidity();
      this.form.controls['otp'].updateValueAndValidity();
    }
  }
  referedUser() {
    // var values = JSON.parse(localStorage.getItem('lottryuserid'));
    let currentUserId = localStorage.getItem('lottryuserid');
    this.login
      .referedUser(currentUserId, this.user_id, this.phone, this.role_type)
      .subscribe((data) => {
        console.log('data all user ', data.data);
        if (data.statuscode == 200) {
          this.AllUser = data.data;
        }
      });
  }
  textfun() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', this.form);
  }
  // alluser() {
  //   this.login
  //     .Alluser(this.user_id, this.phonenumber, this.role_type)
  //     .subscribe((data) => {
  //       console.log('data all user ', data);
  //       if (data.statuscode == 200) {
  //         this.AllUser = data.data;
  //       }
  //     });
  // }
  BrokerToggle(type: number) {
      this.otpStatus=1
    this.username=''
    this.phonenumber=''
    this.otp=''
    this.type = type;
     this.form.reset();
    this.heading = type === 1 ? 'Create Broker' : 'Create Customer';
    this.BrokerPopup = !this.BrokerPopup;
  }
  CloseBrokerPopup() {
     this.otpStatus=1
    this.BrokerPopup = false;
    this.popup = false;
  }
  sendOtp(index:any) {
    if (
      this.username == '' ||
      this.phonenumber == '' ||
      /^\d{10}$/.test(this.phonenumber) == false
    ) {
      alert('user name and phone number must have');
    } else {
      let data = this.form.value;
      let referalID = localStorage.getItem('lottryreferalid');
      let formdata = {
        username: data.username,
        phone: data.phonenumber,
        role_id: this.type === 1 ? 2 : 3,
      };
      this.sms.newuserSms(formdata).subscribe((data) => {
        if(data.statuscode==200){
          this.otpStatus=index
          if(this.otpStatus==2){
            this.counter = 180;
            this.otptimer();
          }
        }
        alert(`${data.status}`);
      });
    }
  }
  onSubmit() {
    this.submitted = true;
    console.log('this.form.value', this.form.value);
    if (this.form.valid) {
      if (this.editUser == false) {
        if (this.form.value.confirmpassword === this.form.value.password) {
          let data = this.form.value;
          let referalID = localStorage.getItem('lottryreferalid');
          let formdata = {
            phone: data.phonenumber,
            password: data.password,
            referal_code: referalID,
            otp: data.otp,
          };
          this.login.Registor(formdata).subscribe((data) => {
            console.log('data', data);
            alert(`${data.status}`);
            this.BrokerPopup = false;
            this.referedUser();
          });
        } else {
          alert('password and confirmpassword is not same');
        }
      } else {
        let data = this.form.value;
        let name = data.username;
        let phone = data.phonenumber;
        console.log('edite', this.currentEditUserId, name, phone);
        this.login
          .UserUpdate(this.currentEditUserId, name, phone)
          .subscribe((data) => {
            console.log(data);
            this.BrokerPopup = false;
            this.referedUser();
            // alert('user updated successfully');
          });
      }
    }
  }
  userReferal(userId: number) {
    this.router.navigate([`/user-review-view/${userId}`]);
    // this.router.navigateByUrl('/user-review');
  }
  suspend(user_id: number, status: string) {
    // alert('Are you sure you want to change status');
    if (confirm('Are you sure you want to change status')) {
      this.login.StatusChange(user_id, status).subscribe((data) => {
        console.log('data for status update', data);
        this.referedUser();
      });
    }
  }
  delete(user_id: number) {
    if (confirm('Are you sure you want to delte user')) {
      this.login.delete(user_id).subscribe((data) => {
        console.log('data for delete', data);
        this.referedUser();
      });
    }
  }
  showpopup(id: number) {
    this.editUser = true;
    this.currentEditUserId = id;
    this.changeValidation();
    this.BrokerPopup = true;
    this.editHedding = 'Edit User';
    this.login.singleUser(id).subscribe((data) => {
      console.log('user dadat', data);
      this.form.get('username')?.patchValue(data.data[0].name);
      this.form.get('phonenumber')?.patchValue(data.data[0].phone);
    });
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
  otptimer() {
    this.countDown = timer(0, this.tick)
      .pipe(take(this.counter))
      .subscribe(() => {
        --this.counter;
        // console.log(this.counter);
        if (this.counter == 0) {
          this.otpStatus = 3;
          this.countDown.unsubscribe();
        }
      });
  }
}
