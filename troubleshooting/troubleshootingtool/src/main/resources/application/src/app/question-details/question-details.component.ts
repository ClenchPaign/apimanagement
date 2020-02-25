import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { Question } from '../data-models/Question';
import { Answer } from '../data-models/Answer';
import { SearchQuery } from '../data-models/SearchQuery';
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { ImageModel } from '../data-models/ImageModel';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})
export class QuestionDetailsComponent implements OnInit {

  constructor(private listingService: ListingService, private router: Router, private route: ActivatedRoute) { }
  val: any = '';
  response: any;
  postedDate: any;
  ans_count: number;

  attachment: string[] = [];
  returnAttachment: string[] = [];
  returnAttachmentFileName: string[] = [];
  attachmentList: any = [];
  @Input() id: string;
  @ViewChild('imageRTE', { static: true })
  private rteObj: RichTextEditorComponent;

  ngOnInit() {
    this.id = this.listingService.id;
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.listingService.getQuestionForID(this.id).subscribe(
      data => {
        this.response = data;
        const temp: string = this.response.Question.attachment;
        this.attachment = temp.split(',');
        for (const val of this.attachment) {
          let img: any;
          this.listingService.get_files(val).subscribe(data => {
            img = data;
            console.log('Get files from attachment '+data);
            this.attachmentList.push(data);
            this.returnAttachment.push(img.base64Image);
            this.returnAttachmentFileName.push(img.fileName);
          },
            res => { });
        }
      },
      res => {
        // console.log('Response =>' + res);
      });
    this.rteObj.toolbarSettings.items = ['Bold', 'Italic', 'Underline', '|',
      'Formats', 'OrderedList', 'UnorderedList', '|', 'CreateLink', '|', 'Undo', 'Redo', '|', 'SourceCode'];
    this.rteObj.insertImageSettings.saveFormat = 'Base64';
    this.rteObj.enableResize = true;

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

  getQuestion(): QAEntry {
    return this.response;
  }
  onTagClick(tag: string) {
    const searchData = new SearchQuery('', [tag], []);
    this.listingService.searchForKeyword(searchData).subscribe(
      data => {
        console.log('Getting questions successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
    this.router.navigateByUrl('/main/search/' + tag + '/ ');
  }

  post_ans() {
    const answer = this.val;
    if (answer === '') {
      alert('Please add your answer');
    }
    else {
      const d = new Date();
      const qaEntry = this.response;
      const creationDate = d.getTime();
      const ques = new Question(this.id, qaEntry.Question.category, qaEntry.Question.question, qaEntry.Question.description,
        qaEntry.Question.attachment, qaEntry.Question.creationDate, qaEntry.Question.ownerId, qaEntry.Question.lastModifiedDate);
      const ans = new Answer(qaEntry.answerCount, answer, creationDate, 'y509476', 'user', creationDate, 0, false);
      this.response.Answers.push(ans);
      let answers: Array<Answer>;
      answers = qaEntry.Answers;
      const qa = new QAEntry(ques, answers, qaEntry.tags, true, answers.length, 0);
      this.listingService.post_answer(qa, this.id).subscribe(
        data => {
          console.log('put Request is successful ', data);
          this.response = data;
          (document.getElementById('answercount') as HTMLParagraphElement).innerHTML = answers.length + ' Answers';
          this.val = '';
        }
      );
    }
  }
}
