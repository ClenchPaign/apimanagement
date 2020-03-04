import { Component, OnInit, ViewChild } from '@angular/core';
import { Tags } from '../list-of-categories/list-of-categories.component';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Question } from '../data-models/Question';
import { QAEntry } from '../data-models/QAEntry';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Answer } from '../data-models/Answer';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ImageModel } from '../data-models/ImageModel';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-approval-stage',
  templateUrl: './approval-stage.component.html',
  styleUrls: ['./approval-stage.component.css']
})
export class ApprovalStageComponent implements OnInit {
  val: any = '';
  description: any = '';
  public quesTags: string[];
  fruits: Tags[] = [];
  id: string;
  result: string[] = [];
  resultTags: string[] = [];
  categoryList: string[];
  tagList: string[];
  base64String: any;
  uploadedFiles: string[] = [];
  tagsResponse: any;
  response: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  imageUrlPREVIEW: any;
  questionData: any;
  attachment: string[] = [];
  returnAttachment: string[] = [];
  returnAttachmentFileName: string[] = [];
  attachmentList: any = [];
  username: any;

  navigationExtras: NavigationExtras;
  public files: string[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('valueTemplate', { static: true })
  private template: Template;
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
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.id = this.listingService.id;
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('ID in approval stage:' + this.id);
    });
    this.listingService.getReviewQuestionForID(this.id).subscribe(
      data => {
        console.log('GET Review qn is successful ', data);
        this.questionData = data;
        this.onLoad();
        const temp: string = this.questionData.Question.attachment;
        this.attachment = temp.split(',');
        for (const val of this.attachment) {
          let img: any;
          this.listingService.get_files(val).subscribe(data => {
            img = data;
            this.attachmentList.push(data);
            this.returnAttachment.push(img.base64Image);
            this.returnAttachmentFileName.push(img.fileName);
          },
            res => { });
        }
      });

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
    // this.rteObj.insertImageSettings.saveFormat = 'Base64';
    this.rteObj.enableResize = true;
    this.rteObjAnswer.toolbarSettings.items = ['Bold', 'Italic', 'Underline', '|',
      'Formats', 'OrderedList', 'UnorderedList', '|', 'CreateLink', '|', 'Undo', 'Redo', '|', 'SourceCode'];
    this.rteObjAnswer.enableResize = true;
  }

  onAttachmentClick(itemName: string) {
    for (const item of this.attachmentList) {
      if (itemName === item.fileName) {
        if (item.base64Image.includes('/png') || item.base64Image.includes('/jpeg')) {
          const image = new Image();
          image.src = item.base64Image;
          const w = window.open(item.fileName);
          w.document.write(image.outerHTML);
        } else {
          this.showPdf(item.base64Image, item.fileName);
        }
      }
    }
  }
  showPdf(src: string, fileName: string) {
    const downloadLink = document.createElement("a");
    downloadLink.href = src;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  getAttachments(): string[] {
    return this.returnAttachment;
  }

  getAttachmentFileNames(): string[] {
    return this.returnAttachmentFileName;
  }

  onLoad() {
    this.rteObj.valueTemplate = this.questionData.Question.description;
    if (this.questionData.isAnswered) {
      this.rteObjAnswer.valueTemplate = this.questionData.Answers[0].description;
    }
    this.question.setValue(this.questionData.Question.question);
    this.categories.setValue(this.questionData.Question.category);
    const temp: string = this.questionData.Question.attachment;
    this.attachment = temp.split(',');
    this.uploadedFiles = this.attachment;
    this.questionData.tags.forEach(element => {
      this.fruits.push({ name: element });
    });
  }

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
    const filterValue = value.toLowerCase();
    this.tagList.forEach((value) => {
      if (value.toLowerCase().includes(filterValue)) {
        this.resultTags.push(value);
      }
    });
    return this.resultTags;
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



  public removeFiles(file: string) {
    this.files = this.files.filter(item => item !== file);
    console.log('remove file:' + file);
  }
  uploadFile(event) {
    for (const droppedFile of event) {
      this.files.push(droppedFile.name);
      const reader = new FileReader();
      console.log('Name ', droppedFile.name);
      reader.readAsDataURL(droppedFile);
      reader.onload = (e) => {
        const imageModel: ImageModel = new ImageModel('', droppedFile.name, reader.result as string);
        this.listingService.upload_files(imageModel).subscribe(data => {
          console.log('Upload', data);
          this.uploadedFiles.push(data);
        });
      };
    }
  }


  post_qaentry() {
    const question = this.question.value;
    const description = this.rteObj.getText();
    const categories = this.categories.value;
    this.quesTags = [];
    let ans;
    let approveAnswer: boolean;
    const approveAnswerEle = document.getElementById('approveAnswer') as HTMLInputElement;
    if (approveAnswerEle.checked) {
      approveAnswer = true;
    } else {
      approveAnswer = false;
    }
    for (const tags of this.fruits) {
      this.quesTags.push(tags.name);
    }
    console.log(this.quesTags);
    const d = new Date();
    const creationDate = d.getTime();
    let isAnswered: boolean;
    const ques = new Question(this.questionData.Question.id, categories,
      question, description, this.uploadedFiles.toString(), creationDate, '', creationDate);

    if (this.questionData.isAnswered) {
      isAnswered = true;
      if (this.val === '') {
        ans = this.questionData.Answers[0].description;
      } else {
        ans = this.val;
      }
    } else {
      isAnswered = false;
    }
    this.username = localStorage.getItem("username");
    const answer = new Answer('0', ans, creationDate, this.username, this.username, creationDate, 0, approveAnswer);
    let qa: QAEntry;
    if (isAnswered) {
      qa = new QAEntry(ques, [answer], this.quesTags, true, 1, 0);
    } else {
      qa = new QAEntry(ques, [], this.quesTags, false, 0, 0);
    }
    // let qa = new QAEntry(this.questionData.Question, this.questionData.Answers, this.quesTags, true, 3, 0);
    console.log(qa);
    if (question === '') {
      // validate form
      console.log('Form incomplete');
    } else {
      this.listingService.approve_question(qa, this.questionData.Question.id).subscribe(data => {
        console.log('Question approved ', data);
        this.openSnackBar('Question approved successfully', 'OK');
        this.navigationExtras = {
          queryParams: {
            'reload': true
          }
        };
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/main/dashboard/review'], this.navigationExtras));
      });
    }
  }

  reject_qaentry() {
    this.listingService.reject_question(this.questionData.Question.id).subscribe(data => {
      console.log('Question rejected ', data);
      this.openSnackBar('Question rejected', 'OK');
      // this.navigationExtras = {
      //   queryParams: {
      //     'add_qa': 'false'
      //   }
      // };
      // this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
      //   this.router.navigate(['/main/dashboard/review'], this.navigationExtras));
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top'
    });
    window.location.replace('/main/dashboard/review');
    // this.router.navigateByUrl('/main/dashboard/review');
  }
}
