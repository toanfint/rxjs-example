import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-websocket-search',
  standalone: false,
  templateUrl: './websocket-search.component.html',
  styleUrl: './websocket-search.component.css'
})
export class WebsocketSearchComponent {
  chatControl = new FormControl('');
  messages$!: Observable<string[]>;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
  }

  send() {
    const msg = this.chatControl.value?.trim();
    if (msg) {
      this.chatService.sendMessage(msg);
      this.chatControl.reset();
    }
  }
}
