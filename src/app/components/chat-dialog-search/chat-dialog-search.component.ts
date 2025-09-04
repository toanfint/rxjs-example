import { Component } from '@angular/core';
//npm install @angular/animations (trong app.module.ts import BrowserAnimationsModule)
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chat-dialog-search',
  standalone: false,
  templateUrl: './chat-dialog-search.component.html',
  styleUrl: './chat-dialog-search.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(50px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ChatDialogSearchComponent {
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
