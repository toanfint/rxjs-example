import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<string[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor() {
    // Ví dụ với public echo server
    this.socket$ = webSocket('wss://ws.postman-echo.com/raw');

    // Nhận message từ server
    this.socket$.subscribe((msg) => {
      const current = this.messagesSubject.value;
      this.messagesSubject.next([...current, `👤 Server: ${msg}`]);
    });
  }

  sendMessage(msg: string) {
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, `🧑 You: ${msg}`]);

    this.socket$.next(msg); // gửi đi
  }
}