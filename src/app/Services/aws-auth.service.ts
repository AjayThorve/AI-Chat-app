import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import * as AWS from 'aws-sdk';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { CredObj } from '../Interfaces/CredObj.type';

const authData = {
  ClientId : 'Your client id here', // Your client id here
  AppWebDomain : 'samchatapp.auth.us-east-1.amazoncognito.com',
  TokenScopesArray : ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  RedirectUriSignIn : 'https://s3.amazonaws.com/elasticbeanstalk-us-east-1-878823813267/index.html',
  RedirectUriSignOut : 'https://s3.amazonaws.com/elasticbeanstalk-us-east-1-878823813267/index.html',
  IdentityProvider : '', // e.g. 'Facebook',
  UserPoolId : 'us-east-1_XXXXXXXXX', // Your user pool id here
  AdvancedSecurityDataCollectionFlag : false,
};

@Injectable()
export class AwsAuthService {

  private isSignedIn: Subject<boolean> = new BehaviorSubject<boolean>(false);

  signIn = this.isSignedIn.asObservable();

  private credentials = new Subject<CredObj>();
  credentials_values = this.credentials.asObservable();
  private username = 'user';

  auth = new CognitoAuth(authData);

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
    const that = this;
    this.auth.userhandler = {
      onSuccess: function(result) {
        console.log('Sign in success');
        that.setSignIn();
        that.showSignedIn(result);
      },
      onFailure: function(err) {
        console.log('sign in Error' + err);
        that.setSignInFail();
      }
    };
    this.auth.useCodeGrantFlow();

    const curUrl = window.location.href;
    this.auth.parseCognitoWebResponse(curUrl);
  }

  showSignedIn(session) {
    if (session) {
      const idToken = session.getIdToken().getJwtToken();
      if (idToken) {
        const payload = idToken.split('.')[1];
        const tokenobj = JSON.parse(atob(payload));
        const formatted = JSON.stringify(tokenobj, undefined, 2);
        console.log('id token: \n' + formatted);
        this.setCredentials(idToken);
      }
      const accToken = session.getAccessToken().getJwtToken();
      if (accToken) {
        const payload = accToken.split('.')[1];
        const tokenobj = JSON.parse(atob(payload));
        this.username = tokenobj.username;
        const formatted = JSON.stringify(tokenobj, undefined, 2);
        console.log('access token: \n' + formatted);
      }
      const refToken = session.getRefreshToken().getToken();
      if (refToken) {
        console.log('refresh token: \n' + refToken.substring(1, 20));
      }
    }
  }

  setCredentials(idToken) {
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:identitypool',
      Logins : {
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX': idToken
      }
    });
    const credentials_temp = new CredObj();
    const that = this;
    AWS.config.getCredentials(function (err) {
      if (err) {
        console.log(err.stack);
      }else {
        credentials_temp.accessKey = AWS.config.credentials.accessKeyId;
        credentials_temp.secretKey = AWS.config.credentials.secretAccessKey;
        credentials_temp.sessionToken = AWS.config.credentials.sessionToken;
        credentials_temp.region = AWS.config.region;
        that.credentials.next(credentials_temp);
      }
    });
  }

  getUserName() {
    return this.username;
  }
  setSignIn(){
    this.isSignedIn.next(true);
  }

  setSignInFail(){
    this.isSignedIn.next(false);
  }

  logoutUser() {
    this.auth.signOut();
  }

  signInUser(){
    this.auth.getSession();
  }

  getStatus() {
    return this.signIn._isScalar;
  }




}
