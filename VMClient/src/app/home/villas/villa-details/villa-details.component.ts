import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VillaService } from '../../../services/villa.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-villa-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './villa-details.component.html',
  styleUrl: './villa-details.component.scss'
})
export class VillaDetailsComponent implements OnInit {

  villa: any = null;
  errorMessage: string = '';
  mapUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private villaService: VillaService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    // 🔥 STEP 1: GET ID FROM URL
    const id = this.route.snapshot.paramMap.get('id');

    console.log("ROUTE ID:", id);

    if (!id) {
      this.errorMessage = 'Invalid Villa ID';
      return;
    }

    // 🔥 STEP 2: CALL BACKEND API
    this.villaService.getVillaById(+id).subscribe({

      next: (data: any) => {

        console.log("API DATA:", data);

        // 🔥 STEP 3: MAP BACKEND DATA TO FRONTEND
        this.villa = {
          id: data.id,
          title: data.title,
          location: data.location,
          guests: data.guests,
          price: data.price,
          rating: data.rating,

          // ✅ IMAGE FIX
          image: data.image
            ? (data.image.startsWith('http')
                ? data.image
                : `http://127.0.0.1:8000${data.image}`)
            : null,

          // ✅ AMENITIES (dynamic mapping)
          amenities: (data.amenities || []).map((item: string) => ({
            label: item,
            icon:
              item.toLowerCase().includes('wifi') ? 'fa-solid fa-wifi' :
              item.toLowerCase().includes('pool') ? 'fa-solid fa-water' :
              item.toLowerCase().includes('ac') ? 'fa-solid fa-snowflake' :
              item.toLowerCase().includes('mountain') ? 'fa-solid fa-mountain' :
              'fa-solid fa-check'
          }))
        };

        // 🔥 STEP 4: GENERATE GOOGLE MAP FROM LOCATION
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.google.com/maps?q=${data.location}&output=embed`
        );
      },

      error: (err: any) => {
        console.error("ERROR:", err);
        this.errorMessage = 'Villa details not available';
      }

    });
  }
}
