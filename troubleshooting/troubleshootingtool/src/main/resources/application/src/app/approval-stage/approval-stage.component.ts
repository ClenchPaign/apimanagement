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
import { ImageModel, AnswerFiles } from '../data-models/ImageModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

export interface DialogData {
  type: string;
  description: string;
}
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
  // uploadedFiles: string[] = [];
  tagsResponse: any;
  response: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  imageUrlPREVIEW: any;
  questionData: any;
  files: string[] = [];

  answerFiles: AnswerFiles[] = [];
  questionFiles: ImageModel[] = [];

  questionDescription: string;
  navigationExtras: NavigationExtras;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // @ViewChild('valueTemplate', { static: true })
  // private template: Template;
  @ViewChild('imageRTE', { static: true })
  private rteObj: RichTextEditorComponent;
  // @ViewChild('imageRTEForAnswer', { static: true })
  // private rteObjAnswer: RichTextEditorComponent;

  question = new FormControl('', [
    Validators.required,
  ]);
  categories = new FormControl();
  userID: string;
  userName: string;
  isLoaded: boolean;

  constructor(
    private listingService: ListingService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    // public answerFiles: AnswerFiles[],
    // public questionFiles: ImageModel[]
  ) { }

  ngOnInit() {
    this.id = this.listingService.id;
    this.userID = localStorage.getItem('userID');
    this.userName = localStorage.getItem('username');
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      // console.log('ID in approval stage:' + this.id);
    });
    this.listingService.getReviewQuestionForID(this.id).subscribe(
      data => {
        console.log('Review qn is successful ', data);
        this.questionData = data;
        this.questionDescription = this.questionData.Question.description;
        this.question.setValue(this.questionData.Question.question);
        this.categories.setValue(this.questionData.Question.category);
        this.questionData.tags.forEach(element => {
          this.fruits.push({ name: element });
        });
        if (this.questionData.Question.attachment !== '') {
          this.listingService.get_files(this.questionData.Question.attachment).subscribe(
            dataInside => {
              const files: any = dataInside;
              this.questionFiles = files;
            });
        }

        if (this.questionData.isAnswered) {
          for (const answer of this.questionData.Answers) {
            if (answer.attachment !== '') {
              const attaDiv = answer.attachment.split(',');
              const imgModelList: ImageModel[] = [];
              for (const att of attaDiv) {
                const obj = att.split('**');
                const imgModel = new ImageModel(obj[0], obj[1], '');
                imgModelList.push(imgModel);
              }
              const anss = new AnswerFiles(answer.id, imgModelList);
              this.answerFiles.push(anss);
            } else {
              const anss = new AnswerFiles(answer.id, []);
              this.answerFiles.push(anss);
            }
          }
          // for (let i = 0; i < this.questionData.Answers.length; i++) {
          //   this.listingService.get_files(this.questionData.Answers[i].attachment).subscribe(
          //     dataInside => {
          //       const files: any = dataInside;
          //       const anss = new AnswerFiles(this.questionData.Answers[i].id, files);
          //       this.answerFiles.push(anss);
          //       console.log(this.questionData.Answers[i].id + '=' + this.questionData.Answers[i].attachment);
          //     }, res => {
          //       console.log(this.questionData.Answers[i].id + '=' + this.questionData.Answers[i].attachment);
          //       const anss = new AnswerFiles(this.questionData.Answers[i].id, []);
          //       this.answerFiles.push(anss);
          //     });
          //   if (i === this.questionData.Answers.length - 1) {
          //     this.isLoaded = true;
          //   }
          // }
        } else {
          this.isLoaded = true;
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

    // this.rteObjAnswer.toolbarSettings.items = ['Bold', 'Italic', 'Underline', '|',
    //   'Formats', 'OrderedList', 'UnorderedList', '|', 'CreateLink', '|', 'Undo', 'Redo', '|', 'SourceCode'];
    // this.rteObjAnswer.enableResize = true;
  }

  onAttachmentClick(itemName: string, type: string) {
    console.log('type=' + type);
    if (type === 'question') {
      for (const item of this.questionFiles) {
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
    } else {
      let attachment: ImageModel;
      this.listingService.get_files(type).subscribe(
        dataInside => {
          const attachmentObject = dataInside;
          attachment = attachmentObject[0];
          if (attachment.base64Image.includes('/png') || attachment.base64Image.includes('/jpeg')) {
            const image = new Image();
            image.src = attachment.base64Image;
            const w = window.open(attachment.fileName);
            w.document.write(image.outerHTML);
          } else {
            this.showPdf(attachment.base64Image, attachment.fileName);
          }
        }, res => {

        }
      );
      // list = this.answerFiles[Number(type)].imageModelList;
    }
  }
  showPdf(src: string, fileName: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = src;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  deleteAnswer(answerID: string) {
    console.log(answerID);
    if (this.questionData.isAnswered && this.questionData.Answers.length === 1) {
      this.questionData.isAnswered = false;
    }
    this.questionData.Answers = this.questionData.Answers.filter(item => item.id !== answerID);
    for (let i = 0; i < this.questionData.Answers.length; i++) {
      this.questionData.Answers[i].id = i.toString();
    }
    this.questionData.answerCount = this.questionData.Answers.length;
  }

  // onLoad() {
  //   this.questionDescription = this.questionData.Question.description;
  //   // console.log('qn desc->' + this.questionData.Question.description);
  //   if (this.questionData.isAnswered) {
  //     // this.rteObjAnswer.valueTemplate = this.questionData.Answers[0].description;
  //   }
  //   this.question.setValue(this.questionData.Question.question);
  //   this.categories.setValue(this.questionData.Question.category);
  //   const temp: string = this.questionData.Question.attachment;
  //   this.attachment = temp.split(',');
  //   this.uploadedFiles = this.attachment;
  //   this.questionData.tags.forEach(element => {
  //     this.fruits.push({ name: element });
  //   });
  //   // this.rteObj.valueTemplate = this.questionData.Question.description;
  // }
  openDialog(descriptionStr: string, typeStr: string): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '90%',
      data: { type: typeStr, description: descriptionStr }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed' + result.description);
      if (result.type === 'question') {
        this.questionDescription = result.description;
      } else {
        this.questionData.Answers[Number(result.type)].description = result.description;
      }
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
  // uploadFile(event) {
  //   for (const droppedFile of event) {
  //     this.files.push(droppedFile.name);
  //     const reader = new FileReader();
  //     console.log('Name ', droppedFile.name);
  //     reader.readAsDataURL(droppedFile);
  //     reader.onload = (e) => {
  //       const imageModel: ImageModel = new ImageModel('', droppedFile.name, reader.result as string);
  //       this.listingService.upload_files(imageModel).subscribe(data => {
  //         console.log('Upload', data);
  //         this.uploadedFiles.push(data);
  //       });
  //     };
  //   }
  // }


  post_qaentry() {
    const question = this.question.value;
    // const description = this.rteObj.getText();
    const description = this.questionDescription;
    const categories = this.categories.value;
    this.quesTags = [];
    // let approveAnswer: boolean;
    // const approveAnswerEle = document.getElementById('approveAnswer') as HTMLInputElement;
    // if (approveAnswerEle.checked) {
    //   approveAnswer = true;
    // } else {
    //   approveAnswer = false;
    // }
    for (const tags of this.fruits) {
      this.quesTags.push(tags.name);
    }
    console.log(this.quesTags);
    let isAnswered: boolean;
    const ques = new Question(this.questionData.Question.id, categories,
      question, description, this.questionData.Question.attachment, this.questionData.Question.creationDate,
      this.questionData.Question.ownerId, this.questionData.Question.lastModifiedDate);
    let qa: QAEntry;
    // let answer: Answer;
    if (this.questionData.isAnswered) {
      isAnswered = true;
      // if (this.val === '') {
      //   ans = this.questionData.Answers[0].description;
      //   answer = new Answer('0', ans, this.questionData.Answers[0].postedDate, this.questionData.Answers[0].ownerUserId,
      //     this.questionData.Answers[0].ownerUserName, this.questionData.Answers[0].lastEditedDate,
      //     this.questionData.Answers[0].attachment, 0, true);
      // } else {
      //   ans = this.val;
      // }
    } else {
      isAnswered = false;
    }
    if (isAnswered) {
      qa = new QAEntry(ques, this.questionData.Answers, this.quesTags, true,
        this.questionData.isApproved, this.questionData.Answers.length, 0);
    } else {
      qa = new QAEntry(ques, [], this.quesTags, false, false, 0, 0);
    }
    // console.log('Question approved ', qa);
    if (question === '' || categories === undefined || description === '') {
      // validate form
      console.log('Form incomplete');
      this.openSnackBar('Provide the required fields', 'OK');
    } else {
      console.log('Question approved ', qa);
      this.listingService.approve_question(qa, this.questionData.Question.id).subscribe(data => {
        console.log('Question approved ', data);
        this.openSnackBar('Question approved successfully', 'OK');
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/main/qna/approved/' + this.questionData.Question.id]));
        }, 2000);
      });
    }
  }

  reject_qaentry() {
    this.listingService.reject_question(this.questionData.Question.id).subscribe(data => {
      console.log('Question rejected ', data);
      this.openSnackBar('Question rejected', 'OK');
      this.router.navigateByUrl('/main');
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['white-snackbar']
    });
  }
}
