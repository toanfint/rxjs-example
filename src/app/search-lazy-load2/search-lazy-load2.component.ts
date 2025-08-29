import { Component, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, merge, of, filter } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, scan, startWith, tap, finalize, takeUntil, map, withLatestFrom } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Post } from '../services/user.service';

interface ResultChunk {
  items: Post[];
  reset: boolean; // true -> replace, false -> append
}

@Component({
  selector: 'app-search-lazy-load2',
  standalone: false,
  templateUrl: './search-lazy-load2.component.html',
  styleUrl: './search-lazy-load2.component.css'
})
export class SearchLazyLoad2Component {
  searchControl = new FormControl('');
  private loadMore$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  results: Post[] = [];
  loading = false;
  page = 1;
  limit = 10;          // số lượng item mỗi trang
  hasMore = true;      // true nếu còn page tiếp theo
  hasSearched = false; // true sau lần search đầu (để hiển thị "không tìm thấy")

  constructor(private searchService: UserService) { }

  ngOnInit() {
    // Stream keyword đã xử lý (trim + debounce)
    const keyword$ = this.searchControl.valueChanges.pipe(
      map(v => (v || '').toString().trim()),
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => {
        // mỗi lần user thay đổi từ khoá => reset paging state
        this.page = 1;
        this.hasMore = true;
      }),
      startWith(''), // để withLatestFrom có giá trị ban đầu
      takeUntil(this.destroy$)
    );

    // 1) search$ => phát khi user nhập từ khoá (non-empty): replace results
    const search$ = keyword$.pipe(
      // chỉ search khi có keyword (non-empty)
      filter(k => k.length > 0),
      tap(() => {
        this.loading = true;
        this.hasSearched = true;
        this.page = 1;
      }),
      switchMap(keyword =>
        this.searchService.searchPosts(keyword, this.page, this.limit).pipe(
          tap(items => {
            // nếu items < limit => không còn trang tiếp theo
            this.hasMore = items.length === this.limit;
          }),
          finalize(() => (this.loading = false))
        )
      ),
      map(items => ({ items, reset: true } as ResultChunk)),
      takeUntil(this.destroy$)
    );

    // 2) loadMore$ => phát khi scroll xuống cuối; lấy latest keyword để gọi API
    const loadMore$ = this.loadMore$.pipe(
      withLatestFrom(keyword$),
      // chỉ loadMore khi keyword không rỗng, còn page, và không đang load
      filter(([_, keyword]) => !!keyword && keyword.trim().length > 0 && this.hasMore && !this.loading),
      tap(() => {
        this.page++;       // tăng trang trước khi gọi
        this.loading = true;
      }),
      switchMap(([_, keyword]) =>
        this.searchService.searchPosts(keyword, this.page, this.limit).pipe(
          tap(items => (this.hasMore = items.length === this.limit)),
          finalize(() => (this.loading = false))
        )
      ),
      map(items => ({ items, reset: false } as ResultChunk)),
      takeUntil(this.destroy$)
    );

    // 3) nếu user xoá input (empty) thì clear results và reset state
    keyword$
      .pipe(
        filter(k => k.length === 0),
        tap(() => {
          this.results = [];
          this.hasMore = false;
          this.hasSearched = false;
          this.page = 1;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // 4) gộp search$ + loadMore$ và dùng scan để append hoặc replace
    merge(search$, loadMore$)
      .pipe(
        // scan<TAcc, TIn>((acc, curr) => ..., seed)
        scan<ResultChunk, Post[]>(
          (acc, curr) => (curr.reset ? [...curr.items] : [...acc, ...curr.items]),
          [] as Post[]
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        this.results = res;
      });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    // check bottom (nếu muốn chính xác hơn tunable offset)
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      // emit signal load more (thực tế nên throttle để tránh spam)
      this.loadMore$.next();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
