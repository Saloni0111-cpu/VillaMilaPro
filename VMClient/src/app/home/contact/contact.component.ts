import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
   styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      full_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
       address: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      this.http.post('http://127.0.0.1:8000/api/contact/contact/', this.contactForm.value)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            alert("Message sent successfully!");
            this.contactForm.reset();
          },
          error: (err: any) => {
  console.log("FULL ERROR:", err);
  console.log("BACKEND ERROR:", err.error);
}
        });
      }
  }
}