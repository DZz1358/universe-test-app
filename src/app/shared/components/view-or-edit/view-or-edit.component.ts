import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentsService } from '../../../service/documents.service';
import PSPDFKit from 'pspdfkit';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../service/storage.service';
import { DocumentStatus, documentStatuses } from '../../const/document-status.const';
import { MatSelectModule } from '@angular/material/select';
import { IDocument, IUser } from '../../interfaces/interfaces';
import { UserRole } from '../../const/status-user.const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-view-or-edit',
  imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, RouterModule, MatSelectModule],
  templateUrl: './view-or-edit.component.html',
  styleUrl: './view-or-edit.component.scss',
})
export class ViewOrEditComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private documentService = inject(DocumentsService);
  private storageService = inject(StorageService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  public statusesDocuments = signal(documentStatuses);
  private documentId = signal<string>('');
  public document = signal<IDocument | null>(null);
  public currentUser = signal<IUser | null>(null);

  get nameFC(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get statusFC(): FormControl {
    return this.form.get('status') as FormControl;
  }

  isReviewer = computed(() => {
    return this.currentUser()?.role === UserRole.REVIEWER;
  })

  isFormInvalid(): boolean {
    return this.isReviewer() ? this.statusFC.invalid : this.nameFC.invalid;
  }

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit(): void {
    this.initStatuses();
    this.getUser();
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.documentId.set(id);
      if (this.documentId()) this.loadDocumentData();
    });
  }

  getUser(): void {
    this.userService.getUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data: IUser) => {
        this.currentUser.set(data);
      });
  }

  loadDocumentData(): void {
    this.documentService.getDocument(this.documentId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        if (!this.isReviewer()) {
          this.nameFC.patchValue(data.name)
        }
        this.document.set(data);
        this.loadDocument();
      });
  }

  initStatuses(): void {
    const valuesToSelect: DocumentStatus[] = [
      DocumentStatus.UNDER_REVIEW,
      DocumentStatus.APPROVED,
      DocumentStatus.DECLINED
    ];

    this.statusesDocuments.set(this.statusesDocuments().filter(status =>
      valuesToSelect.includes(status.value as DocumentStatus)
    ));
  }

  loadDocument(): void {
    PSPDFKit.load({
      baseUrl: location.protocol + "//" + location.host + "/assets/",
      document: this.document()!.fileUrl,
      container: "#pspdfkit-container",

    }).then(instance => {
      (window as any).instance = instance;
    });
  }

  submit(): void {
    const updateData = this.isReviewer()
      ? this.statusFC.value
      : this.nameFC.value;

    const documentId = this.documentId();
    if (!documentId) {
      console.error('Document ID is null');
      return;
    }

    const updateRequest = this.isReviewer()
      ? this.documentService.updateDocumentStatus(documentId, updateData)
      : this.documentService.updateDocument(documentId, updateData);

    updateRequest.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/dashboard']),
    });
  }

  handleDocumentAction(action: 'remove' | 'revoke'): void {
    const messages = {
      remove: 'Are you sure you want to delete this document?',
      revoke: 'Are you sure you want to revoke this document?'
    };

    if (!confirm(messages[action])) return;

    const request$ = action === 'remove'
      ? this.documentService.removeDocument(this.document()!.id)
      : this.documentService.revokeDocument(this.document()!.id);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.router.navigate(['/dashboard']));
  }

}
