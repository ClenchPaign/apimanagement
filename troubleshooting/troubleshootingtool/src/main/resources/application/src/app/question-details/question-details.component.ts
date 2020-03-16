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
    private previousRoute: PreviousRouteService) { }
  val: any = '';
  response: any;
  postedDate: any;
  ans_count: number;
  username: string;
  userID: string;
  editedResponse: QAEntry;
  navigationExtras: NavigationExtras;

  answerFiles: AnswerFiles[] = [];
  questionFiles: ImageModel[] = [];

  @Input() id: string;
  @Input() index: string;
  @ViewChild('imageRTE', { static: true })
  private rteObj: RichTextEditorComponent;

  ngOnInit() {
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
          console.log('review ' + JSON.stringify(this.response));
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
          console.log('review ' + JSON.stringify(this.response));
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

  post_ans() {
    const answer = this.val;
    if (answer === '') {
      alert('Please add your answer');
    } else {
      const d = new Date();
      const qaEntry = this.response;
      const creationDate = d.getTime();
      this.username = localStorage.getItem('username');
      this.userID = localStorage.getItem('userID');
      const ques = new Question(this.id, qaEntry.Question.category, qaEntry.Question.question, qaEntry.Question.description,
        qaEntry.Question.attachment, qaEntry.Question.creationDate, qaEntry.Question.ownerId, qaEntry.Question.lastModifiedDate);
      const ans = new Answer(qaEntry.answerCount + '', answer, creationDate, this.userID, this.username, creationDate, '', 0, false);
      // this.response.Answers.push(ans);
      let answers: Answer[];
      answers = qaEntry.Answers;
      answers.push(ans);
      this.answerFiles.push(new AnswerFiles(qaEntry.answerCount + '', []));
      const qa = new QAEntry(ques, answers, qaEntry.tags, true, qaEntry.isApproved, this.response.Answers.length, 0);
      console.log('posted', qa);

      this.listingService.post_answer(qa, this.id).subscribe(
        data => {
          console.log('put Request is successful ', data);
          this.response = data;
          (document.getElementById('answercount') as HTMLParagraphElement).innerHTML = this.response.Answers.length + ' Answers';
          this.val = '';
          this.router.navigateByUrl('/main/qna/review/' + this.id);
        }
      );
    }
  }
}
