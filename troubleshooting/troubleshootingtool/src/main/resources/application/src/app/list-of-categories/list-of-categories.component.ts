import { Component, OnInit, Inject } from '@angular/core';
import { ListingService } from '../listing.service';
import { Router } from '@angular/router';
import { Question } from '../data-models/Question';
import { QAEntry } from '../data-models/QAEntry';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AddQuestionDialogComponent } from '../add-question-dialog/add-question-dialog.component';



export interface Tags {
  name: string;
}
export interface DialogData {
  animal: string;
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
  route: any;
  public data: any;
  public quesTags: string[];

  animal: string;
  name: string;

  openDialog(): void {
    const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
      width: '600px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }


  constructor(private listingService: ListingService, private router: Router, public dialog: MatDialog) { }
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
