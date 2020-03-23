import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  constructor(private listingService: ListingService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {  
  }
  manage_category() {
    console.log('manage category');
    this.router.navigateByUrl('/main/administration/manage/categories');
  }
  manage_admin() {
    console.log('manage admin');
    this.router.navigateByUrl('/main/administration/manage/admin');
  }
}
