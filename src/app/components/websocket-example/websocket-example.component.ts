import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, merge, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  scan,
  startWith,
  takeUntil,
  combineLatestWith,
  filter
} from 'rxjs/operators';
import { WebsocketService } from '../../services/websocket.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-websocket-example',
  standalone: false,
  templateUrl: './websocket-example.component.html',
  styleUrl: './websocket-example.component.css'
})
export class WebsocketExampleComponent implements OnDestroy, AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  // Ô nhập chat & ô nhập keyword lọc
  chatControl = new FormControl('');
  keywordControl = new FormControl('');

  // Subject phát ra khi gửi tin nhắn của mình
  private outgoing$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Danh sách tin nhắn đã tích luỹ (Me: ..., Server: ...)
  allMessages$: Observable<string[]>;

  // Danh sách sau khi lọc theo keyword
  filteredMessages$: Observable<string[]>;

  constructor(private ws: WebsocketService) {
    // Stream tin nhắn từ server
    const incoming$ = this.ws.onMessage().pipe(
      map(txt => `Server: ${txt}`)
    );

    // Stream tin nhắn mình gửi (để hiển thị ngay trong UI)
    const mine$ = this.outgoing$.pipe(
      map(txt => `Me: ${txt}`)
    );

    // Gộp 2 luồng message và tích luỹ thành mảng (append)
    this.allMessages$ = merge(mine$, incoming$).pipe(
      scan((acc: string[], curr: string) => [...acc, curr], []) // scan: tích luỹ kết quả (acc) để tạo danh sách append.
    );

    // Keyword + debounce
    const keyword$ = this.keywordControl.valueChanges.pipe(
      map(v => (v ?? '').toString().trim().toLowerCase()),
      debounceTime(250),
      distinctUntilChanged(),
      startWith('') // để lúc đầu hiển thị tất cả
    );

    // Lọc theo keyword (realtime)
    this.filteredMessages$ = this.allMessages$.pipe(
      combineLatestWith(keyword$),
      map(([list, kw]) =>
        kw ? list.filter(line => line.toLowerCase().includes(kw)) : list
      ),
      takeUntil(this.destroy$)
    );
  }

  ngAfterViewInit() {
    // Auto-scroll xuống cuối mỗi khi có dữ liệu mới
    this.filteredMessages$.subscribe(list => {
      if (list && list.length) {
        // Scroll đến cuối danh sách
        this.viewport.scrollToIndex(list.length - 1, 'smooth');
        // Nếu muốn chỉ auto-scroll khi user đang ở cuối (giống chat Telegram/Slack), ta kiểm tra:
        // const atBottom =
        //   this.viewport.measureScrollOffset('bottom') < 50; // cách bottom < 50px
        // if (atBottom) {
        //   this.viewport.scrollToIndex(list.length - 1, 'smooth');
        // }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.ws.close();
  }

  send() {
    const txt = (this.chatControl.value ?? '').toString();
    if (!txt.trim()) return;
    this.ws.sendMessage(txt);
    this.outgoing$.next(txt);   // hiển thị ngay “Me: …”
    this.chatControl.setValue('');
  }
}
