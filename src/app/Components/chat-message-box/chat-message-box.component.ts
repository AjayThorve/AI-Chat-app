import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../../Models/ChatMessage.model';
import { DataService } from '../../Services/data.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
declare var apigClientFactory: any;

@Component({
  selector: 'app-chat-message-box',
  templateUrl: './chat-message-box.component.html',
  styleUrls: ['./chat-message-box.component.css'],
})
export class ChatMessageBoxComponent implements OnInit {

  apigClient: any;
  messages: ChatMessage[] = [];
  constructor(private dataService: DataService, private http: HttpClient) {
    this.apigClient = apigClientFactory.newClient();
    this.messages.push(new ChatMessage('Hi user, How can I help you today?', 'received'));
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
