import { Component, Input } from '@angular/core';
import { Blog } from '../models/blog.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent {
  @Input() blog!: Blog;

  get fullImageUrl(): string {
    // title_image_url is the absolute URL from Django serializer
    if (this.blog?.title_image_url) {
      return this.blog.title_image_url;
    }
    return '';
  }
}