import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup
  registerError: string

  constructor(private auth: AuthService, private router: Router, fb: FormBuilder) {
    this.registerForm = fb.group({
      real_name: [''],
      username: [''],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  signUp() {
    let data = this.registerForm.value;
    
    let credentials = {
      email: data.email,
      password: data.password
    };

    this.auth.signUp(credentials).then(
      () => this.router.navigateByUrl('/list-rooms'),
      error => this.registerError = error.message
    );
  }

  ngOnInit() {
  }

}
