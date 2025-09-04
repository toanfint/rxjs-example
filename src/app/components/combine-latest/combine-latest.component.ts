import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { combineLatest, startWith, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-combine-latest',
  standalone: false,
  templateUrl: './combine-latest.component.html',
  styleUrl: './combine-latest.component.css'
})
export class CombineLatestComponent implements OnInit {
  userIdControl = new FormControl('');
  keywordControl = new FormControl('');

  posts$ = combineLatest([
    this.userIdControl.valueChanges.pipe(startWith('')),
    this.keywordControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    switchMap(([userId, keyword]) =>
      this.http.get<any[]>(`https://jsonplaceholder.typicode.com/posts`).pipe(
        map(posts =>
          posts.filter(post =>
            (!userId || post.userId == userId) &&
            (!keyword || post.title.toLowerCase().includes(keyword.toLowerCase()))
          )
        )
      )
    )
  );

  constructor(private http: HttpClient) { }
  ngOnInit() { }
}
