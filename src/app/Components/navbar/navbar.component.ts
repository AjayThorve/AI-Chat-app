import { Component, OnInit } from '@angular/core';
import { AwsAuthService } from '../../Services/aws-auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public awsAuth: AwsAuthService) { }

  ngOnInit() {
  }

  logout(e) {
    e.preventDefault();
    console.log('logout');
    this.awsAuth.logoutUser();
    return false;
  }

}
