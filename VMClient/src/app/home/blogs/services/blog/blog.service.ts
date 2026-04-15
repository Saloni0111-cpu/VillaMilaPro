import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Blog } from '../../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private API_URL = 'http://127.0.0.1:8000/api/blogs/';

  constructor(private http: HttpClient) {}

  getBlogs() {
    return this.http.get<any>(this.API_URL).pipe(
      map(res => (res.results ? res.results : res) as Blog[])
    );
  }
}