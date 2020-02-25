import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';

@Component({
  selector: 'app-review-questions',
  templateUrl: './review-questions.component.html',
  styleUrls: ['./review-questions.component.css']
})
export class ReviewQuestionsComponent implements OnInit {

  constructor(private listingService: ListingService) { }
  response: any;

  ngOnInit() {
    this.listingService.getAllReviewQuestions().subscribe(
      data => {
        console.log('Getting review questions successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }

  getQuestions() {
    return this.response;
  }

}
