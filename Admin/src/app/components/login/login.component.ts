import { Component, OnInit, ViewChild } from '@angular/core';
import { Login } from '../../service/login';
import { ActivatedRoute, Route, Router } from '@angular/router';
// import { NgForm } from '@angular/forms';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private login: Login,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}
  loginform: FormGroup;
  submitChange: boolean = false;
  accountStatus: boolean = false;
  accountStatusText: string = '';

  // Phone: string = '';
  // password: string = '';
  // form = { Phone: '', password: '' };
  // @ViewChild('form') loginForm: any;
  ngOnInit(): void {
    this.loginform = this.formBuilder.group(
      {
        Phone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          ],
        ],
        Password: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      }
      // {
      //   validators: [Validation.match('password', 'confirmPassword')] [routerLink]="['/user-review-view']"
      // }
    );
    // [routerLink]="['/wallet-review']"
  }
  get f(): { [key: string]: AbstractControl } {
    return this.loginform.controls;
  }

  onSubmit() {
    if (this.loginform.invalid) {
      this.submitChange = true;
    } else {
      this.submitChange = false;
    }
    console.log('data', this.loginform.value);
    let Phone = this.loginform.value.Phone;
    let Password = this.loginform.value.Password;
    if (this.loginform.valid) {
      this.login.Login(Phone, Password).subscribe((data) => {
        console.log('data', data);
        if (data.statuscode == 200 && data.data.role_id == 1) {
          this.accountStatus = false;
          localStorage.setItem('lottryuserid', data.data.user_id);
          localStorage.setItem('lottryroleid', data.data.role_id);
          localStorage.setItem('lottryname', data.data.name);
          localStorage.setItem('lottrytoken', data.token);
          localStorage.setItem('lottryreferalid', data.data.referal_code);
          this.router.navigateByUrl('/user-review');
        } else {
          if (data.statuscode == 400) {
            console.log('dara', data.status);
            this.accountStatus = true;
            this.accountStatusText = data.status;
            alert(`${data.status}`);
          } else if (data.data.role_id !== 1) {
            this.accountStatus = true;
            this.accountStatusText = 'Invalid Account';
            // alert(`${data.status}`);
          } else {
            alert(`Invalid Account`);
          }
          this.router.navigateByUrl('/login');
        }
      });
    } else {
    }
  }
}
