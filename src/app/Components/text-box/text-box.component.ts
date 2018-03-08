import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ChatMessage} from '../../Models/ChatMessage.model';
import {DataService} from '../../Services/data.service';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.css'],
})
export class TextBoxComponent implements OnInit {
  content = '';
  messages: ChatMessage[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  sendMessage() {
    if (this.content !== '') {
      this.dataService.sendMessage(this.content);
      this.content = '';
    }
  }
}
