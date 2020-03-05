import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public username: any;
  public userID: any;
  public isAdmin: any;
  questionsposted;
  questionsanswered;
  pendingquestions;
  response: any;
  editedResponse: Array<QAEntry>;
  head = 'Pending questions for Approval';
  constructor(private listingService: ListingService, private route: ActivatedRoute, private router: Router) {
    this.username = localStorage.getItem('username');
    this.userID = localStorage.getItem('userID');
    this.isAdmin = localStorage.getItem('isAdmin');
  }

  ngOnInit() {
    console.log('user', this.username);
    console.log('userID', this.userID);
    console.log('ADMIN', this.isAdmin);
    this.listingService.getAllQuestions().subscribe(
      data => {
        this.response = data;
        this.cardClick('Questions Posted');
      });
    this.listingService.getAllQuestions().subscribe(
      data => {
        this.response = data;
        this.questionsanswered = this.response.length;
      });
    this.listingService.getAllReviewQuestions().subscribe(
      data => {
        this.response = data;
        this.cardClick('Pending questions for Approval');
      });
  }

  getQuestions(type: string) {
    this.editedResponse = this.response;
    for (let i = 0; i < this.editedResponse.length; i++) {
      let temp: string = this.response[i].Question.description.replace(/&nbsp;/g, '');
      temp = temp.replace(/<[^>]*>/g, '');
      this.editedResponse[i].Question.description = temp;
      if (type === 'question') {
        this.editedResponse = this.editedResponse.filter(qa => qa.Question.ownerId === this.userID);
        this.questionsposted = this.editedResponse.length;
      } else if (type === 'answer') {
        this.questionsanswered = this.editedResponse.length;
      } else {
        this.editedResponse = this.editedResponse.filter(qa => qa.Question.ownerId === this.userID);
        this.pendingquestions = this.editedResponse.length;
      }
    }
    return this.editedResponse;
  }
  cardClick(action: string) {
    this.head = action;
    if (action === 'Questions Posted') {
      this.listingService.getAllQuestions().subscribe(
        data => {
          this.response = data;
          console.log(data);
          this.questionsposted = this.response.length;
          this.getQuestions('question');
        },
        res => { console.log(res); });
    } else if (action === 'Questions Answered') {
      this.listingService.getAllQuestions().subscribe(
        data => {
          this.response = data;
          this.questionsanswered = this.response.length;
          console.log(data);
          this.getQuestions('answer');
        },
        res => { console.log(res); });
    } else if (action === 'Pending questions for Approval') {
      this.listingService.getAllReviewQuestions().subscribe(
        data => {
          this.response = data;
          this.pendingquestions = this.response.length;
          console.log(data);
          this.getQuestions('');
        },
        res => { console.log(res); });
    }
  }
}
