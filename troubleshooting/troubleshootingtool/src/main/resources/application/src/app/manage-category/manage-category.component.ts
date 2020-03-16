import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListingService } from '../listing.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categories } from '../data-models/Categories';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit {
  flag_category: boolean;
  all_categories: any;
  admin_categories:any;
  categories = new FormControl();
  constructor(private listingService: ListingService,
    private router: Router,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    console.log("inside manage cat");
    this.listingService.getAllCategories().subscribe(data => {
      console.log('POST Request is successful ', data);
      this.all_categories = data;
    }
    );
    this.listingService.getAdminCategoies().subscribe(data => {
      console.log('POST Request is successful ', data);
      this.admin_categories = data;
    }
    );
  }

  get_category(){
    return this.all_categories;
  }
  get_admin_category(){
    return this.admin_categories;
  }
  
  add_category() {
    this.flag_category = false;
    const categories = this.categories.value;
    const admin_category = new Categories(categories);
    this.all_categories.forEach((value) => {
      if (value.match(categories)) {
        this.flag_category = true;
        alert("Category already exists");
      }
    });
    this.admin_categories.forEach((value) => {
      if (value.match(categories)) {
        this.flag_category = true;
        alert("Category already exists");
      }
    });
    if (this.flag_category === false) {
      this.listingService.add_admin_category(admin_category).subscribe(data => {
        console.log('POST Request is successful ', data);
        this.openSnackBar('New Category added successfully', 'OK');

      });
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top'
    });
  }
}
