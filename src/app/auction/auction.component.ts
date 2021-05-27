import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { AuctionService } from '../auction.service';
import { SigninService } from '../signin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Item} from '../item';
import {Useronline} from '../useronline';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {
  items: Item[]; //array of items to store the items. 
  displayedColumns: string[] //Array of Strings with the table column names
  message: string; // message string
  showBid: boolean;  //boolean to control if the show bid form is placed in the DOM
  selectedItem!: Item; //Selected Item 
  bidForm! : FormGroup; //FormGroup for the biding 
  userName!: string;
  errorMessage: string; //string to store error messages received in the interaction with the api
  mapOptions: google.maps.MapOptions;

  constructor( private formBuilder: FormBuilder, private router: Router, private socketservice: SocketService, private auctionservice: AuctionService,
   private signinservice: SigninService) { 
    this.items = [];
    this.message = "";
    this.showBid = false;
    this.userName = this.signinservice.token.username;  
    this.errorMessage = "";
    this.displayedColumns = ['description', 'currentbid', 'buynow', 'remainingtime', 'wininguser'];
    this.mapOptions = {
    	center: { lat: 38.640026, lng: -9.155379 },
        zoom: 14
    };
  }

  ngOnInit(): void {
  	 this.message= "Hello " + this.userName + "! Welcome to the RIT II auction site.";
  	 
  	 //create bid form 
  	 this.bidForm = this.formBuilder.group({
      bid: ['', Validators.compose([Validators.required,Validators.pattern("^[0-9]*$")])]
  	 });

  	 // Get initial item data from the the server api using http call in the auctionservice
    
     this.auctionservice.getItems()
        .subscribe(result => {
          let receiveddata = result as Item[]; // cast the received data as an array of items (must be sent like that from server)
            this.items = receiveddata;
            console.log ("received the following items: ", receiveddata);
        },
        error => this.errorMessage = <any>error );

  //subscribe to the incoming websocket events 
     
  //example how to subscribe to the server side regularly (each second) items:update event
   const updateItemsSubscription = this.socketservice.getEvent("items:update")
                      .subscribe(
                        data =>{
                          let receiveddata = data as Item[];
                            if (this.items){
                              this.items = receiveddata;
                            }
                        }   
                      );    
    
  //subscribe to the new item event that must be sent from the server when a client publishes a new item

  //subscribe to the item sold event sent by the server for each item that ends. 

  //subscription to any other events must be performed here inside the ngOnInit function
       
  }

   logout(){
  	//
  	this.socketservice.disconnect();
    //navigate back to the log in page
    this.router.navigate(['/signin']);
    //call the logout function in the signInService to clear the token in the browser
    this.signinservice.logout();

  }

  //function called when an item is selected in the view
  onRowClicked(item: Item){
  	console.log("Selected item = ", item);
  	this.selectedItem = item;
  	this.showBid = true; // makes the bid form appear
  }

  // function called when the submit bid button is pressed
   submit(){
  	console.log("submitted bid = ", this.bidForm.value.bid);
  	//send an event using the websocket for this use the socketservice 
  	// example :  this.socketservice.sendEvent('eventname',eventdata);
  }

  //function called when the cancel bid button is pressed. 
   cancelBid(){
   	this.bidForm.reset(); //clears bid value 
   }

   //function called when the buy now button is pressed. 

   buyNow(){
   	this.bidForm.setValue({              /// sets the field value to the buy now value of the selected item 
   		bid: this.selectedItem.buynow
   	});
   	this.message= this.userName + " please press the Submit Bid button to procced with the Buy now order.";
   }

}
