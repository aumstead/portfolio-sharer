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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  validationErrors: string[] = [];

  constructor(
    private _accountService: AccountService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}

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
      username: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
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
}
