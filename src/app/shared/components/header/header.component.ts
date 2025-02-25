import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../service/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateDocumentComponent } from '../create-document/create-document.component';
import { filter } from 'rxjs';
import { DocumentsService } from '../../../service/documents.service';
import { IUser } from '../../interfaces/interfaces';
import { UserService } from '../../service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userService = inject(UserService);
  documentService = inject(DocumentsService);
  storageService = inject(StorageService);
  router = inject(Router);
  dialog = inject(MatDialog);
  destroyRef = inject(DestroyRef);
  currentUser = signal<IUser | null>(null);

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data: IUser) => {
        this.currentUser.set(data);
      });

  }

  logout() {
    this.storageService.removeFromLocalStore('access_token');
    this.router.navigate(['/login']);
  }

  addDocument(): void {
    this.dialog
      .open(CreateDocumentComponent, {
        width: 'calc(100% - 30px)',
        maxWidth: '400px',
      })
      .afterClosed()
      .pipe(
        filter((data: any) => !!data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.documentService.createDocument(data).subscribe(() => {
          window.location.reload();
        })
      });
  }


}
