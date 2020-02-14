import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  category: any;
  response: any;
  color: boolean;
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
    console.log('get cat:'+this.route.snapshot.paramMap.get('category'));
    return 'easy';
    // return this.listingService.category;
  }

  getResponse() {
    return this.response;
  }
}
