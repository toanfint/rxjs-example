import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { tap, delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  posts: any[] = [];
  postsForkJoin: any[] = [];
  conditionalData: any[] = [];
  todos: any[] = [];

  loading = false;

  userId = 1;
  userIds = [1, 2, 3, 4, 5];

  constructor(private userService: UserService) { }

  ngOnInit() {
    // 1. combineLatest
    this.getUsersAndPosts();

    // 1.2 forkJoin
    this.getUsersAndPostsForForkJoin();

    // 3. switchMap
    this.userService.getTodosByUser().subscribe(data => (this.todos = data));

    // 2. iif (chạy lần đầu)
    this.loadConditional();
  }

  loadConditional() {
    this.userService.getConditionalData(this.userId).subscribe(d => (this.conditionalData = d));
  }

  changeUser(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.userService.setUserId(+value);
  }

  getUsersAndPosts() {
    this.loading = true;
    this.userService.getUsersAndPosts()
      .pipe(
        delay(1900),
        map(posts => [...posts].sort((a, b) => a.userName.localeCompare(b.userName))), //sắp xếp theo vần a, b, c
        tap(() => this.loading = false)  // tắt loading khi có kết quả
      )
      .subscribe(data => (this.posts = data));
  }

  getUsersAndPostsForForkJoin() {
    this.loading = true;
    this.userService.getUsersAndPostsforkJoin()
      .pipe(
        delay(1900),
        tap(() => this.loading = false)  // tắt loading khi có kết quả
      )
      .subscribe(data => (this.postsForkJoin = data));
  }
}
