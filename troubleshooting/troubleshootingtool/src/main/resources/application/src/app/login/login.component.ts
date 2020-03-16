import { Component, OnInit, Input } from '@angular/core';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { ListingService } from '../listing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../data-models/User';
import { element } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  response: any;
  showPassword: boolean;
  isAdmin: any;
  userData: User;
  authentication: string;
  constructor(private listingService: ListingService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.showPassword = false;
  }

  show() {
    const element = document.getElementById('showPassword');
    const password = document.getElementById('password') as HTMLInputElement;
    if (password.type === 'password') {
      this.showPassword = true;
      element.style.color = '#000';
      password.type = 'text';
    } else {
      this.showPassword = false;
      password.type = 'password';
      element.style.color = '#d6d6d6';
    }
  }

  login() {
    const userID = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const user = new User('', userID, password, '', false, false);
    if (userID === '' && password === '') {
      alert('Please enter username and password');
    } else {
      this.listingService.getAuthstatus(user).subscribe(
        data => {
          console.log('LDAP user auth is successful ', data);
          this.response = data;
          this.auth();
          localStorage.setItem('password', password);
        },
        err => {
          this.authentication = 'false';
          console.log('error -- ', err);
        }
      );
    }
  }

  auth() {
    this.userData = JSON.parse(this.response);
    localStorage.setItem('username', this.userData.username);
    localStorage.setItem('userID', this.userData.userID);
    if (this.userData.isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.setItem('isAdmin', 'false');
    }
    localStorage.setItem('email', this.userData.email);
    if (this.userData.isAuthenticated) {
      console.log('inside authen');
      this.authentication = 'true';
      this.router.navigateByUrl('/main');
    } else {
      console.log('inside unauth');
      this.authentication = 'false';
    }
  }
}

