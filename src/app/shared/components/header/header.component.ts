import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../service/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateDocumentComponent } from '../create-document/create-document.component';
import { filter, Subject, takeUntil } from 'rxjs';
import { DocumentsService } from '../../../service/documents.service';
import { RoleCheckDirective } from '../../directives/role-check.directive';


@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterModule, RoleCheckDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent implements OnDestroy {
  storageService = inject(StorageService);
  documentService = inject(DocumentsService);
  router = inject(Router);
  dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();


  logout() {
    this.storageService.removeFromLocalStore('user');
    this.storageService.removeFromLocalStore('access_token');
    this.router.navigate(['/login']);
  }

  public addDocument(): void {
    this.dialog
      .open(CreateDocumentComponent, {
        width: 'calc(100% - 30px)',
        maxWidth: '400px',
      })
      .afterClosed()
      .pipe(
        filter((data: any) => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.documentService.createDocument(data).subscribe(() => {
          window.location.reload();
        })
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
