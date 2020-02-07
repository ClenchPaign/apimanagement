import { Component, OnInit, ViewChild } from '@angular/core';
import { Tags } from '../list-of-categories/list-of-categories.component';
import { ListingService } from '../listing.service';
import { Router } from '@angular/router';
import { Question } from '../data-models/Question';
import { QAEntry } from '../data-models/QAEntry';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Answer } from '../data-models/Answer';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-qa-entry',
  templateUrl: './add-qa-entry.component.html',
  styleUrls: ['./add-qa-entry.component.css']
})
export class AddQaEntryComponent implements OnInit {
  val: any = '';
  description: any = '';
  public quesTags: string[];
  fruits: Tags[] = [];

  result: string[] = [];
  resultTags: string[] = [];
  categoryList: string[];
  tagList: string[];

  tagsResponse: any;
  response: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('imageRTE', { static: true })
  private rteObj: RichTextEditorComponent;
  @ViewChild('imageRTEForAnswer', { static: true })
  private rteObjAnswer: RichTextEditorComponent;

  question = new FormControl('', [
    Validators.required,
  ]);
  categories = new FormControl();

  constructor(
    private listingService: ListingService,
    private router: Router
  ) { }

  // tools: object = {
  //   items: ['Bold', 'Italic', 'Underline', '|', 'FontSize', 'FontColor', '|', 'Formats', 'OrderedList', 'UnorderedList',
  //     '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo', '|', 'SourceCode']
  // };

  // filters for categories
  getFilteredList() {
    return this.result;
  }
  filter(value: string): string[] {
    this.result = [];
    this.categoryList = this.response;
    // console.log('inside filter ' + value);
    const filterValue = value.toLowerCase();
    this.categoryList.forEach((value) => {
      if (value.toLowerCase().includes(filterValue)) {
        this.result.push(value);
      }
    });
    // console.log('category list: ' + this.result.toString());
    return this.result;
  }

  // filter for tags
  getFilteredTags() {
    return this.resultTags;
  }

  filterTags(value: string): string[] {
    this.resultTags = [];
    this.tagList = this.tagsResponse;
    // console.log('inside filter ' + value);
    const filterValue = value.toLowerCase();
    this.tagList.forEach((value) => {
      if (value.toLowerCase().includes(filterValue)) {
        this.resultTags.push(value);
      }
    });
    // console.log('list: ' + this.resultTags.toString());
    return this.resultTags;
  }

  ngOnInit() {
    this.listingService.category = '';
    this.listingService.getAllCategories().subscribe(
      data => {
        console.log('GET Request is successful ', data);
        this.response = data;
      });
    this.listingService.getAllTags().subscribe(
      data => {
        console.log('GET Request for all tags is successful ', data);
        this.tagsResponse = data;
      });
    this.rteObj.toolbarSettings.items = ['Bold', 'Italic', 'Underline', '|',
      'Formats', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo', '|', 'SourceCode'];
    this.rteObj.insertImageSettings.saveFormat = 'Base64';
    this.rteObjAnswer.toolbarSettings.items = ['Bold', 'Italic', 'Underline', '|',
      'Formats', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo', '|', 'SourceCode'];
    this.rteObjAnswer.insertImageSettings.saveFormat = 'Base64';
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    console.log('on selection :' + event.option.value);
    const val = (document.getElementById('tag') as HTMLInputElement).value;
    if ((event.option.value || '').trim()) {
      this.fruits.pop();
      this.fruits.push({ name: event.option.value.trim() });
    }

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const val = (document.getElementById('tag') as HTMLInputElement).value;
    console.log('add event ::' + val);
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
    const description = this.description;
    const categories = this.categories.value;
    this.quesTags = [];
    const ans = this.val;
    for (const tags of this.fruits) {
      this.quesTags.push(tags.name);
    }
    console.log(this.quesTags);
    const d = new Date();
    const creationDate = d.getTime();
    // const source = (document.getElementsByClassName('e-rte-image e-imginline'));
    // let code: HTMLCollection = source;
    // let attachments: string[];
    // for (let i = 0; i < code.length; i++) {
    //   attachments.push(code[i].getAttribute('src'));
    //   // console.log('source = ' + code[i].getAttribute('src'));
    // }
    const ques = new Question('', categories, question, description, '', creationDate, '', creationDate);
    const answer = new Answer('0', ans, creationDate, '123', 'user', creationDate, 0, false);
    const qa = new QAEntry(ques, [answer], this.quesTags, true, 1, 0);
    // console.log(qa);

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
