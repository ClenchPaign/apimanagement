import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../data-models/User';
import { Admin } from '../data-models/Admin';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit {
  flag_admin: boolean;
  all_admins: any;
  username: any; password: any;
  result: any;
  resultUsers: string[] = [];
  users: string[];
  admin = new FormControl();

  constructor(private listingService: ListingService,
    private router: Router,
    private snackbar: MatSnackBar ) { }

  ngOnInit() {
    this.username = localStorage.getItem("userID");
    this.password = localStorage.getItem("password");
    const user = new User('', this.username, this.password, '', false, false);
    this.listingService.getLdapUsers(user).subscribe(data => {
      console.log('POST Request is successful ', data);
      this.result = data;
    }
    );


    this.listingService.getAllAdmins().subscribe(data => {
      console.log('POST Request is successful ', data);
      this.all_admins = data;
      console.log(this.all_admins);
    }
    );
  }
  getUsers() {
    return this.resultUsers;
  }
  get_admins(){
    return this.all_admins;
  }

  filterUsers(value: string): string[] {

    this.resultUsers = [];
    this.users = this.result;
    console.log('inside filter ' + typeof (this.users));
    const filterValue = value.toLowerCase();

    this.users.forEach((value) => {
      if (value.toLowerCase().includes(filterValue)) {
        this.resultUsers.push(value);
      }
    });
    console.log('list: ' + this.resultUsers.toString());
    return this.resultUsers;
  }


  add_admin() {
    this.flag_admin = false;
    const admin = this.admin.value;
    console.log(admin);
    const admin_name = new Admin(admin);
    this.all_admins.forEach((value) => {
      if (value.match(admin)) {
        this.flag_admin = true;
        alert("Admin already exists");
      }
    });
    if (this.flag_admin === false) {
      this.listingService.add_admin(admin_name).subscribe(data => {
        console.log('POST Request is successful ', data);
        this.openSnackBar('New Admin added successfully', 'OK');
      }, res => {
        console.log(res);
      }
      );
    }

  }
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

}
