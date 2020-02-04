import { Component, OnInit, Inject } from '@angular/core';
import { Tags } from '../list-of-categories/list-of-categories.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Question } from '../data-models/Question';
import { QAEntry } from '../data-models/QAEntry';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
export interface Categories {
  category: string;
}
@Component({
  selector: 'app-add-qa-entry',
  templateUrl: './add-qa-entry.component.html',
  styleUrls: ['./add-qa-entry.component.css']
})
export class AddQaEntryComponent implements OnInit {
  public quesTags: string[];
  response: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Tags[] = [];
  filteredOptions: Observable<Categories[]>;
  categoryList: string[];

  question = new FormControl();
  description = new FormControl();
  categories = new FormControl();

  ngOnInit() {
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
    const d = new Date();
    const creationDate = d.getTime();
    const ques = new Question('', categories, question, description, '', creationDate, '', creationDate);
    const qa = new QAEntry(ques, [], this.quesTags, false, 0, 0);
    console.log(ques);
    console.log(JSON.stringify(qa));
    console.log(this.fruits);
    this.listingService.post_question(qa).subscribe(data => {
      console.log('POST Request is successful ', JSON.stringify(qa));
    });
  }

}
