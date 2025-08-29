import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { UserService, Post } from '../services/user.service';

@Component({
  selector: 'app-search-lazy-load4',
  standalone: false,
  templateUrl: './search-lazy-load4.component.html',
  styleUrl: './search-lazy-load4.component.css'
})
export class SearchLazyLoad4Component implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  results: Post[] = [];
  keyword = '';
  page = 1;
  limit = 20;

  private destroy$ = new Subject<void>();

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.page = 1;
          this.results = [];
        }),
        filter(q => !!q && q.trim().length > 0),
        switchMap(q => {
          this.keyword = q!.trim();
          return this.userService.searchPosts(this.keyword, this.page, this.limit);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(items => (this.results = items));
  }

  onScrolledIndexChange(index: number) {
    if (!this.keyword) return;

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    // Nếu scroll đến cuối danh sách thì load thêm
    if (end === total) {
      this.page++;
      this.userService
        .searchPosts(this.keyword, this.page, this.limit)
        .pipe(takeUntil(this.destroy$))
        .subscribe(items => {
          this.results = [...this.results, ...items];
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
