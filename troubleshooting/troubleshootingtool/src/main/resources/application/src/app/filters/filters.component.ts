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


  onSelectingCategory(item: string) {
    // let div = document.getElementById('list-of-categories') as HTMLDivElement;
    // div.style.backgroundColor = 'lightgray';

    // if (this.category === item) {
    //   this.color = true;
    // } else {
    //   this.color = false;
    // }
    console.log('category =>' + this.getCategory());
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/main/category/' + item]));
  }
  getCategory(): string {
    console.log('get cat:' + this.route.snapshot.paramMap.get('category'));
    return 'easy';
    // return this.listingService.category;
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
