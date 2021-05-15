import { Component, OnChanges, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  validationErrors: string[] = [];
  maxDate: Date = new Date();
  showEmailHelperText = false;
  showDateOfBirthHelperText = false;
  datePickerConfig: Partial<BsDatepickerConfig>;

  constructor(
    private _accountService: AccountService,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    this.datePickerConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' }
    );
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  register() {
    this._accountService.register(this.registerForm.value).subscribe(
      (response) => {
        this._router.navigateByUrl('/browse');
      },
      (error) => {
        error.forEach((errorText, index) => {
          if (
            errorText.includes(
              'The JSON value could not be converted to System.DateTime'
            )
          ) {
            errorText = 'The date of birth format is invalid.';
            error[index] = errorText;
          }
        });
        this.validationErrors = error;
      }
    );
  }

  initializeForm() {
    this.registerForm = this._fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(16),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
      email: ['', [Validators.email, Validators.required]],
      dateOfBirth: ['', Validators.required],
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  emailFocus() {
    this.showEmailHelperText = true;
  }

  emailFocusOut() {
    this.showEmailHelperText = false;
  }

  dateOfBirthFocus() {
    this.showDateOfBirthHelperText = true;
  }

  dateOfBirthFocusOut() {
    this.showDateOfBirthHelperText = false;
  }
}
