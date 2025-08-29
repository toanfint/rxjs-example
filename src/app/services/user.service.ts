import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  iif,
  map,
  switchMap,
  Observable,
  from,
  mergeMap,
  concatMap,
  toArray
} from 'rxjs';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId$ = new BehaviorSubject<number>(1);
  private domain = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  /** 1. combineLatest: Users + Posts */
  getUsersAndPosts() {
    const users$ = this.http.get<any[]>(`${this.domain}/users`);
    const posts$ = this.http.get<any[]>(`${this.domain}/posts`);

    return combineLatest([users$, posts$]).pipe(
      map(([users, posts]) =>
        posts.map(post => ({
          ...post,
          userName: users.find(u => u.id === post.userId)?.name,
        }))
      )
    );
  }

  /** 2. iif: Chọn API theo điều kiện */
  getConditionalData(userId: number) {
    return iif(
      () => userId > 5,
      this.http.get<any[]>(`${this.domain}/albums?userId=${userId}`),
      this.http.get<any[]>(`${this.domain}/todos?userId=${userId}`)
    );
  }

  /** 3. switchMap: Todos theo userId (hủy request cũ nếu đổi nhanh) */
  getTodosByUser() {
    return this.userId$.pipe(
      switchMap(id =>
        this.http.get<any[]>(`${this.domain}/todos?userId=${id}`)
      )
    );
  }

  setUserId(id: number) {
    this.userId$.next(id);
  }

  searchUsers(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(
      `https://jsonplaceholder.typicode.com/users?name_like=${keyword}`
    );
  }

  searchUsersPages(keyword: string, page: number, limit: number): Observable<any[]> {
    return this.http.get<any[]>(
      `https://jsonplaceholder.typicode.com/users?name_like=${keyword}&_page=${page}&_limit=${limit}`
    );
  }

  searchPosts(keyword: string, page: number, limit: number): Observable<any[]> {
    return this.http.get<any[]>(
      `https://jsonplaceholder.typicode.com/posts?q=${keyword}&_page=${page}&_limit=${limit}`
    );
  }

  // Lấy toàn bộ posts của nhiều userIds sử dụng from và mergeMap
  getPostsByUsers(userIds: number[]): Observable<any[]> {
    return from(userIds).pipe(
      mergeMap(id => this.http.get<any[]>(`${this.domain}/posts?userId=${id}`)),
      // gộp tất cả thành 1 mảng duy nhất
      mergeMap(posts => from(posts)),
      toArray()
    );
  }

  getPostsByUsersConcatMap(userIds: number[]): Observable<any[]> {
    return from(userIds).pipe(
      concatMap(id => this.http.get<any[]>(`${this.domain}/posts?userId=${id}`)),
      // gộp tất cả thành 1 mảng duy nhất
      concatMap(posts => from(posts)),
      toArray()
    );
  }
}
