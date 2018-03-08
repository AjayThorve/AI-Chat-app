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
              private route: ActivatedRoute) {

    route.queryParams.subscribe(
      data => {
        if (data['code'] != null) {
          console.log('queryParams', data['code']);
          this.code = data['code'];
          console.log('code is ' + this.code);
        }
        this.router.navigate(['dashboard']);
    });
  }

}
