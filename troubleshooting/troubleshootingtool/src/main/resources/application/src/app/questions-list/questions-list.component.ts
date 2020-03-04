import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { QAEntry } from '../data-models/QAEntry';
import { SearchQuery } from '../data-models/SearchQuery';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit {
  response: any;
  searchData: any;
  tag: any;
  navigationExtras: NavigationExtras;
  pageSize = 5;
  from: number = 0;
  pagesizelist = [5, 10, 25];
  editedResponse: Array<QAEntry>;

  // myTag: any;
  // isSearchFromFilters: string;
  @Input() keyword: string;
  constructor(
    private listingService: ListingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // this.keyword = this.listingService.keyword;
    // this.route.paramMap.subscribe(params => {
    //   this.keyword = params.get('keyword');
    // });
    // this.route.paramMap.subscribe(params => {
    //   this.tag = params.get('tag');
    // });
    // if (this.tag === '###' || this.tag === '') {
    //   console.log('tag empty');
    //   this.searchData = new SearchQuery('', [], [this.keyword]);
    // } else {
    //   console.log('keyword empty');
    //   this.searchData = new SearchQuery('', [this.tag], []);
    // }
    // if (this.isSearchFromFilters) {
    //   console.log('search from filters');
    // } else {
    this.route.queryParams.subscribe(params => {
      let tag = params['tag'];
      let keyword = params['keyword'];
      let isSearchFromFilters = params['isSearchFromFilters'];

      console.log(' ng init');
      console.log(' tag ' + tag);
      console.log(' keyword ' + keyword);
      console.log(' isSearchFromFilters ' + isSearchFromFilters);
      if (tag === undefined || tag === '') {
        tag = [];
      }
      if (keyword === undefined || keyword === '') {
        keyword = [];
      }
      if (isSearchFromFilters === 'no') {
        console.log('from searchbar');
        this.searchData = new SearchQuery('', tag, [keyword]);
        this.listingService.searchForKeyword(this.searchData, this.from, this.pageSize).subscribe(
          data => {
            console.log(
              'Getting questions for ' + this.searchData + ' successful ',
              data
            );
            this.response = data;
            this.getQuestions();
          },
          res => {
            console.log(res);
          }
        );
      } else if (isSearchFromFilters === 'fromtags') {
        console.log('from tags');
        this.searchData = new SearchQuery('', [tag], []);
        this.listingService.searchForKeyword(this.searchData, this.from, this.pageSize).subscribe(
          data => {
            console.log(
              'Getting questions for ' + this.searchData + ' successful ',
              data
            );
            this.response = data;
            this.getQuestions();
          },
          res => {
            console.log(res);
          }
        );
      } else if (isSearchFromFilters === 'searchbar-tag') {
        console.log('from tags');
        this.searchData = new SearchQuery('', [tag], []);
        this.listingService.searchForKeyword(this.searchData, this.from, this.pageSize).subscribe(
          data => {
            console.log(
              'Getting questions for ' + this.searchData + ' successful ',
              data
            );
            this.response = data;
            this.getQuestions();
          },
          res => {
            console.log(res);
          }
        );
      } else {
        console.log('from filters');
        this.searchData = new SearchQuery('', tag, keyword);
        this.listingService.searchForKeyword(this.searchData, this.from, this.pageSize).subscribe(
          data => {
            console.log(
              'Getting questions for ' + this.searchData + ' successful ',
              data
            );
            this.response = data;
            this.getQuestions();
          },
          res => {
            console.log(res);
          }
        );
      }
    });
  }

  nextPage() {
    if (this.pageSize > this.response.length) {
      console.log('no load - from-> ' + this.from + ' page size-> ' + this.pageSize);
    } else {
      this.from = Number(this.from) + Number(this.pageSize);
      console.log('load else - from-> ' + this.from + ' page size-> ' + this.pageSize);
      this.postCall();
    }
  }
  previousPage() {
    if (this.from > this.pageSize) {
      this.from = Number(this.from) - Number(this.pageSize);
      console.log('previous - from-> ' + this.from + ' page size-> ' + this.pageSize);
      this.postCall();
    } else {
      this.from = 0;
      console.log('previous for zero - from-> ' + this.from + ' page size-> ' + this.pageSize);
      this.postCall();
    }
  }

  onChange($event) {
    const text = $event.target.options[$event.target.options.selectedIndex].text;
    console.log('page size-' + text + ' var-' + this.pageSize);
    this.pageSize = text;
    this.postCall();
  }

  postCall() {
    this.listingService.searchForKeyword(this.searchData, this.from, this.pageSize).subscribe(
      data => {
        this.response = data;
        this.getQuestions();
        console.log(data);
      },
      res => {
        console.log(res);
      }
    );
  }

  getQuestions(): Array<QAEntry> {
    const tagList: string[] = [];
    this.editedResponse = this.response;
    for (let i = 0; i < this.editedResponse.length; i++) {
      let temp: string = this.response[i].Question.description.replace(
        /&nbsp;/g,
        ''
      );
      temp = temp.replace(/<[^>]*>/g, '');
      this.editedResponse[i].Question.description = temp;
      for (const j of this.editedResponse[i].tags) {
        tagList.push(j);
      }
    }
    this.listingService.setTags(tagList);
    const noResult = document.getElementById('no_results');
    const questionItems = document.getElementById('question_items');
    if (this.editedResponse.length === 0) {
      noResult.style.visibility = 'visible';
      questionItems.style.visibility = 'hidden';
    } else {
      noResult.style.visibility = 'hidden';
      questionItems.style.visibility = 'visible';
    }
    // const emptyObj ={};
    this.editedResponse = this.editedResponse.filter((value => JSON.stringify(value) !== '{}'));
    // editedResponse = editedResponse
    // console.log('edited size' + this.editedResponse.length);
    return this.editedResponse;
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

    this.searchData = new SearchQuery('', [tag], []);
    this.listingService.searchForKeyword(this.searchData, this.from, this.pageSize).subscribe(
      data => {
        console.log('Getting questions successful ', data);
        this.response = data;
      },
      res => {
        console.log(res);
      }
    );

    this.navigationExtras = {
      queryParams: {
        isSearchFromFilters: 'fromtags',
        tag: tag,
        keyword: ''
      }
    };
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      // this.router.navigate(['/main/search/' + tag + '/ '], this.navigationExtras));
      this.router.navigate(['/main/home/search/list'], this.navigationExtras)
    );
    // this.listingService.keyword = tag;
    // this.router.navigateByUrl('/main/home/search/' + tag + '/');
    // this.router.navigateByUrl('/cat');
  }
}
