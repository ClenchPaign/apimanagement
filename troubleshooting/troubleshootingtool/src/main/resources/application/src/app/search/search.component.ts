import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
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
  tags: any;
  username: string;
  isAdmin: any;
  password: string;
  navigationExtras: NavigationExtras;
  

  constructor(private listingService: ListingService, private route: ActivatedRoute, public router: Router, private eRef: ElementRef) {
    // this.route.queryParams.subscribe(params => {
    //   this.tags = params['tags'];
    //   console.log('In search comp: ' + this.tags);
    //   this.searchdata = new SearchQuery('', this.tags, []);
    //   this.ngOnInit();
    // });
  }
  ngOnInit() {

    this.listingService.searchForKeyword(this.searchdata, 0, 5).subscribe(
      data => {
        this.response = data;
      },
      res => {
        console.log(res);
      });

    this.username = localStorage.getItem('username');
    this.isAdmin = localStorage.getItem('isAdmin');
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.response = null;
    }
  }
  getQuestions(): Array<QAEntry> {
    return this.response;
  }
  getTags(straray: Array<string>): Array<string> {
    straray = straray.slice(0, 5);
    return straray;
  }
  search(value: any) {
    let id = this.listingService.category;
    if (id === undefined || id === '') {
      id = '';
    }
    const keyword = (document.getElementById('searchinput') as HTMLInputElement).value;
    if (keyword === '') {
      this.searchdata = new SearchQuery('', [], []);
    } else {
      this.searchdata = new SearchQuery(id, [], [keyword]);
    }
    this.ngOnInit();
    this.getQuestions();
  }

  onClick(id: string) {

    this.listingService.id = id;
    // (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.response = null;
    // this.search('');
    this.navigationExtras = {
      queryParams: {
        'isSearchFromFilters': 'no',
        'tag': '',
        'keyword': id
      }
    };
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['main/qna/approved/' + id], this.navigationExtras));

  }

  onEnter() {
    const val = (document.getElementById('searchinput') as HTMLInputElement).value;
    // (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.response = null;
    this.listingService.keyword = val;
    if (this.listingService.keyword === '') {
      console.log('now here-' + val);
      this.navigationExtras = {
        queryParams: {
          'isSearchFromFilters': 'no',
          'tag': '',
          'keyword': ' '
        }
      };
    } else {
      console.log('now here-' + val);
      this.navigationExtras = {
        queryParams: {
          'isSearchFromFilters': 'no',
          'tag': '',
          'keyword': val
        }
      };
    }
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/main/home/search/list'], this.navigationExtras));
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);
    this.listingService.keyword = tag;
    (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.search('');
    this.navigationExtras = {
      queryParams: {
        'isSearchFromFilters': 'searchbar-tag',
        'tag': tag,
        'keyword': ''
      }
    };
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      // this.router.navigate(['/main/search/' + tag + '/ '], this.navigationExtras));
      this.router.navigate(['/main/home/search/list'], this.navigationExtras));
  }

  logout() {
    // const user = new User(this.username, this.password, "", false);
    this.listingService.logout().subscribe(
      data => {
        console.log(data);
        if (data === 'true') {
          localStorage.removeItem('username');
          localStorage.removeItem('userID');
          localStorage.removeItem('isAdmin');
        }
      });
    this.router.navigateByUrl('/');
  }
}
