import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';

@Component({
  selector: 'app-list-of-categories',
  templateUrl: './list-of-categories.component.html',
  styleUrls: ['./list-of-categories.component.css']
})
export class ListOfCategoriesComponent implements OnInit {

  response: any;
  errorMessage: any;
  sub: any;
  route: any;

  constructor(private listingService: ListingService) { }
  ngOnInit() {
    this.listingService.getAllCategories().subscribe(
      data => {
        console.log('GET Request is successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }
  getResponse() {
    return this.response;
  }

}
