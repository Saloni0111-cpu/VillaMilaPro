import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../models/blog.model';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss'
})
export class BlogDetailsComponent implements OnInit {
  blogId!: number;
  blog!: Blog;
  loading = true;  // ← this was missing

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.blogId = Number(params['id']);
      this.http.get<Blog>(`http://127.0.0.1:8000/api/blogs/${this.blogId}/`)
        .subscribe({
          next: (data) => {
            this.blog = data;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
    });
  }
}
