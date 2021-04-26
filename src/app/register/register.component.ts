import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
   errorMessage : string; // string to store error messages	
   userForm!: FormGroup;

   //pass the relevant services in to the component
  constructor( 
  	private formBuilder: FormBuilder, private registerservice: RegisterService, private router: Router
  ) { 
      this.errorMessage = "";
    }

  ngOnInit(): void {
  	 this.userForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required,Validators.pattern(/^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/)])],
      password: ['', Validators.compose([Validators.required])]
  	 });
  }

  submit(){
  	 this.registerservice.submitNewUser(this.userForm.value)
   	   .subscribe(
   	   	  user => {
   	   	  	 	console.log ('registration succcessfull',user);
   	   	  	 	//registration successfull navigate to login page
   	   	  	 	this.router.navigate(['/signin']); 
   	   	  }, //callback to cath errors thrown bby the Observable in the service
   	   	  error => {
   	   	  	this.errorMessage = <any>error;
   	   	  }
   	   	);
  }

  clearForm() {
  	//clears what is appering in the form
  	this.userForm.reset(); 

  }

}
