import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, scan, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UserService, Post } from '../services/user.service';

@Component({
  selector: 'app-search-lazy-load3',
  standalone: false,
  templateUrl: './search-lazy-load3.component.html',
  styleUrl: './search-lazy-load3.component.css'
})
export class SearchLazyLoad3Component implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  results: Post[] = [];
  page = 1;
  limit = 15;
  keyword = '';

  private destroy$ = new Subject<void>();
  private observer?: IntersectionObserver;

  @ViewChild('anchor', { static: true }) anchor?: ElementRef<HTMLElement>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.page = 1;
        this.results = [];
      }),
      filter(q => !!q && q.trim().length > 0),
      switchMap(q => {
        this.keyword = q!.trim();
        return this.userService.searchPosts(this.keyword, this.page, this.limit).pipe(
          tap(items => (this.results = items)) // replace khi search mới
        );
      })
    );

    search$.pipe(takeUntil(this.destroy$)).subscribe();

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        this.loadMore();
      }
    });

    this.observer.observe(this.anchor!.nativeElement);
  }

  loadMore() {
    if (!this.keyword) return;

    this.page++;
    this.userService.searchPosts(this.keyword, this.page, this.limit).pipe(
      takeUntil(this.destroy$)
    ).subscribe(items => {
      this.results = [...this.results, ...items];
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.observer?.disconnect();
  }
}
