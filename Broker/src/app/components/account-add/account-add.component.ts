import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Account } from '../../service/accoount';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.css'],
})
export class AccountAddComponent implements OnInit {
  Type: string = '';
  form: FormGroup;
  isSubmited: boolean = false;
  isEdit: boolean = false;
  OwnAccountList: any = [];
  ActiveAccountList: any = {};
  constructor(private formBuilder: FormBuilder, private account: Account) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        type: ['', Validators.required],
        AccountNumber: new FormControl(''),
        AccountName: new FormControl(''),
        BankName: new FormControl(''),
        BranchName: new FormControl(''),
        Ifsc: new FormControl(''),
        Upi: new FormControl(''),
        Name: new FormControl(''),
        phone: new FormControl(''),
        // phone: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.minLength(10),
        //     Validators.maxLength(10),
        //     Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        //   ],
        // ],
      }
      // {
      //   validators: [Validation.match('password', 'confirmPassword')] [routerLink]="['/user-review-view']"
      // }
    );
    this.FieldValidation();
    this.GetOwnAccountList();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  GetOwnAccountList() {
    let id = Number(localStorage.getItem('lottryuserid'));
    this.account.OwnAccountList(id).subscribe((data) => {
      console.log('data', data.data);
      this.OwnAccountList = data.data;
    });
  }
  FieldValidation() {
    if (this.Type == 'BankAccount') {
      this.form.controls['AccountNumber'].setValidators([Validators.required]);
      this.form.controls['AccountName'].setValidators([Validators.required]);
      this.form.controls['BankName'].setValidators([Validators.required]);
      this.form.controls['BranchName'].setValidators([Validators.required]);
      this.form.controls['Ifsc'].setValidators([Validators.required]);
      this.form.get('Name')?.clearValidators();
      this.form.get('phone')?.clearValidators();
      this.form.get('Upi')?.clearValidators();
    } else if (
      this.Type == 'GooglePay' ||
      this.Type == 'Phone-pe' ||
      this.Type == 'Paytm'
    ) {
      this.form.controls['Name'].setValidators([Validators.required]);
      this.form.controls['phone'].setValidators([Validators.required]);
      this.form.get('BankAccount')?.clearValidators();
      this.form.get('AccountName')?.clearValidators();
      this.form.get('BankName')?.clearValidators();
      this.form.get('BranchName')?.clearValidators();
      this.form.get('Ifsc')?.clearValidators();
      this.form.get('Upi')?.clearValidators();
    } else if (this.Type == 'UPI') {
      this.form.controls['Upi'].setValidators([Validators.required]);
      this.form.get('Name')?.clearValidators();
      this.form.get('phone')?.clearValidators();
      this.form.get('BankAccount')?.clearValidators();
      this.form.get('AccountName')?.clearValidators();
      this.form.get('BankName')?.clearValidators();
      this.form.get('BranchName')?.clearValidators();
      this.form.get('Ifsc')?.clearValidators();
    }
    this.form.controls['AccountNumber'].updateValueAndValidity();
    this.form.controls['AccountName'].updateValueAndValidity();
    this.form.controls['BankName'].updateValueAndValidity();
    this.form.controls['BranchName'].updateValueAndValidity();
    this.form.controls['Ifsc'].updateValueAndValidity();
    this.form.controls['Name'].updateValueAndValidity();
    this.form.controls['phone'].updateValueAndValidity();
    this.form.controls['Upi'].updateValueAndValidity();
  }
  textfun() {
    this.FieldValidation();
    this.reset();
  }
  onSubmit() {
    this.isSubmited = true;
    console.log('this.form.valid', this.form.valid, this.form);
    if (this.form.valid) {
      let value = this.form.value;
      let data = {
        user_id: Number(localStorage.getItem('lottryuserid')),
        role_id: 1,
        account_id: this.ActiveAccountList.account_id,
        type: value.type,
        account_number: value.AccountNumber,
        account_name: value.AccountName,
        bank_name: value.BankName,
        branch_name: value.BranchName,
        ifsc_code: value.Ifsc,
        upi_id: value.Upi,
        phone: value.phone,
        name: value.Name,
      };
      if (this.isEdit) {
        this.account.AccountUpdate(data).subscribe((data) => {
          this.form.reset();
          this.GetOwnAccountList();
          this.isSubmited = false;
          this.isEdit = false;
          console.log('data', data);
        });
      } else if (this.isEdit == false) {
        this.account.AccountCreate(data).subscribe((data) => {
          this.form.reset();
          this.GetOwnAccountList();
          this.isSubmited = false;
          console.log('data', data);
        });
      }
    }
  }
  Edite(index: number) {
    this.isEdit = true;
    this.ActiveAccountList = this.OwnAccountList[index];
    this.form.patchValue({
      AccountNumber: this.ActiveAccountList.account_number,
    });
    this.form.patchValue({
      AccountName: this.ActiveAccountList.account_name,
    });
    this.form.patchValue({ type: this.ActiveAccountList.type });
    this.form.patchValue({ BankName: this.ActiveAccountList.bank_name });
    this.form.patchValue({ BranchName: this.ActiveAccountList.branch_name });
    this.form.patchValue({ Ifsc: this.ActiveAccountList.ifsc_code });
    this.form.patchValue({ Name: this.ActiveAccountList.name });
    this.form.patchValue({ phone: this.ActiveAccountList.phone });
    this.form.patchValue({ Upi: this.ActiveAccountList.upi_id });
  }
  reset() {
    this.form.patchValue({ AccountNumber: '' });
    this.form.patchValue({ AccountName: '' });
    this.form.patchValue({ BankName: '' });
    this.form.patchValue({ BranchName: '' });
    this.form.patchValue({ Ifsc: '' });
    this.form.patchValue({ Name: '' });
    this.form.patchValue({ phone: '' });
    this.form.patchValue({ Upi: '' });
  }
  Remove(id: number) {
    if (confirm('Are you sure you want to remove this record')) {
      this.account.AccountRemove(id).subscribe((data) => {
        console.log('data', data);
        this.GetOwnAccountList();
      });
    }
  }
}
