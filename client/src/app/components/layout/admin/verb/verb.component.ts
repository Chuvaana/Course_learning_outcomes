import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfigService } from '../admin.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { VerbService } from '../../../../services/verbService';

@Component({
  selector: 'app-verb',
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
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './verb.component.html',
  styleUrl: './verb.component.scss',
})
export class VerbComponent {
  verbForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];
  items: any[] = [];
  clonedConfig: { [key: string]: any } = {};

  constructor(
    private fb: FormBuilder,
    private service: VerbService,
    private configService: ConfigService,
    private msgService: MessageService
  ) {
    this.verbForm = this.fb.group({
      verbCode: ['', Validators.required],
      verbName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    this.readData();
  }

  readData() {
    this.service.getVerbs().subscribe(
      (res: any) => (this.items = res),
      (err) => this.showError('Алдаа гарлаа: ' + err.message)
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
    if (branch.id === 'all') {
      this.departments = [{ name: 'Бүгд', id: 'all' }];
    } else {
      this.configService.getDepartments(branch.id).subscribe((data: any[]) => {
        this.departments = data.map((dept) => ({
          name: dept.name,
          id: dept.id || dept.name,
        }));
      });
    }
  }

  onRowEditInit(config: any) {
    this.clonedConfig[config._id] = { ...config };
  }

  onRowEditCancel(config: any, index: number) {
    this.items[index] = this.clonedConfig[config._id];
    delete this.clonedConfig[config._id];
  }

  onRowEditSave(data: any) {
    if (!data._id) {
      this.service.addVerb(data).subscribe(
        () => this.afterSaveSuccess('Амжилттай хадгалагдлаа!'),
        (err) => this.showError('Алдаа гарлаа: ' + err.message)
      );
    } else {
      this.service.updateVerb(data._id, data).subscribe(
        () => this.afterSaveSuccess('Амжилттай шинэчлэгдлээ!'),
        (err) => this.showError('Шинэчлэхэд алдаа гарлаа: ' + err.message)
      );
    }
  }

  onRowDelete(config: any, index: number) {
    if (index > -1) {
      this.service.deleteVerbs(config._id).subscribe(
        () => {
          this.items.splice(index, 1);
          this.showSuccess('Амжилттай устгалаа!');
        },
        (err) => this.showError('Устгахад алдаа гарлаа: ' + err.message)
      );
    }
  }

  onSubmit(): void {
    if (this.verbForm.valid) {
      const config = this.verbForm.value;
      const cleanedData = {
        ...config,
        department: config.department?.id,
        branchId: config.branchId?.id,
      };
      this.configService.submitConfig(cleanedData).subscribe(
        () => {
          this.showSuccess('Амжилттай хадгалагдлаа');
          this.readData();
        },
        () => alert('An error occurred while submitting the form.')
      );
    }
  }

  addColumn() {
    this.items.push({
      verbCode: 'TEMP_' + new Date().getTime(),
      verbName: 'Шинэ үйл үг',
    });
  }

  private showError(detail: string) {
    this.msgService.add({ severity: 'error', summary: 'Алдаа', detail });
  }

  private showSuccess(detail: string) {
    this.msgService.add({ severity: 'success', summary: 'Амжилттай', detail });
  }

  private afterSaveSuccess(detail: string) {
    this.showSuccess(detail);
    this.readData();
  }
}
