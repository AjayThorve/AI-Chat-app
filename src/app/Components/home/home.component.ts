import { Component, OnInit } from '@angular/core';
import {AwsAuthService} from "../../Services/aws-auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, public awsAuth: AwsAuthService) {

    this.awsAuth.signIn.subscribe(
      data => {
        console.log('inside homecomponent: value is' + data);
        if (data == false) {
          this.router.navigate(['authenticate']);
        }
      }
    );
  }

  ngOnInit() {
  }

}
