import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { Router } from '@angular/router';
import { ArrayType } from '@angular/compiler';

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
  public data: any;

  constructor(private listingService: ListingService, private router: Router) { }
  ngOnInit() {
    this.listingService.category = '';
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
  onClick(cat: string) {
    console.log('clicked ' + cat);
    this.listingService.category = cat;
    // this.router.navigateByUrl('/cat');
  }
}
