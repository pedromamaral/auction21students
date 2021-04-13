import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SigninService } from '../signin.service';
import { SocketService } from '../socket.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})


export class SigninComponent implements OnInit {
  errorMessage : string; // string to store error messages
  loginForm!: FormGroup;
  
  constructor(
  	private formBuilder: FormBuilder, private router: Router 
  ) {
  		this.errorMessage = "";
    }

  ngOnInit(): void {
  	 this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
  	 });
  }
  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);
  }	 

}
