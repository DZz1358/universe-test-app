import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent {
  storageService = inject(StorageService);
  router = inject(Router);

  logout() {
    this.storageService.removeFromLocalStore('user');
    this.storageService.removeFromLocalStore('access_token');
    this.router.navigate(['/login']);
  }
}
