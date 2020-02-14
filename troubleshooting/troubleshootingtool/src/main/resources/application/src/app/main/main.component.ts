import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
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
