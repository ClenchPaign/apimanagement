import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from '../listing.service';
import { SearchQuery } from '../data-models/SearchQuery';
import { QAEntry } from '../data-models/QAEntry';
import { User } from '../data-models/User';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  response: any;
  category: any;
  searchdata: SearchQuery;
  username:string;
  password:string;
  
  constructor(private listingService: ListingService, private router: Router, private eRef: ElementRef) { }
  ngOnInit() {
    this.listingService.searchForKeyword(this.searchdata).subscribe(
      data => {
        this.response = data;
      },
      res => {
        console.log(res);
      });

    this.username= this.listingService.getUsername(); 
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
    (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.response = null;
    // this.search('');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['main/qna/' + id]));

  }

  onEnter() {
    const val = (document.getElementById('searchinput') as HTMLInputElement).value;
    (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.response = null;
    this.listingService.keyword = val;
    const tag = '###';
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/main/search/' + tag + '/' + val ]));
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/search/ ' + val + '/']));
  }
  onTagClick(tag: string) {
    console.log('clicked ' + tag);
    this.listingService.keyword = tag;
    (document.getElementById('searchinput') as HTMLInputElement).value = '';
    this.search('');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/main/search/' + tag + '/ ']));
  }

  logout(){
    const user=new User(this.username,this.password,"");
    this.listingService.logout().subscribe(
      data => {
        console.log(data);
        if(data === 'true'){
          this.router.navigateByUrl('/');
        }
      },
     );

  }
}