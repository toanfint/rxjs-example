import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    // VD: server echo miễn phí wss://ws.ifelse.io
    // Echo server công khai. Có thể dùng ws.ifelse.io hoặc echo.websocket.events
    this.socket$ = webSocket<string>({
      url: 'wss://ws.ifelse.io',
      // ❗ Nhận raw text, KHÔNG parse JSON
      deserializer: e => e.data as string,
      // ❗ Gửi raw text
      serializer: value => value
    });
  }

  // Gửi message lên server
  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  // Nhận message từ server
  onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Đóng kết nối
  close() {
    this.socket$.complete();
  }
}
