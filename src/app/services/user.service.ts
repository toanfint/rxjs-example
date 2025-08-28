import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  iif,
  map,
  switchMap,
  Observable
} from 'rxjs';

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
}
