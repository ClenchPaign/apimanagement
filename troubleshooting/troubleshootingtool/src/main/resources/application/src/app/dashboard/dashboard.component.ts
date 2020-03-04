import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public username: any;
  public isAdmin: any;
  constructor() {
    this.username = localStorage.getItem('username');
    this.isAdmin = localStorage.getItem('isAdmin');
   }

  ngOnInit() {
    console.log('user', this.username);
    console.log('ADMIN', this.isAdmin);
  }
}
