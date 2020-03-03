import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-category-of-questions',
  templateUrl: './category-of-questions.component.html',
  styleUrls: ['./category-of-questions.component.css']
})
export class CategoryOfQuestionsComponent implements OnInit {
  response: any;
  description = '';
  hello: any;
  navigationExtras: NavigationExtras;
  pageSize = 5;
  from: number = 0;
  pagesizelist = [5, 10, 25];

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

    this.listingService.getQuestionsForCategory(this.category, this.from, this.pageSize).subscribe(
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
  nextPage() {
    if (this.pageSize > this.response.length) {
      console.log('no load - from-> ' + this.from);
    } else {
      this.from = this.from + this.pageSize;
      this.listingService.getQuestionsForCategory(this.category, this.from, this.pageSize).subscribe(
        data => {
          this.response = data;
        },
        res => {
          // console.log(res);
        }
      );
    }
  }
  previousPage() {
    if (this.from > this.pageSize) {
      this.from = this.from - this.pageSize;
    } else {
      this.from = 0;
    }
    this.listingService.getQuestionsForCategory(this.category, this.from, this.pageSize).subscribe(
      data => {
        this.response = data;
      },
      res => {
        // console.log(res);
      }
    );
  }

  onChange($event) {
    let text = $event.target.options[$event.target.options.selectedIndex].text;
    // console.log('page size-'+text+' var-'+this.pageSize);
    this.pageSize = text;
    this.listingService.getQuestionsForCategory(this.category, this.from, this.pageSize).subscribe(
      data => {
        this.response = data;
      },
      res => {
        // console.log(res);
      }
    );
  }

  getQuestions(): Array<QAEntry> {
    const tagList: string[] = [];
    const editedResponse: Array<QAEntry> = this.response;
    for (let i = 0; i < editedResponse.length; i++) {
      let temp: string = this.response[i].Question.description.replace(/<[^>]*>/g, '');
      temp = temp.replace(/&nbsp;/g, '');
      editedResponse[i].Question.description = temp;
      for (const j of editedResponse[i].tags) {
        tagList.push(j);
      }
    }
    this.listingService.setTags(tagList);
    return editedResponse;
  }

  getTags(straray: Array<string>): Array<string> {
    straray = straray.slice(0, 5);
    return straray;
    // return straray.lastIndexOf(2);
  }
  onClick(id: string) {
    console.log('clicked here --' + id);
    this.listingService.id = id;
    // this.router.navigateByUrl('/cat');
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);
    this.listingService.keyword = tag;
    this.navigationExtras = {
      queryParams: {
        'isSearchFromFilters': 'fromtags',
        'tag': tag,
        'keyword': ''
      }
    };
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      // this.router.navigate(['/main/search/' + tag + '/ '], this.navigationExtras));
      this.router.navigate(['/main/home/search/list'], this.navigationExtras));
    // this.router
    //   .navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => this.router.navigate(['/main/home/search/' + tag + '/ ']));
    // this.router.navigateByUrl('/cat');
  }
}
