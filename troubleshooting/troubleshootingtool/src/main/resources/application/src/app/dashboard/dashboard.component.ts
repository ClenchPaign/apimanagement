import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
public username:any;
public isAdmin:any;
  constructor(private listingService: ListingService) { }

  ngOnInit() {
    this.username= localStorage.getItem('username');
    this.isAdmin=localStorage.getItem('isAdmin');
    console.log('ADMIN', this.isAdmin);
    if (this.isAdmin==="false"){

      (document.getElementById('review_ques') as HTMLDivElement).style.display="block";
      // (document.getElementById('review_ques') as HTMLDivElement).setAttribute("disabled","true");
    }
  }
}
