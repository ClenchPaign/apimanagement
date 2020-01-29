import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from '../listing.service';
import { SearchQuery } from '../data-models/SearchQuery';
import { QAEntry } from '../data-models/QAEntry';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  response: any;
  category: any;
  searchdata: SearchQuery;
  constructor(private listingService: ListingService, private router: Router) { }
  ngOnInit() {
    this.listingService.searchForKeyword(this.searchdata).subscribe(
      data => {
        console.log('Getting questions for ' + this.searchdata + ' successful ', data);
        this.response = data;
      },
      res => {
        console.log(res);
      });
  }
  getQuestions(): Array<QAEntry> {
    return this.response;
  }
  getTags(straray: Array<string>): Array<string> {
    straray = straray.slice(0, 5);
    return straray;
  }
  search(value: any) {
    const keyword = (document.getElementById('searchinput') as HTMLInputElement).value;
    if (keyword === '') {
      this.searchdata = new SearchQuery('', [], []);
    } else {
      this.searchdata = new SearchQuery('', [], [(document.getElementById('searchinput') as HTMLInputElement).value]);
    }
    this.ngOnInit();
    this.getQuestions();
  }

  onClick(id: string) {

    this.listingService.id = id;
    (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.search('');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/qnas/' + id]));

  }

  onEnter() {
    console.log('enteredd');
    const val = (document.getElementById('searchinput') as HTMLInputElement).value;
    (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.search('');
    this.listingService.keyword = val;
    this.router.navigateByUrl('/search/' + val);
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);
    this.listingService.keyword = tag;
    (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.search('');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/search/' + tag]));
    // this.router.navigateByUrl('/cat');
  }
}
