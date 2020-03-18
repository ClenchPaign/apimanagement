import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { Question } from '../data-models/Question';
import { Answer } from '../data-models/Answer';
import { SearchQuery } from '../data-models/SearchQuery';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { ImageModel, AnswerFiles } from '../data-models/ImageModel';
import { PreviousRouteService } from '../previous-route.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  text: string;
  result: string;
}
@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})

export class QuestionDetailsComponent implements OnInit {

  constructor(
    private listingService: ListingService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private previousRoute: PreviousRouteService) { }
  val: any = '';
  response: any;
  postedDate: any;
  ans_count: number;
  username: string;
  userID: string;

  text: string;
  result: string;
  editedResponse: QAEntry;
  navigationExtras: NavigationExtras;
  public answerfiles: string[] = [];
  uploadedFAnswerFiles: string[] = [];

  answerFiles: AnswerFiles[] = [];
  questionFiles: ImageModel[] = [];
  isAdmin: any;
  @Input() id: string;
  @Input() index: string;
  @ViewChild('imageRTE', { static: true })
  private rteObj: RichTextEditorComponent;

  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin');
    this.id = this.listingService.id;
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.index = this.listingService.index;
    this.route.paramMap.subscribe(params => {
      this.index = params.get('index');
    });

    if (this.index === 'review') {
      // review question
      this.listingService.getReviewQuestionForID(this.id).subscribe(
        data => {
          this.response = data;
          // console.log('review ' + JSON.stringify(this.response));
          this.editedResponse = this.response;
          this.listingService.get_files(this.editedResponse.Question.attachment).subscribe(
            dataInside => {
              const files: any = dataInside;
              this.questionFiles = files;
              console.log(this.questionFiles);
            }, res => {
              console.log(res);
            });
          if (this.editedResponse.isAnswered) {
            for (const answer of this.editedResponse.Answers) {
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
          }
        });
    } else {
      // approved question
      this.listingService.getQuestionForID(this.id).subscribe(
        data => {
          this.response = data;
          // console.log('approved ' + JSON.stringify(this.response));
          this.editedResponse = this.response;
          if (this.editedResponse.Question.attachment !== '') {
            this.listingService.get_files(this.editedResponse.Question.attachment).subscribe(
              dataInside => {
                const files: any = dataInside;
                this.questionFiles = files;
              });
          }

          if (this.editedResponse.isAnswered) {
            for (const answer of this.editedResponse.Answers) {
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
          }
        });
    }
    if (this.rteObj !== undefined) {
      this.rteObj.toolbarSettings.items = ['Bold', 'Italic', 'Underline', '|',
        'Formats', 'OrderedList', 'UnorderedList', '|', 'CreateLink', '|', 'Undo', 'Redo', '|', 'SourceCode'];
      this.rteObj.insertImageSettings.saveFormat = 'Base64';
      this.rteObj.enableResize = true;
    }

  }

  openAttachment() {
    const attachmentArea = document.getElementById('hidden_attachment');
    if (attachmentArea.style.visibility === 'hidden') {
      attachmentArea.style.visibility = 'visible';
    } else {
      attachmentArea.style.visibility = 'hidden';
    }
  }

  public removeFiles(file: string) {
    this.answerfiles = this.answerfiles.filter(item => item !== file);
    console.log('remove file:' + file);
  }
  uploadFile(event) {
    for (const droppedFile of event) {
      this.answerfiles.push(droppedFile.name);
      const reader = new FileReader();
      console.log('Name ', droppedFile.name);
      reader.readAsDataURL(droppedFile);
      reader.onload = (e) => {
        const imageModel: ImageModel = new ImageModel('', droppedFile.name, reader.result as string);
        this.listingService.upload_files(imageModel).subscribe(data => {
          console.log('Upload', data);
          this.uploadedFAnswerFiles.push(data + '**' + droppedFile.name);
        });
      };
    }
  }

  close() {
    console.log('close -' + this.previousRoute.getPreviousUrl());
    if (this.previousRoute.getPreviousUrl() === '/' || this.previousRoute.currentUrl === this.previousRoute.previousUrl) {
      this.router.navigateByUrl('/main/home/search/list?isSearchFromFilters=no&tag=&keyword=%20');
    } else {
      this.router.navigateByUrl(this.previousRoute.getPreviousUrl());
    }
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
    }
  }

  showPdf(src: string, fileName: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = src;
    downloadLink.download = fileName;
    downloadLink.click();
  }


