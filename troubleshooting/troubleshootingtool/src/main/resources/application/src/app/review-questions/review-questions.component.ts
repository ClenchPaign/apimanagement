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
  editedResponse: [];
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
    console.log('in get Questions');
    this.editedResponse = this.response;
  }

}

