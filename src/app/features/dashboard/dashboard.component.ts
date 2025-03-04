import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, computed, DestroyRef, effect, inject, signal, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DocumentsService } from '../../service/documents.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../shared/service/user.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { DocumentStatus, documentStatuses } from '../../shared/const/document-status.const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { UserRole } from '../../shared/const/status-user.const';
import { IResponse, IUser } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatAutocompleteModule, MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule, HeaderComponent, MatSelectModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit {
  private userService = inject(UserService);
  private documentsService = inject(DocumentsService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public statusesDocuments = signal(documentStatuses);
  public filteredUsers = signal<IUser[]>([]);
  public currentUser = signal<IUser | null>(null);
  private destroyRef = inject(DestroyRef);
  public isLoading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dataSource = new MatTableDataSource([]);
  public displayedColumns = ['name', 'creator', 'status', 'updatedAt', 'settings']
  public resultsLength: number = 0;
  public paginatorPage: number = 0;
  public paginatorPageSize: number = 10;

  isReviewer = computed(() => {
    return this.currentUser()?.role === UserRole.REVIEWER;
  })

  constructor() {
    this.initState();
    this.changeForm();
    this.getDocumentsFilter(false);
  }

  public form: FormGroup = this.fb.group({
    status: [null],
    creatorId: [null],
    creatorEmail: [null],
  });
  changeForm(): void {
    effect(() => {
      this.form.valueChanges.pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.getDocumentsFilter(true));
    });
  }
  initState(): void {
    effect(() => {
      this.userService.getUser().pipe(
        tap((data: IUser) => {
          this.currentUser.set(data);
          if (!this.isReviewer()) {
            this.displayedColumns = this.displayedColumns.filter(column => column !== 'creator')
          }
        }),
        filter(() => this.isReviewer()),
        switchMap(() => this.userService.getUsersList()),
        map((users: IResponse) => users.results),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((filteredUsers: IUser[]) => {
        this.filteredUsers.set(filteredUsers);
        this.statusesDocuments.set(this.statusesDocuments().filter(status => status.value !== DocumentStatus.DRAFT));
        this.isLoading.set(false);
      });

    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.paginator.page.subscribe((event: PageEvent) => {
      this.isLoading.set(true);
      this.paginatorPage = event.pageIndex;
      this.paginatorPageSize = event.pageSize;
      this.getDocumentsFilter();
    });
  }

  getDocumentsFilter(formChanges = false): void {
    let params = {
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
        this.resultsLength = data.count;
        this.isLoading.set(false);
      });
  }

  navigateToDocument(id: string): void {
    this.router.navigate(['/document', id]);
  }

  displayUserName(user?: IUser): string {
    return user ? user.fullName : '';
  }

}
