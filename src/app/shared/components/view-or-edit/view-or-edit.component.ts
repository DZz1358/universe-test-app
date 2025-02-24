import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from '../../../service/documents.service';

@Component({
  selector: 'app-view-or-edit',
  imports: [],
  templateUrl: './view-or-edit.component.html',
  styleUrl: './view-or-edit.component.scss',
  standalone: true
})
export class ViewOrEditComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  documentService = inject(DocumentsService)
  documentId!: string;


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.documentId = params.get('id') || '';
      console.log('Document ID:', params);
      if (this.documentId) {
        this.documentService.getDocument(this.documentId).subscribe((data) => {
          console.log('data', data)
        })
      }
    });
  }


  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


}
