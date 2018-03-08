import { Injectable } from '@angular/core';
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';

const PoolData = {
  UserPoolId: 'us-east-xxxxxxxxxxx',
  ClientId: 'xxxxxxxxxxxxxxxxxxxxxxxx'
};

const userPool = new CognitoUserPool(PoolData);

@Injectable()
export class AwsAuthService {

  private isUser = new Subject<Boolean>();
  user = this.isUser.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.isUser.next(false);
  }

  // Sign Up User
  signupUser(user: string, password: string, email: string) {
    const dataEmail = {
      Name: 'email',
      Value: email
    };
    const dataPhoneNumber = {
      Name : 'phone_number',
      Value : '+15555555555'
    };
    const  emailAtt = new CognitoUserAttribute(dataEmail);
    const phoneAtt = new CognitoUserAttribute(dataPhoneNumber);
    const attributeList = [];
    attributeList.push(phoneAtt);
    attributeList.push(emailAtt);
    console.log(attributeList);
    userPool.signUp(user, password, attributeList, null, ((err, result) => {
      if (err) {
        console.log('There was an error ', err);
      } else {
        console.log('You have successfully signed up, please confirm your email ');
      }
    }));
  }
  //
  // Confirm User

  authenticateUser(code: string){
    const cognitoUser = userPool.getCurrentUser();


  }
  confirmUser(username: string, code: string) {
    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.log('There was an error -> ', err);
      } else {
        console.log('You have been confirmed ');
      }
    });
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('a20e6aca-ee83-44bc-8033-b41f3078c2b6:c199f9c8-0548-4be79655-7ef7d7bf9d20'));
  }
  //
  // // Sign in User
  //
  signinUser(username: string, password: string) {
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('You are now Logged in');
        console.log(userPool.getCurrentUser());
        this.isUser.next(true);
        this.router.navigate(['dashboard']);
      },
      onFailure: (err) => {
        console.log('There was an error during login, please try again -> ', err);
      }
    });
  }
  // Log User Out
  logoutUser() {
    console.log(userPool.getCurrentUser());
    userPool.getCurrentUser().signOut();

    this.isUser.next(false);
    console.log('logged out');
    this.router.navigate(['userAuth']);
  }
}
