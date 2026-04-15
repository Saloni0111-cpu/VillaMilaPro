import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VillaService } from '../../../../services/villa.service';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports:[CommonModule,RouterModule],
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent implements OnInit {

  savedVillas: any[] = [];

  constructor(private villaService: VillaService) {}

  ngOnInit(): void {
    this.loadSavedVillas();
  }

  loadSavedVillas() {
    this.villaService.getSavedVillas().subscribe({
      next: (data) => {
        this.savedVillas = data.map((v: any) => {
          let imageUrl = v.image || '';
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            imageUrl = '/' + imageUrl;
          }
          return {
            ...v,
            image: imageUrl
          };
        });
      },
      error: (err) => console.error('Error fetching saved villas:', err)

    });
  }

  viewVilla(villa:any){
    console.log(villa);
  }

}
