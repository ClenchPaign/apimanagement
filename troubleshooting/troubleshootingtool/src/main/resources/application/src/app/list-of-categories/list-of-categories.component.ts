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

  openDialog(): void {
    const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
      width: '900px',
      data: { category: this.cats }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result:' + result);
      this.openOptions();
      if (this.cats.includes(result) || result === '' || result === undefined) {
        console.log('category already exist or question not added');
      } else {
        this.cats.push(result);
      }

      //   this.router.navigateByUrl('/categories', { skipLocationChange: true })
      //     .then(() => this.router.navigate(['/categories']));
    });
  }
  openOptions() {
    console.log('hello from options');
    const options = document.getElementById('options');
    if (options.style.visibility === 'visible') {
      options.style.visibility = 'collapse';
      options.style.display = 'none';
    } else {
      options.style.visibility = 'visible';
      options.style.display = 'flex';
    }
  }


  constructor(private listingService: ListingService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog) { }
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
    this.cats = this.response;
    return this.cats;
  }
  onClick(cat: string) {
    console.log('clicked ' + cat);
    this.listingService.category = cat;
    // this.router.navigateByUrl('/cat');
  }
  addQAEntry() {
    this.router.navigateByUrl('/main/add_qna');
  }
}
