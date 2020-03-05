import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionDialogComponent } from '../add-question-dialog/add-question-dialog.component';



export interface Tags {
  name: string;
}

@Component({
  selector: 'app-list-of-categories',
  templateUrl: './list-of-categories.component.html',
  styleUrls: ['./list-of-categories.component.css']
})
export class ListOfCategoriesComponent implements OnInit {

  response: any;
  errorMessage: any;
  sub: any;
  public data: any;
  public quesTags: string[];

  cats: string[];

  constructor(private listingService: ListingService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.listingService.category = '';
    this.listingService.setTags(null);
    this.listingService.getAllCategories().subscribe(
      data => {
        console.log('GET Request is successful ', data);
        this.response = data;
        const t = data.toString().split(',');
        t.forEach((e) => this.listingService.setCategoriesList(e));
      },
      res => { console.log(res); });
  }
  getResponse() {
    this.cats = this.response;
    return this.cats;
  }
  onClick(cat: string) {
    console.log('clicked ' + cat);
    this.listingService.category = cat;
    this.router.navigateByUrl('/main/home/category/' + cat + '/0/5');
  }

}
