import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';

@Component({
  selector: 'app-category-of-questions',
  templateUrl: './category-of-questions.component.html',
  styleUrls: ['./category-of-questions.component.css']
})
export class CategoryOfQuestionsComponent implements OnInit {
  response: any;
  @Input() category: string;
  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.category = this.listingService.category;
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category');
    });

    this.listingService.getQuestionsForCategory(this.category).subscribe(
      data => {
        console.log(
          'Getting questions for ' + this.category + ' successful ',
          data
        );
        this.response = data;
      },
      res => {
        console.log(res);
      }
    );
  }
  getQuestions(): Array<QAEntry> {
    return this.response;
  }

  getTags(straray: Array<string>): Array<string> {
    straray = straray.slice(0, 5);
    return straray;
    // return straray.lastIndexOf(2);
  }
  onClick(id: string) {
    console.log('clicked ' + id);
    this.listingService.id = id;
    // this.router.navigateByUrl('/cat');
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);
    this.listingService.keyword = tag;
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/search/' + tag + '/ ']));
    // this.router.navigateByUrl('/cat');
  }
}
