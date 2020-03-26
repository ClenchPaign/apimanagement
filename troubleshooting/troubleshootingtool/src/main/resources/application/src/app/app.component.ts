import { Component, OnInit, Input } from '@angular/core';
import { ListingService } from './listing.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Pantomath';
  category: any;
  constructor(private listingService: ListingService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.category = this.listingService.category;
    this.router.paramMap.subscribe(params => {
      this.category = params.get('category');
    });
  }
  getCategory(): string {
    this.category = this.listingService.category;
    return this.category;
  }
}
