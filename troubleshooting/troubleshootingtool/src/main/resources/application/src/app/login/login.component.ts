import { Component, OnInit } from '@angular/core';
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
  response: string;
  showPassword: boolean;
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
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const user = new User(username, password, '');
    // const user = new User('y509476', 'Divya@14101997', '');
    if (username === '' && password === '') {
      alert('Please enter username and password');
    } else {
      this.listingService.getAuthstatus(user).subscribe(
        data => {
          console.log('LDAP user auth is successful ', data);
          this.response = data;
          if (this.response === 'true') {
            this.router.navigateByUrl('/main/category');
          } else {
            this.response = 'true';
          }
        },
        err => {
          this.response = 'true';
          console.log('error -- ', err);
        }
      );
    }

  }
}

