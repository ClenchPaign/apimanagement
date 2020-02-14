import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Tags } from '../list-of-categories/list-of-categories.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListingService } from '../listing.service';
import { Question } from '../data-models/Question';
import { QAEntry } from '../data-models/QAEntry';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { ImageModel } from '../data-models/ImageModel';

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
  tagList: string[];
  tagsResponse: any;

  base64String: any;
  uploadedFiles: string[] = [];
  imageUrlPREVIEW: any;
  public files: NgxFileDropEntry[] = [];
  public allFiles: NgxFileDropEntry[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Tags[] = [];
  result: string[] = [];
  resultTags: string[] = [];
  categoryList: string[];
  description: any = '';
  @ViewChild('imageRTE', { static: true })
  private rteObj: RichTextEditorComponent;
  constructor(
    public dialogRef: MatDialogRef<AddQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private listingService: ListingService) { }

  question = new FormControl('', [
    Validators.required,
  ]);
  categories = new FormControl();
  onNoClick(): void {
    this.dialogRef.close(this.categories.value);
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
      'Formats', 'OrderedList', 'UnorderedList', '|', 'CreateLink', '|', 'Undo', 'Redo', '|', 'SourceCode'];
    this.rteObj.insertImageSettings.saveFormat = 'Base64';
  }

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

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    console.log('on selection :' + event.option.value);
    // const val = (document.getElementById('tag') as HTMLInputElement).value;
    if ((event.option.value || '').trim()) {
      this.fruits.pop();
      this.fruits.push({ name: event.option.value.trim() });
    }

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
  public removeFiles(file: NgxFileDropEntry) {
    this.files = this.files.filter(item => item !== file);
    console.log('remove file:' + file.relativePath);
  }
  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      this.files.push(droppedFile);
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const imageModel: ImageModel = new ImageModel('', file.name, reader.result as string);
          this.listingService.upload_files(imageModel).subscribe(data => {
            console.log('Upload', data);
            this.uploadedFiles.push(data);
          });
        };
      });

    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  post_ques() {
    const question = this.question.value;
    const description = this.rteObj.getHtml();
    const categories = this.categories.value;
    this.quesTags = [];
    for (let tags of this.fruits) {
      this.quesTags.push(tags.name);
    }
    console.log(this.quesTags);
    const d = new Date();
    const creationDate = d.getTime();
    const ques = new Question('', categories, question, description, this.uploadedFiles.toString(), creationDate, '', creationDate);
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
