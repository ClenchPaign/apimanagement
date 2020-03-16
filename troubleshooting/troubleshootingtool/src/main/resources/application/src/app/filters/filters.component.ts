import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { SearchQuery } from '../data-models/SearchQuery';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  category: any;
  response: any;
  color: boolean;
  tags: string[];
  categoryList: string[];

  selectedTags: string[] = [];

  constructor(private listingService: ListingService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.color = false;
    this.category = this.listingService.category;
    // this.route.paramMap.subscribe(params => {
    //   this.category = params.get('category');
    // });

    if (this.router.url === '/main/category') {
      // console.log('url - ' + this.router.url);
      setTimeout(() => this.onTag(), 500);
    }
    this.listingService.getAllCategories().subscribe(
      data => {
        // console.log('GET Request is successful ', data);
        this.response = data;
        this.categoryList = this.response;
      },
      res => {
        // console.log(res);
      });
    setTimeout(() => this.onTag(), 800);
  }

  onTag() {
    this.tags = this.listingService.getTagsFromSearch();
    this.categoryList = this.listingService.getCategoriesListFromSearch();
    this.tags = this.tags.filter((el, i, a) => i === a.indexOf(el));
    // this.categoryList = this.categoryList.filter((el, i, a) => i === a.indexOf(el));
    const filterButtons = document.getElementById('filter_buttons');
    filterButtons.style.visibility = 'visible';
  }

  onCategoryHeadClick() {
    this.onTag();
    this.tags = null;
    this.router.navigateByUrl('/main/home/category');
  }
  onRemoveTag(tag: string, index: number) {
    const chip = document.getElementsByClassName('chips');
    const gg = chip[index] as HTMLDivElement;
    const close = document.getElementsByClassName('close_icon');
    const closeIcon = close[index] as HTMLElement;
    this.selectedTags = this.selectedTags.filter(obj => obj !== tag);
    // console.log('On remove tag :' + this.selectedTags);
    closeIcon.style.display = 'none';
    gg.style.backgroundColor = 'lightgrey';
    gg.style.color = '#000';
  }
  onSelectTag(tag: string, index: number) {
    const chip = document.getElementsByClassName('chips');
    const gg = chip[index] as HTMLDivElement;
    const close = document.getElementsByClassName('close_icon');
    const closeIcon = close[index] as HTMLElement;
    this.selectedTags.push(tag);
    closeIcon.style.display = 'inline';
    gg.style.backgroundColor = '#1776bf';
    gg.style.color = '#fff';
  }
  onSelectingCategory(item: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/main/home/category/' + item + '/0/5']));
  }

  onCategoriesClick() {
    const ele = document.getElementById('category_icon');
    const list = document.getElementById('list');
    if (list.style.visibility === 'visible') {
      ele.style.transform = 'rotate(0deg)';
      list.style.visibility = 'collapse';
      list.style.display = 'none';
    } else {
      ele.style.transform = 'rotate(-90deg)';
      list.style.visibility = 'visible';
      list.style.display = 'block';
    }
  }

  getResponse() {
    return this.response;
  }

  filter() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'tag': this.selectedTags,
        'isSearchFromFilters': 'yes',
      }
    };
    // console.log('On filter: ' + this.selectedTags);
    this.selectedTags = [];
    this.router.navigate(['/main/home/search/list'], navigationExtras);
  }

  removeFilter() {
    const chip = document.getElementsByClassName('chips');
    for (let i = 0; i < chip.length; i++) {
      const gg = chip[i] as HTMLDivElement;
      const close = document.getElementsByClassName('close_icon');
      const closeIcon = close[i] as HTMLElement;
      this.selectedTags = [];
      closeIcon.style.display = 'none';
      gg.style.backgroundColor = 'lightgrey';
      gg.style.color = '#000';
    }
  }
}
