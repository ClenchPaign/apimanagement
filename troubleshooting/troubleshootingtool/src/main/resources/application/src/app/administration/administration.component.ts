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
    this.router.navigateByUrl('/main/administration/manage_category');
  }
  manage_category() {
    console.log('inside adminstratn');
    this.router.navigateByUrl('/main/administration/manage_category');
  }
  manage_admin() {
    console.log('inside adminstratn');
    this.router.navigateByUrl('/main/administration/manage_admin');
  }
}
