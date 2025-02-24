import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { documentStatuses } from '../../const/document-status.const';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-view-or-edit',
  imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, RouterModule, MatSelectModule],
  templateUrl: './view-or-edit.component.html',
  styleUrl: './view-or-edit.component.scss',
  standalone: true
})
export class ViewOrEditComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  documentService = inject(DocumentsService);
  storageService = inject(StorageService);

  private fb = inject(FormBuilder);
  router = inject(Router);
  private destroy$ = new Subject<void>();
  public statusesDocuments = documentStatuses;

  documentId!: string;
  document!: any;
  public currentUser: any;

  get nameFC(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get statusFC(): FormControl {
    return this.form.get('status') as FormControl;
  }

  get isReviewerUser(): boolean {
    return this.currentUser?.role === 'REVIEWER';
  }

  isFormInvalid(): boolean {
    return this.isReviewerUser ? this.statusFC.invalid : this.nameFC.invalid;
  }

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit(): void {
    this.currentUser = this.storageService.getFromLocalStore('user');
    this.initStatuses();

    this.activatedRoute.paramMap.subscribe((params) => {
      this.documentId = params.get('id') || '';
      if (this.documentId) this.loadDocumentData();
    });
  }

  loadDocumentData() {
    this.documentService.getDocument(this.documentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (!this.isReviewerUser) {
          this.nameFC.patchValue(data.name)
        }
        this.document = data;
        this.loadDocument();
      });
  }


  initStatuses(): void {
    const valuesToSelect = ['UNDER_REVIEW', 'APPROVED', 'DECLINED'];
    this.statusesDocuments = this.statusesDocuments.filter(value => valuesToSelect.includes(value.value));
  }

  loadDocument() {
    PSPDFKit.load({
      baseUrl: location.protocol + "//" + location.host + "/assets/",
      document: this.document.fileUrl,
      container: "#pspdfkit-container",

    }).then(instance => {
      (window as any).instance = instance;
    });
  }
  submit() {
    const updateData = this.isReviewerUser
      ? this.statusFC.value
      : this.nameFC.value;

    const updateRequest = this.isReviewerUser
      ? this.documentService.updateDocumentStatus(this.documentId, updateData)
      : this.documentService.updateDocument(this.documentId, updateData);

    updateRequest.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.router.navigate(['/dashboard']),
    });
  }

  handleDocumentAction(action: 'remove' | 'revoke') {
    const messages = {
      remove: 'Are you sure you want to delete this document?',
      revoke: 'Are you sure you want to revoke this document?'
    };

    if (!confirm(messages[action])) return;

    const request$ = action === 'remove'
      ? this.documentService.removeDocument(this.document.id)
      : this.documentService.revokeDocument(this.document.id);

    request$.subscribe(() => this.router.navigate(['/dashboard']));
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
