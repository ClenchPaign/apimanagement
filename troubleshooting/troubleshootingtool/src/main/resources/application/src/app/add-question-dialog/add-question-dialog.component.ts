import { Component, OnInit, Inject } from '@angular/core';
import { DialogData, Tags } from '../list-of-categories/list-of-categories.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListingService } from '../listing.service';
import { Question } from '../data-models/Question';
import { QAEntry } from '../data-models/QAEntry';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Categories {
  category: string;
}
@Component({
  selector: 'app-add-question-dialog',
  templateUrl: './add-question-dialog.component.html',
  styleUrls: ['./add-question-dialog.component.css']
})

export class AddQuestionDialogComponent implements OnInit {
  public quesTags: string[];
  response: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Tags[] = [];
  filteredOptions: Observable<Categories[]>;
  categoryList: Categories[];
  constructor(
    public dialogRef: MatDialogRef<AddQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private listingService: ListingService) { }

  question = new FormControl();
  description = new FormControl();
  categories = new FormControl();
  onNoClick(): void {
    this.dialogRef.close();
  }

  displayFn(user?: Categories): string | undefined {
    return user ? user.category : undefined;
  }

  private _filter(name: string): Categories[] {
    const filterValue = name.toLowerCase();
    return this.categoryList.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.filteredOptions = this.categories.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.categoryList.slice())
      );
    this.listingService.category = '';
    this.listingService.getAllCategories().subscribe(
      data => {
        console.log('GET Request is successful ', data);
        this.response = data;
        this.response.forEach((x) => { this.categoryList.push(Object.assign({}, x)); });
        res => { console.log(res); };
      });
  }

  getResponse() {
    return this.response;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Tags): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  set() {
    (document.getElementById('display') as HTMLInputElement).style.display =
      'block';
  }

  openNav() {
    (document.getElementById('mySidenav') as HTMLInputElement).style.width =
      '460px';
  }
  closeNav() {
    (document.getElementById('mySidenav') as HTMLInputElement).style.width =
      '0';
  }

  post_ques() {
    const question = this.question.value;
    const description = this.description.value;
    const categories = this.categories.value;
    this.quesTags = [];
    for (let tags of this.fruits) {
      this.quesTags.push(tags.name);
    }
    console.log(this.quesTags);

    const ques = new Question('', categories, question, description, '', 0, '', 0);
    const qa = new QAEntry(ques, [], this.quesTags, false, 0, 0);
    console.log(ques);
    console.log(JSON.stringify(qa));
    console.log(this.fruits);
    this.listingService.post_question(qa).subscribe(data => {
      console.log('POST Request is successful ', JSON.stringify(qa));
      this.onNoClick();
    });
  }
}
