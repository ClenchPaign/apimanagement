import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { Question } from '../data-models/Question';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-review-questions',
  templateUrl: './review-questions.component.html',
  styleUrls: ['./review-questions.component.css']
})
export class ReviewQuestionsComponent {
  response: any;
  editedResponse: Array<QAEntry>;
  public isAdmin: any;
  reload: string;
  constructor(private listingService: ListingService, private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    this.listingService.getAllReviewQuestions().subscribe(
      data => {
        console.log('ng ONInit ', data);
        this.response = data;
        this.getQuestions();
      },
      res => { console.log(res); });
  }

  getQuestions() {
    this.editedResponse = this.response;
    for (let i = 0; i < this.editedResponse.length; i++) {
      let temp: string = this.response[i].Question.description.replace(/&nbsp;/g, '');
      temp = temp.replace(/<[^>]*>/g, '');
      this.editedResponse[i].Question.description = temp;
    }
    return this.editedResponse;
  }

}

