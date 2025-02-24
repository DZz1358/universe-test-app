import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../shared/service/storage.service';
import { DashboardService } from '../../service/dashboard.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../shared/service/user.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { documentStatuses } from '../../shared/const/document-status.const';

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
  standalone: true
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  userService = inject(UserService);
  dashboardService = inject(DashboardService);
  storageService = inject(StorageService);
  public statusesDocuments = documentStatuses;
  public filteredUsers: IUser[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private fb = inject(FormBuilder);

  public dataSource = new MatTableDataSource([]);

  public displayedColumns = ['name', 'creator', 'status', 'updatedAt'];

  public resultsLength = 0;
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

  public form: FormGroup = this.fb.group({
    status: [null],
    creatorId: [null],
    creatorEmail: [null],
  });

  ngOnInit(): void {
    this.getDocumentsFilter(false);

    this.userService.getUsersList().subscribe((data: any) => {
      this.filteredUsers = data.results;
      console.log('getUsersList data:', data);
    });

    this.form.valueChanges.subscribe((data) => {
      console.log('data:', data);
      this.getDocumentsFilter(true);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getDocumentsFilter(formChanges = false) {
    let params: any = {
      page: this.paginator?.pageIndex ? this.paginator.pageIndex + 1 : 1,
      size: this.paginatorPageSize ? this.paginatorPageSize : 10,
    };

    if (formChanges) {
      params = {
        ...params,
        ...Object.fromEntries(
          Object.entries(this.form.value).filter(([_, v]) => v !== null && v !== undefined && v !== '')
        ),
        creatorId: this.creatorIdFC.value ? this.creatorIdFC.value.id : undefined,
      };
    }

    this.dashboardService.getDocuments(params).subscribe((data: any) => {
      this.dataSource.data = data.results;
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
