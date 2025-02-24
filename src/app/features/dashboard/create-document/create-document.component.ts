import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { documentStatuses } from '../../../shared/const/document-status.const';

@Component({
  selector: 'app-create-document',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatCardModule, MatSelectModule, RouterModule],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
  standalone: true
})
export class CreateDocumentComponent {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  dialogRef = inject(MatDialogRef);
  selectedFile: File | null = null
  public statuses = documentStatuses;

  get nameFC(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get statusFC(): FormControl {
    return this.form.get('status') as FormControl;
  }

  public form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.initStatuses();
  }

  initStatuses(): void {
    const valuesToSelect = ['DRAFT', 'READY_FOR_REVIEW'];
    this.statuses = this.statuses.filter(value => valuesToSelect.includes(value.value));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  public onSubmit(form: any): void {
    if (form.valid) {
      this.dialogRef.close({
        ...form.value,
        file: this.selectedFile
      });
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
