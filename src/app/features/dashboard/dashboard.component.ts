import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../shared/service/storage.service';
import { DashboardService } from '../../service/dashboard.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true
})
export class DashboardComponent implements OnInit {
  userService = inject(UserService);
  dashboardService = inject(DashboardService);
  storageService = inject(StorageService);

  private fb = inject(FormBuilder);

  public dataSource = new MatTableDataSource([]);

  public displayedColumns = ['name', 'status', 'createdAt', 'updatedAt'];

  public resultsLength = 0;
  public paginatorPage = 0;
  public paginatorPageSize = 10;

  ngOnInit(): void {

    this.userService.getUser().subscribe((data) => {
      console.log('User data:', data);
      this.storageService.setToLocalStore('user', data);
    });

    this.dashboardService.getDocuments().subscribe((data: any) => {
      this.dataSource.data = data.results;
      console.log('Documents:', data);
    });
  }

}
