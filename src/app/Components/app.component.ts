import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AwsAuthService } from '../Services/aws-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  code = '';
  constructor(private router: Router,
              public awsAuth: AwsAuthService,
              ) {
    console.log("init app component");

    // if(this.awsAuth.getStatus() == false){
    //   this.router.navigate(['authenticate']);
    // }else{
    //   this.router.navigate(['home']);
    // }
    this.awsAuth.signIn.subscribe(
      data => {
        console.log("inside app component: value is" + data);
        if(data == true){
          this.router.navigate(['home']);
        }else{
          this.router.navigate(['authenticate']);
        }
      }
    );
  }

}
