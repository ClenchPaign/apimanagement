import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categories } from '../data-models/Categories';
import { Admin } from '../data-models/Admin';
import { User } from '../data-models/User';
import { type } from 'os';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  flagCategory: boolean;
  adminCategories: string[];
  categories = new FormControl();
  flagAdmin: boolean;
  allAdmins: string[];
  username: any; password: any;
  result: any;
  resultUsers: string[] = [];
  users: string[];
  admin = new FormControl();
  header: string;
  listHeader: string;

  type: string;
  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type');
      console.log('Type in manage-' + this.type);
      this.load();
    });

  }

  load() {
    if (this.type === 'categories') {
      this.header = 'Add Category';
      this.listHeader = 'List of Categories';
      this.listingService.getAllCategories().subscribe(data => {
        console.log('POST Request is successful ', data);
        const res: any = data;
        this.adminCategories = res;
      });
    } else {
      this.header = 'Add Admin user';
      this.listHeader = 'List of Admin users';
      this.listingService.getAllAdmins().subscribe(data => {
        console.log('POST Request is successful ', data);
        const res: any = data;
        this.allAdmins = res;
      });
    }
  }

  getUsers() {
    return this.resultUsers;
  }


  filterUsers(value: string): string[] {
    this.resultUsers = [];
    this.username = localStorage.getItem('userID');
    this.password = localStorage.getItem('password');
    const user = new User('', this.username, this.password, value, false, false);
    this.listingService.getLdapUsers(user).subscribe(data => {
      this.result = data;
      console.log(this.result);
    });
    if (value !== undefined) {
      const filterValue = value.toLowerCase();
      if (this.result !== undefined) {
        this.result.forEach((value) => {
          if (value.toLowerCase().includes(filterValue)) {
            this.resultUsers.push(value);
          }
        });
      }
    }
    return this.resultUsers;
  }


  add() {
    if (this.type === 'categories') {
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
          console.log(res);
          this.openSnackBar('Problem in adding new category', 'OK');
        });
      }
    } else {
      this.flagAdmin = false;
      const admin = this.admin.value;
      console.log(admin);
      const adminName = new Admin(admin);
      this.allAdmins.forEach((value) => {
        if (value.match(admin)) {
          this.flagAdmin = true;
          alert('Admin already exists');
        }
      });
      if (this.flagAdmin === false) {
        this.listingService.add_admin(adminName).subscribe(data => {
          console.log('POST Request is successful ', data);
          this.admin.setValue('');
          this.allAdmins.push(adminName.user);
          this.openSnackBar('Admin user added successfully', 'OK');
        }, res => {
          console.log(res);
          this.openSnackBar('Problem in adding Admin user', 'OK');
        });
      }
    }
  }
  getList() {
    if (this.type === 'categories') {
      return this.adminCategories;
    } else {
      return this.allAdmins;
    }
  }

  delete(item: string) {
    if (this.type === 'categories') {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: { text: 'Are you sure you want to delete this category?', result: 'no' }
      });
      dialogRef.afterClosed().subscribe((res) => {
        console.log('The dialog was closed' + res.result);
        if (res.result === 'yes') {
          this.listingService.deleteCategory(item).subscribe(data => {
            console.log(data);
            this.adminCategories = this.adminCategories.filter(x => x !== item);
          }, res => {
            console.log(res);
            this.openSnackBar('Problem in deleting Category', 'OK');
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: { text: 'Are you sure you want to revoke ' + item + ' admin access?', result: 'no' }
      });
      dialogRef.afterClosed().subscribe((res) => {
        console.log('The dialog was closed' + res.result);
        if (res.result === 'yes') {
          this.listingService.deleteAdmin(item).subscribe(data => {
            this.allAdmins = this.allAdmins.filter(x => x !== item);
            console.log(data);
          }, res => {
            console.log(res);
            this.openSnackBar('Problem in deleting Admin user', 'OK');
          });
        }
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
