import { Component, OnInit } from '@angular/core';
import { Tags } from '../list-of-categories/list-of-categories.component';
import { ListingService } from '../listing.service';
import { Router } from '@angular/router';
import { Question } from '../data-models/Question';
import { QAEntry } from '../data-models/QAEntry';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Answer } from '../data-models/Answer';

@Component({
  selector: 'app-add-qa-entry',
  templateUrl: './add-qa-entry.component.html',
  styleUrls: ['./add-qa-entry.component.css']
})
export class AddQaEntryComponent implements OnInit {
  val: any = '';
  public quesTags: string[];
  fruits: Tags[] = [];
  result: string[] = [];
  categoryList: string[];
  response: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  question = new FormControl('', [
    Validators.required,
  ]);
  description = new FormControl('', [
    Validators.required,
  ]);
  categories = new FormControl();

  constructor(
    private listingService: ListingService,
    private router: Router
  ) { }

  getFilteredList() {
    return this.result;
  }

  filter(value: string): string[] {
    this.result = [];
    this.categoryList = this.response;
    console.log('inside filter ' + value);
    const filterValue = value.toLowerCase();
    this.categoryList.forEach((value) => {
      if (value.toLowerCase().includes(filterValue)) {
        this.result.push(value);
      }
    });
    console.log('inside filter ' + this.result.toString());
    return this.result;
  }

  ngOnInit() {
    this.listingService.category = '';
    this.listingService.getAllCategories().subscribe(
      data => {
        console.log('GET Request is successful ', data);
        this.response = data;
      });
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

  post_qaentry() {
    const question = this.question.value;
    const description = this.description.value;
    const categories = this.categories.value;
    this.quesTags = [];
    const ans = this.val;
    for (const tags of this.fruits) {
      this.quesTags.push(tags.name);
    }
    console.log(this.quesTags);
    const d = new Date();
    const creationDate = d.getTime();
    const ques = new Question('', categories, question, description, '', creationDate, '', creationDate);
    const answer = new Answer('0', ans, creationDate, '123', 'user', creationDate, 0, false);
    const qa = new QAEntry(ques, [answer], this.quesTags, true, 1, 0);
    console.log(ques);
    console.log(JSON.stringify(qa));
    console.log(this.fruits);
    if (this.question.value === '' || this.description.value === '') {
      // validate form
    } else {
      this.listingService.post_question(qa).subscribe(data => {
        console.log('POST Request is successful ', data);
        this.router.navigateByUrl('/category');
      });
    }
  }
}
