import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { Question } from '../data-models/Question';
import { Answer } from '../data-models/Answer';
import { FormControl } from '@angular/forms';
import { SearchQuery } from '../data-models/SearchQuery';

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
  @Input() id: string;

  ngOnInit() {
    this.id = this.listingService.id;
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.listingService.getQuestionForID(this.id).subscribe(
      data => {
        console.log('Questions for ' + this.id + ' successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }

  getQuestion(): QAEntry {
    return this.response;
  }
  onTagClick(tag: string) {
    console.log('on - - - clicked ' + tag);
    const searchData = new SearchQuery('', [tag], []);
    this.listingService.searchForKeyword(searchData).subscribe(
      data => {
        console.log('Getting questions successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
    this.router.navigateByUrl('/search/' + tag + '/ ');
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    // this.router.navigate(['/search/' + tag ]));
    // this.router.navigate(['/search/' + tag + '/']));
    // this.router.navigateByUrl('/cat');
  }


  post_ans() {
    const answer = this.val;
    if (answer === '') {
      alert('Please add your answer');
    }
    else {
      const d = new Date();
      let qa_entry = this.response;
      const creationDate = d.getTime();
      const ques = new Question(this.id, qa_entry.Question.category, qa_entry.Question.question, qa_entry.Question.description,
        qa_entry.Question.attachment, qa_entry.Question.creationDate, qa_entry.Question.ownerId, qa_entry.Question.lastModifiedDate);
      const ans = new Answer('123', answer, creationDate, 'y509476', 'user', creationDate, 0, false);
      this.response.Answers.push(ans);
      let answers: Array<Answer>;
      answers = qa_entry.Answers;
      const qa = new QAEntry(ques, answers, qa_entry.tags, true, answers.length, 0);
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
