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
  flagCategory: boolean;
  adminCategories: any;
  categories = new FormControl();
  constructor(
    private listingService: ListingService,
    private router: Router,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    console.log('inside manage cat');
    this.listingService.getAllCategories().subscribe(data => {
      console.log('POST Request is successful ', data);
      this.adminCategories = data;
    }
    );
  }

  get_adminCategory() {
    return this.adminCategories;
  }

  addCategory() {
    this.flagCategory = false;
    const categories = this.categories.value;
    const adminCategory = new Categories(categories);
    this.adminCategories.forEach((value) => {
      if (value.match(categories)) {
        this.flagCategory = true;
        alert('Category already exists');
      }
    });
    if (this.flagCategory === false) {
      this.listingService.add_admin_category(adminCategory).subscribe(data => {
        console.log('POST Request is successful ', data);
        this.categories.setValue('');
        this.adminCategories.push(adminCategory.category);
        this.openSnackBar('New Category added successfully', 'OK');
      }, res => {
        this.openSnackBar('Problem in adding new category', 'OK');
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
