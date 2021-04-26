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
  	private formBuilder: FormBuilder, private router: Router, private signinservice: SigninService, private socketservice: SocketService 
  ) {
  		this.errorMessage = "";
    }

  ngOnInit(): void {
  	 this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
  	 });
  }
  submit() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.controls.password.errors);
      return;
    }
    this.signinservice.login(this.loginForm.value.username,this.loginForm.value.password)
  	    .subscribe(
  	    	result => {                  
  	    	    // if the Http POST call made is successfull the result is a Token object
  	    	    this.signinservice.setToken(result); // store the received jwt token in the sign in service for future use in authentication 
  	    	  	this.socketservice.connect();	// connect the websocket since we already have the token
                //send a new user event to the server so that the server can store the socket ID mapped to the usernames
                this.socketservice.sendEvent('newUser:username',{username: this.loginForm.value.username});   		  
                this.errorMessage = "";
                console.log('navigating to auction')
  	    		//login successful navigate to acution page
  	    		 this.router.navigate(['/auction']);
  	    	},	
  	    	error => {
  	    		this.errorMessage = <any>error;	
  	    		console.log('errorMessage: ', this.errorMessage);
  	    		this.loginForm.controls.username.setErrors({invalid: true});
  	    	}	
  	    );
    console.log(this.loginForm.value);
  }	 

}