  getQuestion(): QAEntry {
    return this.response;
  }
  onTagClick(tag: string) {
    const searchData = new SearchQuery('', [tag], []);
    this.listingService.searchForKeyword(searchData, 0, 5).subscribe(
      data => {
        console.log('Getting questions successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
    this.navigationExtras = {
      queryParams: {
        'isSearchFromFilters': 'fromtags',
        'tag': tag,
        'keyword': ''
      }
    };
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/main/home/search/list'], this.navigationExtras));
  }

  getAnswerAttachmentTemp(attachmentString: string): void {
    console.log('atta string ' + attachmentString);
    const fff: ImageModel[] = [];
    let s = '';
    if (attachmentString === '') {
      // this.answerFiles = [];
    } else {
      const temp = attachmentString.split(',');
      for (const val of temp) {
        let img: any;
        this.listingService.get_files(val).subscribe(dataInside => {
          console.log('response-' + JSON.stringify(dataInside));
          img = dataInside;
          const imageModel = new ImageModel(img.id, img.fileName, img.base64Image);
          fff.push(imageModel);
          s = s + ',' + img.fileName;
        });
      }
    }
    setTimeout(() => {
      return s;
    }, 3000);
  }

  getFilesFromID(id: string): ImageModel[] {
    console.log(this.answerFiles);
    return this.answerFiles[id].imageModelList;
  }
  openDialog(answerID: string): boolean {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { text: 'Are you sure you want to delete this item?', result: 'no' }
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('The dialog was closed' + res.result);
      if (res.result === 'yes') {
        console.log(answerID);
        if (this.editedResponse.isAnswered && this.editedResponse.Answers.length === 1) {
          this.editedResponse.isAnswered = false;
        }
        this.editedResponse.Answers = this.editedResponse.Answers.filter(item => item.id !== answerID);
        for (let i = 0; i < this.editedResponse.Answers.length; i++) {
          this.editedResponse.Answers[i].id = i.toString();
        }
        this.editedResponse.answerCount = this.editedResponse.Answers.length;
        this.listingService.updateQA(this.editedResponse, this.id).subscribe(
          data => {
            console.log('put Request is successful ', data);
            this.response = data;
            this.router.navigateByUrl('/main/qna/' + this.index + '/' + this.id);
          }
        );
      }
    });
    return false;
  }

  post_ans() {
    if (this.val === '') {
      alert('Please add your answer');
    } else {
      const d = new Date();
      const qaEntry = this.response;
      const creationDate = d.getTime();
      this.username = localStorage.getItem('username');
      this.userID = localStorage.getItem('userID');
      const ques = new Question(this.id, qaEntry.Question.category, qaEntry.Question.question, qaEntry.Question.description,
        qaEntry.Question.attachment, qaEntry.Question.creationDate, qaEntry.Question.ownerId, qaEntry.Question.lastModifiedDate);
      const ans = new Answer(qaEntry.answerCount + '', this.val, creationDate, this.userID,
        this.username, creationDate, this.uploadedFAnswerFiles.toString(), 0, false);
      // this.response.Answers.push(ans);
      let answers: Answer[];
      answers = qaEntry.Answers;
      answers.push(ans);
      if (this.uploadedFAnswerFiles.toString() !== '') {
        const attaDiv = this.uploadedFAnswerFiles.toString().split(',');
        const imgModelList: ImageModel[] = [];
        for (const att of attaDiv) {
          const obj = att.split('**');
          const imgModel = new ImageModel(obj[0], obj[1], '');
          imgModelList.push(imgModel);
        }
        const anss = new AnswerFiles(ans.id, imgModelList);
        this.answerFiles.push(anss);
      } else {
        const anss = new AnswerFiles(ans.id, []);
        this.answerFiles.push(anss);
      }

      const qa = new QAEntry(ques, answers, qaEntry.tags, true, qaEntry.isApproved, this.response.Answers.length, 0);

      console.log('posted', qa);
      this.answerFiles.forEach((x) => {
        console.log('Answer ID-' + x.id);
        x.imageModelList.forEach((y) => {
          console.log('file name-' + y.fileName);
        });
      });
      // console.log('put Request is successful ', qa);
      this.listingService.post_answer(qa).subscribe(
        data => {
          console.log('put Request is successful ', data);
          this.response = data;
          (document.getElementById('answercount') as HTMLParagraphElement).innerHTML = this.response.Answers.length + ' Answers';
          this.val = '';
          this.answerfiles = [];
          this.router.navigateByUrl('/main/qna/review/' + this.id);
        }
      );
    }
  }
}
