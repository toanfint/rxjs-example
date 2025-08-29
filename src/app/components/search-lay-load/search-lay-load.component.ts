import { Component, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-search-lay-load',
  standalone: false,
  templateUrl: './search-lay-load.component.html',
  styleUrl: './search-lay-load.component.css'
})
export class SearchLayLoadComponent {
  searchControl = new FormControl('');
  allResults: any[] = [];       // toàn bộ kết quả
  visibleResults: any[] = [];   // chỉ hiển thị một phần
  batchSize = 5;               // mỗi lần load 5 item
  loading = false;

  constructor(private searchService: UserService) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(keyword =>
          this.searchService.searchUsers(keyword || '')
        )
      )
      .subscribe(results => {
        this.allResults = results;
        this.visibleResults = this.allResults.slice(0, this.batchSize);
      });
  }

  // bắt sự kiện scroll (lazy load client-side)
  @HostListener('window:scroll', [])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      this.visibleResults.length < this.allResults.length
    ) {
      this.loading = true;
      setTimeout(() => {
        const nextItems = this.allResults.slice(
          this.visibleResults.length,
          this.visibleResults.length + this.batchSize
        );
        this.visibleResults = [...this.visibleResults, ...nextItems];
        this.loading = false;
      }, 500); // giả lập delay load
    }
  }
}
