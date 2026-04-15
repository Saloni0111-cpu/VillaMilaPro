import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { Blog } from '../models/blog.model';
import { BlogService } from '../services/blog/blog.service';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, BlogCardComponent],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss'
})
export class BlogPageComponent implements OnInit {

  pageSize = 9;
  currentPage = 1;

  blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((res: Blog[]) => {
  this.blogs = res;
});
  }

  get paginatedBlogs(): Blog[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.blogs.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.blogs.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    this.currentPage = page;
  }
}