import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-dialog',
  standalone: false,
  templateUrl: './chat-dialog.component.html',
  styleUrl: './chat-dialog.component.css'
})
export class ChatDialogComponent {
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
