import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, DestroyRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../shared/service/storage.service';
import { DocumentsService } from '../../service/documents.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../shared/service/user.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { documentStatuses } from '../../shared/const/document-status.const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

interface IUser {
  email: string,
  fullName: string,
  id: string,
  role: string,
}
interface IDocument {
  name: string,
  status: string,
  createdAt: string,
  updatedAt: string,
  creator: IUser,
}

interface IResponse {
  results: IUser[],
  count: number,
}

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatAutocompleteModule, MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule, HeaderComponent, MatSelectModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  // standalone: true  удалить
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private documentsService = inject(DocumentsService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public statusesDocuments = signal(documentStatuses);
  public filteredUsers = signal<IUser[]>([]);
  public currentUser = signal<IUser | null>(null);
  destroyRef = inject(DestroyRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dataSource = new MatTableDataSource([]);
  public displayedColumns = ['name', 'creator', 'status', 'updatedAt', 'settings'];
  public resultsLength = signal(0);
  public paginatorPage = 0;
  public paginatorPageSize = 10;

  get creatorEmailFC(): FormControl {
    return this.form.get('creatorEmail') as FormControl;
  }
  get creatorIdFC(): FormControl {
    return this.form.get('creatorId') as FormControl;
  }

  get statusFC(): FormControl {
    return this.form.get('status') as FormControl;
  }

  get isReviewerUser(): boolean {
    return this.currentUser()?.role === 'REVIEWER';
  }

  public form: FormGroup = this.fb.group({
    status: [null],
    creatorId: [null],
    creatorEmail: [null],
  });

  ngOnInit(): void {
    this.getDocumentsFilter(false);

    this.userService.getUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.currentUser.set(data);
        this.storageService.setToLocalStore('user', data);

        if (this.isReviewerUser) {
          this.statusesDocuments.set(this.statusesDocuments().filter(status => status.value !== 'DRAFT'));
          this.getUsersList();
        } else {
          this.displayedColumns = this.displayedColumns.filter(column => column !== 'creator');
        }
      });
    this.changeForm();
  }

  changeForm() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getDocumentsFilter(true));
  }

  getUsersList() {
    this.userService.getUsersList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users: any) => {
        this.filteredUsers.set(users.results);
      });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.paginator.page.subscribe((event: PageEvent) => {
      this.paginatorPage = event.pageIndex;
      this.paginatorPageSize = event.pageSize;
      this.getDocumentsFilter();
    });
  }

  getDocumentsFilter(formChanges = false) {
    let params: any = {
      page: this.paginator?.pageIndex !== undefined ? this.paginator.pageIndex + 1 : 1,
      size: this.paginatorPageSize,
    };

    if (formChanges) {
      params = {
        ...params,
        ...Object.fromEntries(
          Object.entries(this.form.value).filter(([_, v]) => v !== null && v !== undefined && v !== '')
        ),
      };
    }

    this.documentsService.getDocuments(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.dataSource.data = data.results;
        this.paginatorPage = this.paginator.pageIndex;
        this.resultsLength.set(data.count);
      });
  }

  navigateToDocument(id: string): void {
    this.router.navigate(['/document', id]);
  }

  displayUserName(user?: IUser): string {
    return user ? user.fullName : '';
  }

}
