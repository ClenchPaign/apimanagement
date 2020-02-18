import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';

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
  constructor(private listingService: ListingService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.color = false;
    this.category = this.listingService.category;

    // this.route.paramMap.subscribe(params => {
    //   this.category = params.get('category');
    // });


    this.listingService.getAllCategories().subscribe(
      data => {
        console.log('GET Request is successful ', data);
        this.response = data;
      },
      res => { console.log(res); });

  }

  onTag() {
    this.tags = this.listingService.getTagsFromSearch();
    this.tags = this.tags.filter((el, i, a) => i === a.indexOf(el));
    // console.log('tags list:' + this.tags);
  }

  onCategoryHeadClick() {
    this.router.navigateByUrl('/main/category');
    this.tags = null;
    this.ngOnInit();
  }
  onRemoveTag(tag: string, index: number) {
    // this.tags = this.tags.filter(item => item !== tag);
    const chip = document.getElementsByClassName('chips');
    console.log('number' + index);
    const gg = chip[index] as HTMLDivElement;
    gg.style.backgroundColor = 'lightgrey';
    gg.style.color = '#000';
  }

  onSelectingCategory(item: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/main/category/' + item]));
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
}
