import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsertitemService } from '../insertitem.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-insertitem',
  templateUrl: './insertitem.component.html',
  styleUrls: ['./insertitem.component.css']
})
export class InsertitemComponent implements OnInit {
  errorMessage : string; // string to store error messages	
  itemForm!: FormGroup;

  constructor(
  	private formBuilder: FormBuilder, private insertitemservice: InsertitemService, private router: Router
  ) {
  	  this.errorMessage = ""; 
  	}

  ngOnInit(): void {
  	 this.itemForm = this.formBuilder.group({
      description: ['', Validators.compose([Validators.required])],
      currentbid: ['', Validators.compose([Validators.required,Validators.pattern("^[0-9]*$")])],
      buynow: ['', Validators.compose([Validators.required,Validators.pattern("^[0-9]*$")])],
      remainingtime: ['', Validators.compose([Validators.required,Validators.pattern("^[0-9]*$")])]
  	 });
  }

  submit(){
  	 this.insertitemservice.submitNewItem(this.itemForm.value)
   	   .subscribe(
   	   	  result => {
   	   	  	 	console.log ('item inserted succcessfully',result);
   	   	  	 	//registration successfull navigate to login page
   	   	  	 	this.router.navigate(['/auction']); 
   	   	  }, //callback to cath errors thrown bby the Observable in the service
   	   	  error => {
   	   	  	this.errorMessage = <any>error;
   	   	  }
   	   	);
  }

  clearForm() {
  	//clears what is appering in the form
  	this.itemForm.reset(); 

  }

}
