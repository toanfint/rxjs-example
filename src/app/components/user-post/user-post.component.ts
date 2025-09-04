import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-post',
  standalone: false,
  templateUrl: './user-post.component.html',
  styleUrl: './user-post.component.css'
})
export class UserPostComponent implements OnInit {
  posts: any[] = [];
  postsConcatMap: any[] = [];

  totalPosts?: number;
  progress: number[] = [];

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
    // Các bài báo của 3 user có mã là 1, 2, 3
    const userIds = [1, 2, 3];

    this.userService.getPostsByUsers(userIds).subscribe(posts => {
      this.posts = posts;
    });

    this.userService.getPostsByUsersConcatMap(userIds).subscribe(posts => {
      this.postsConcatMap = posts;
    });

    // from(userIds).pipe(
    //   mergeMap(id =>
    //     this.http.get<any[]>(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
    //   )
    // ).subscribe(posts => {
    //   // mergeMap sẽ gộp kết quả từng API call vào cùng 1 stream
    //   this.posts.push(...posts);
    // });

    // reduce → chỉ có kết quả cuối cùng
    this.userService.getTotalPosts().subscribe(result => {
      this.totalPosts = result;
    });

    // scan → thấy tiến trình cộng dồn
    this.userService.getPostsProgress().subscribe(count => {
      this.progress.push(count);
    });
  }
}
