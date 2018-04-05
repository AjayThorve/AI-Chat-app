import { Component, OnInit } from '@angular/core';
import {AwsAuthService} from "../../Services/aws-auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  constructor(private router: Router, public awsAuth: AwsAuthService) {
    // if(this.awsAuth.getStatus() == true){
    //   this.router.navigate(['home']);
    // }
    this.awsAuth.signIn.subscribe(
      data => {
        console.log("inside authenticate component: value is" + data);
        if(data == true){
          this.router.navigate(['home']);
        }
      }
    );
  }

  ngOnInit() {
  }

  signIn(e){
    e.preventDefault();
    this.awsAuth.signInUser();
  }

}
