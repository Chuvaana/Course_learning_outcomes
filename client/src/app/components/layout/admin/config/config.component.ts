import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfigService } from '../admin.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  configForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];
  items: any[] = [];
  editingRowId: number | null = null;
  index!: number;
  clonedConfig!: any;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private msgService: MessageService
  ) {
    this.configForm = this.fb.group({
      branchId: ['', Validators.required],
      department: ['', Validators.required],
      name: ['', Validators.required],
      itemCode: ['', [Validators.required, Validators.minLength(3)]], // item_code validation (example)
      itemValue: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    this.readData();
  }

  readData() {
    this.configService.getConfig().subscribe((res) => {
      if (res.length != 0) {
        this.items = res;
      } else {
        this.setDefaultItems();
      }
    });
  }

  setDefaultItems() {
    this.items.push(
      {
        branchId: 'All',
        department: 'All',
        name: 'Хичээлийн эхний өдөр',
        itemCode: 'First_day_of_school',
        itemValue: '2025-02-04',
      },
      {
        branchId: 'All',
        department: 'All',
        name: 'Хичээлийн жил',
        itemCode: 'School_year',
        itemValue: '2024-2025',
      },
      {
        branchId: 'All',
        department: 'All',
        name: 'Улирал',
        itemCode: 'season',
        itemValue: 'spring',
      }
    );
  }

  loadBranches(): void {
    this.configService.getBranches().subscribe((data: any[]) => {
      this.branches = [
        { name: 'Бүгд', id: 'all' },
        ...data.map((branch) => ({
          name: branch.name,
          id: branch.id || branch.name,
        })),
      ];
    });
  }

  onBranchChange(branch: any): void {
    if (branch.id == 'all') {
      this.departments = [{ name: 'Бүгд', id: 'all' }];
    } else {
      this.configService.getDepartments(branch.id).subscribe((data: any[]) => {
        if (data) {
          this.departments = data.map((dept) => ({
            name: dept.name,
            id: dept.id || dept.name,
          }));
        }
      });
    }
  }

  onBranchChangeTable(branch: any): void {
    if (branch == 'all') {
      this.departments = [{ name: 'Бүгд', id: 'all' }];
    } else {
      this.configService.getDepartments(branch).subscribe((data: any[]) => {
        if (data) {
          this.departments = data.map((dept) => ({
            name: dept.name,
            id: dept.id || dept.name,
          }));
        }
      });
    }
  }

  getBranchName(id: string): string {
    const branch = this.branches.find((b) => b.id === id);
    this.onBranchChangeTable(id);
    return branch ? branch.name : '';
  }

  getDepartmentName(id: string): string {
    const dept = this.departments.find((d) => d.id === id);
    return dept ? dept.name : '';
  }

  onRowEditInit(config: any, index: number) {
    this.index = index;
    if (!this.clonedConfig) this.clonedConfig = {};
    this.clonedConfig[config._id] = { ...config };
    this.editingRowId = config._id;
  }

  onRowEditCancel(config: any, index: number) {
    if (this.clonedConfig && this.clonedConfig[config._id]) {
      this.items[index] = { ...this.clonedConfig[config._id] };
      delete this.clonedConfig[config._id];
    }
    this.editingRowId = null;
  }

  onRowEditSave(config: any) {
    const cleanedData = {
      ...config,
      department: config.department?.id || config.department,
      branchId: config.branchId?.id || config.branchId,
    };

    if (
      !cleanedData.department ||
      !cleanedData.branchId ||
      !cleanedData.name ||
      !cleanedData.itemCode ||
      !cleanedData.itemValue
    ) {
      this.msgService.add({
        severity: 'error',
        summary: 'Invalid Input',
        detail: 'Please fill in all fields correctly before saving.',
      });
      return;
    }

    const apiCall = config._id
      ? this.configService.updateConfig(cleanedData)
      : this.configService.submitConfig(cleanedData);

    apiCall.subscribe(
      (res: any) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: config._id ? 'Амжилттай заслаа!' : 'Амжилттай нэмлээ!',
        });
        this.readData();
      },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Алдаа гарлаа: ' + err.message,
        });
      }
    );

    this.editingRowId = null;
  }
}
