import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { documentStatuses } from '../../shared/const/document-status.const';
import { RoleCheckDirective } from '../../shared/directives/role-check.directive';

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
    MatInputModule, MatIconModule, RoleCheckDirective, MatButtonModule, MatAutocompleteModule, MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule, HeaderComponent, MatSelectModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  userService = inject(UserService);
  DocumentsService = inject(DocumentsService);
  storageService = inject(StorageService);
  public statusesDocuments = documentStatuses;
  public filteredUsers: IUser[] = [];
  currentUser: any;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private fb = inject(FormBuilder);

  public dataSource = new MatTableDataSource([]);

  public displayedColumns = ['name', 'creator', 'status', 'updatedAt'];

  public resultsLength = 0;
  public paginatorPage = 1;
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

  isReviewer(user: any): boolean {
    return user?.role === 'REVIEWER';
  }

  public form: FormGroup = this.fb.group({
    status: [null],
    creatorId: [null],
    creatorEmail: [null],
  });

  ngOnInit(): void {
    this.getDocumentsFilter(false);
    this.userService.getUser().subscribe((data: any) => {
      this.currentUser = data;
      this.storageService.setToLocalStore('user', data);
    })


    if (this.isReviewer(this.currentUser)) {
      this.statusesDocuments = this.statusesDocuments.filter((status) => status.value !== 'DRAFT');
      this.userService.getUsersList().subscribe((data: any) => {
        this.filteredUsers = data.results;
      });
    }

    if (!this.isReviewer(this.currentUser)) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'creator');
    }


    this.form.valueChanges.subscribe((data) => {
      console.log('data:', data);
      this.getDocumentsFilter(true);
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.paginator.page.subscribe((event: PageEvent) => {
      console.log('Пагинация изменилась:', event);
      // this.paginatorPage = event.pageIndex;
      // this.paginatorPageSize = event.pageSize;
      // this.getDocumentsFilter();
    });
  }


  public getDocumentsFilter(formChanges = false) {
    console.log('this.paginator', this.paginator)

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

    this.DocumentsService.getDocuments(params).subscribe((data: any) => {
      this.dataSource.data = data.results;
      this.paginatorPage = this.paginator.pageIndex;
      this.resultsLength = data.count;

    });
  }



  public displayUserName(user?: any): string {
    return user ? user.fullName : '';
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }


}
