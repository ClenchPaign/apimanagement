import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  myTag: any;
  @Input() keyword: string;
  constructor(private listingService: ListingService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.myTag = params['tags'];
      console.log('In question list comp: ' + this.myTag);
      this.searchData = new SearchQuery('', this.myTag, []);
      this.listingService.searchForKeyword(this.searchData).subscribe(
        data => {
          console.log('Getting questions for ' + this.searchData + ' successful ', data);
          this.response = data;
        },
        res => { console.log(res); });
    });
   }

  ngOnInit() {
    this.keyword = this.listingService.keyword;
    this.route.paramMap.subscribe(params => {
      this.keyword = params.get('keyword');
    });
    this.route.paramMap.subscribe(params => {
      this.tag = params.get('tag');
    });
    if (this.tag === '###' || this.tag === '') {
      console.log('tag empty');
      this.searchData = new SearchQuery('', [], [this.keyword]);
    } else {
      console.log('keyword empty');
      this.searchData = new SearchQuery('', [this.tag], []);
    }
    this.listingService.searchForKeyword(this.searchData).subscribe(
      data => {
        console.log('Getting questions for ' + this.searchData + ' successful ', data);
        this.response = data;
      },
      res => { console.log(res); });
  }
  getQuestions(): Array<QAEntry> {
    const tagList: string[] = [];
    const editedResponse: Array<QAEntry> = this.response;
    for (let i = 0; i < editedResponse.length; i++) {
      let temp: string = this.response[i].Question.description.replace(/&nbsp;/g, '');
      temp = temp.replace(/<[^>]*>/g, '');
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
    console.log('clicked ' + id);
    this.listingService.id = id;
    // this.router.navigateByUrl('/cat');
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);

    this.searchData = new SearchQuery('', [tag], []);
    this.listingService.searchForKeyword(this.searchData).subscribe(
      data => {
        console.log('Getting questions successful ', data);
        this.response = data;
      },
      res => { console.log(res); });


    // this.listingService.keyword = tag;
    this.router.navigateByUrl('/main/search/' + tag + '/');
    // this.router.navigateByUrl('/cat');
  }
}
