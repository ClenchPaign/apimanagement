import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QAEntry } from '../QAEntry';

@Component({
  selector: 'app-category-of-questions',
  templateUrl: './category-of-questions.component.html',
  styleUrls: ['./category-of-questions.component.css']
})
export class CategoryOfQuestionsComponent implements OnInit {

  response: any;
  @Input() category: string;
  constructor(private listingService: ListingService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.category = this.listingService.category;
    this.router.paramMap.subscribe(params => {
      this.category = params.get('category');
    });

    this.listingService.getQuestionsForCategory(this.category).subscribe(
      data => {
        console.log('Getting questions for ' + this.category + ' successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }
  getQuestions(): Array<QAEntry> {
    return this.response;
  }
}
