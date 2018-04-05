import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../../Models/ChatMessage.model';
import { DataService } from '../../Services/data.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AwsAuthService} from '../../Services/aws-auth.service';
declare var apigClientFactory: any;
import { CredObj } from '../../Interfaces/CredObj.type';

@Component({
  selector: 'app-chat-message-box',
  templateUrl: './chat-message-box.component.html',
  styleUrls: ['./chat-message-box.component.css'],
})
export class ChatMessageBoxComponent implements OnInit {

  apigClient: any;
  messages: ChatMessage[] = [];
  constructor(private dataService: DataService,
              private awsAuth: AwsAuthService,
              private http: HttpClient) {

    this.awsAuth.credentials_values.subscribe(
      data => {
        console.log(data.accessKey);
        this.apigClient = apigClientFactory.newClient(
          {
            accessKey: data.accessKey,
            secretKey: data.secretKey,
            sessionToken: data.sessionToken,
            region: data.region
          }
        );
      }
    );
    const username: string = awsAuth.getUserName();
    const welcome_msg: string = 'Hi ' + username + ', How can I help you today?';
    this.messages.push(new ChatMessage(welcome_msg, 'received'));
  }

  ngOnInit() {
    this.dataService.message$.subscribe(
      data => {
         const temp = new ChatMessage(data, 'sent');
         this.messages.push(temp);
         const params = {};
         const body = {
           content: temp.content,
         };
         const additionalParams = {};
         console.log('i reached here ' + body.content);
         this.apigClient.chatbotPost(params, body, additionalParams)
           .then(
             res => this.messages.push(new ChatMessage(res.data, 'received')),
           ).catch(
             err => { console.log(err); }
           );
      });
  }



}
