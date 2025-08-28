import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  Subscription,
} from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  results: any[] = [];
  sub!: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.sub = this.searchControl.valueChanges
      .pipe(
        debounceTime(500),              // đợi 0.5s sau khi ngừng gõ
        distinctUntilChanged(),         // chỉ emit khi khác giá trị trước
        switchMap(keyword =>
          this.userService.searchUsers(keyword || '')
        )
      )
      .subscribe(data => (this.results = data));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
