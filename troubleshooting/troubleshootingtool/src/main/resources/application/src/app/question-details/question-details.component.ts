import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute } from '@angular/router';
import { QAEntry } from '../QAEntry';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})
export class QuestionDetailsComponent implements OnInit {

  constructor(private listingService: ListingService, private router: ActivatedRoute) {}

  response: any;
  postedDate: any;
  @Input() id: string;

  ngOnInit() {
    
    this.id = this.listingService.id;
    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.listingService.getQuestionForID(this.id).subscribe(
      data => {
        console.log('Questions for ' + this.id + ' successful ', data);
        this.response = data;
        let date = new Date(this.response.Question.creationDate);
      },
      res => { console.log(res); });
  }
  getQuestion(): QAEntry {
    return this.response;
  }

}
