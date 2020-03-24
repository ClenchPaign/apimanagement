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
  head = 'QUESTIONS POSTED';
  index = 'approved';
  constructor(private listingService: ListingService, private route: ActivatedRoute, private router: Router) {
    this.username = localStorage.getItem('username');
    this.userID = localStorage.getItem('userID');
    this.isAdmin = localStorage.getItem('isAdmin');
  }

  ngOnInit() {
    // console.log('user', this.username);
    // console.log('userID', this.userID);
    // console.log('ADMIN', this.isAdmin);
    this.listingService.getAllReviewQuestions().subscribe(
      data => {
        // Pending questions for Approval
        this.response = data;
        let temp = this.response;
        temp = temp.filter(qa => qa.Question.ownerId === this.userID);
        this.pendingquestions = temp.length;
      },
      res => { console.log(res); });
    this.listingService.getAllQuestions().subscribe(
      data => {
        // Questions Posted
        this.response = data;
        console.log(data);
        this.questionsposted = this.response.length;
        this.getQuestions('question');
      },
      res => { console.log(res); });
    this.listingService.getAllQuestions().subscribe(
      data => {
        // Questions Answered
        this.response = data;
        const editedResponseTemp = [];
        for (const qa of this.response) {
          if (qa.isAnswered) {
            let userAnswered = false;
            for (const ans of qa.Answers) {
              if (ans.ownerUserId === this.userID) {
                userAnswered = true;
              }
            }
            if (userAnswered) {
              editedResponseTemp.push(qa);
            }
          }
        }
        this.questionsanswered = editedResponseTemp.length;
      },
      res => { console.log(res); });

  }

  getQuestions(type: string) {
    this.editedResponse = this.response;
    // for (let i = 0; i < this.editedResponse.length; i++) {
    if (type === 'question') {
      this.editedResponse = [];
      for (let i = 0; i < this.response.length; i++) {
        let temp: string = this.response[i].Question.description.replace(/&nbsp;/g, '');
        temp = temp.replace(/<[^>]*>/g, '');
        this.response[i].Question.description = temp;
        // console.log(i + ' question posted-' + this.response[i].Question.ownerId);
        if (this.response[i].Question.ownerId === this.userID) {
          this.editedResponse.push(this.response[i]);
        }
        this.questionsposted = this.editedResponse.length;
      }
    } else if (type === 'answer') {
      this.editedResponse = [];
      for (const qa of this.response) {
        let temp: string = qa.Question.description.replace(/&nbsp;/g, '');
        temp = temp.replace(/<[^>]*>/g, '');
        qa.Question.description = temp;
        if (qa.isAnswered) {
          let userAnswered = false;
          for (const ans of qa.Answers) {
            if (ans.ownerUserId === this.userID) {
              userAnswered = true;
            }
          }
          if (userAnswered) {
            this.editedResponse.push(qa);
          }
        }
      }
      this.questionsanswered = this.editedResponse.length;
      console.log(this.editedResponse);
    } else if (type === 'pending') {
      this.editedResponse = [];
      console.log('In get qns-' + JSON.stringify(this.response));
      for (const qa of this.response) {
        let temp: string = qa.Question.description.replace(/&nbsp;/g, '');
        temp = temp.replace(/<[^>]*>/g, '');
        qa.Question.description = temp;
        if (qa.isApproved) {
          let answerByThisUser = false;
          for (const ans of qa.Answers) {
            console.log('ans-' + ans.id + ans.ownerUserId + ' ' + ans.isApproved);
            if (ans.ownerUserId === this.userID && ans.isApproved === false) {
              console.log('answer By This User');
              answerByThisUser = true;
            }
          }
          if (answerByThisUser) {
            this.editedResponse.push(qa);
          }
        } else {
          console.log('else' + this.userID + ' ' + qa.Question.ownerId);
          if (this.userID === qa.Question.ownerId) {
            this.editedResponse.push(qa);
          }
        }
      }
      this.pendingquestions = this.editedResponse.length;
      console.log(this.editedResponse);
      // for (const qaEntry of this.editedResponse) {
      //   this.editedResponse = this.editedResponse.filter(qa => qa.Question.ownerId === this.userID);
      //   let temp: string = qaEntry.Question.description.replace(/&nbsp;/g, '');
      //   temp = temp.replace(/<[^>]*>/g, '');
      //   qaEntry.Question.description = temp;
      //   this.pendingquestions = this.editedResponse.length;
      // }
    }
    // }
    return this.editedResponse;
  }
  cardClick(action: string) {
    this.head = action;
    if (action === 'QUESTIONS POSTED') {
      this.listingService.getAllQuestions().subscribe(
        data => {
          this.response = data;
          console.log(data);
          this.index = 'approved';
          this.questionsposted = this.response.length;
          this.getQuestions('question');
        },
        res => { console.log(res); });
    } else if (action === 'QUESTIONS ANSWERED') {
      this.listingService.getAllQuestions().subscribe(
        data => {
          this.response = data;
          this.questionsanswered = this.response.length;
          console.log(data);
          this.index = 'approved';
          this.getQuestions('answer');
        },
        res => { console.log(res); });
    } else if (action === 'PENDING QUESTIONS FOR APPROVAL') {
      this.listingService.getAllReviewQuestions().subscribe(
        data => {
          this.response = data;
          this.index = 'review';
          this.pendingquestions = this.response.length;
          // console.log('pending data-' + this.response);
          this.getQuestions('pending');
        },
        res => { console.log(res); });
    }
  }
  questionDetails(id: string) {
    this.router.navigateByUrl('main/qna/' + this.index + '/' + id);
  }
  goToMain() {
    this.router.navigateByUrl('/main');
  }
}
