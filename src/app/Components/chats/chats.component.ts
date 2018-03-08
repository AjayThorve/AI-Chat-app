import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from '../../Models/ChatMessage.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  @Input() messages: ChatMessage;
  constructor() { }

  ngOnInit() {
  }


}
