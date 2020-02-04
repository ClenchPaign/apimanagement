import { Component, OnInit, Inject } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
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
      width: '700px',
      data: { category: this.cats }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result:' + result);
      if (this.cats.includes(result) || result === '' || result === undefined) {
        console.log('category already exist or question not added');
      }else{
        this.cats.push(result);
      }

      //   this.router.navigateByUrl('/categories', { skipLocationChange: true })
      //     .then(() => this.router.navigate(['/categories']));
    });
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
  addQAEntry(){
    this.router.navigateByUrl('/add_qna');
  }
}
