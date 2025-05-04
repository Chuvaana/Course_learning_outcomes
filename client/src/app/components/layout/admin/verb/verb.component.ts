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
  editingRowId: number | null = null;
  index!: number;
  clonedConfig!: any;

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
    this.service.getVerbs().subscribe((res : any) => {
      // console.log(res);
      this.items = res;
    },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Алдаа гарлаа: ' + err.message,
        });
      });
  }

  loadBranches(): void {
    this.configService.getBranches().subscribe((data: any[]) => {
      // Add "All" option at the beginning
      this.branches = [
        { name: 'Бүгд', id: 'all' }, // This will be your "All" option
        ...data.map((branch) => ({
          name: branch.name,
          id: branch.id || branch.name,
        })),
      ];
    });
  }

  onBranchChange(branch: any): void {
    if (branch.id == 'all') {
      this.departments = [
        { name: 'Бүгд', id: 'all' }, // This will be your "All" option
      ];
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

  onRowEditInit(config: any, index: number) {
    this.index = index + 1;
    this.editingRowId = config.id;
  }
  onRowDelete(config: any, index: number) {
    console.log(config + " - " + index);
    if (index > -1) {
      this.service.deleteVerbs(config._id).subscribe(() =>{
        this.items.splice(index, 1);
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай устгалаа!',
        });
      },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Устгахад алдаа гарлаа: ' + err.message,
        });
      })
    }
    // this.index = index + 1;
    // this.editingRowId = config.id;
  }

  onRowEditCancel(config: any, index: number) {
    this.items[index] = { ...this.clonedConfig[config.id] };
    delete this.clonedConfig[config.id];
    this.editingRowId = null;
  }

  onRowEditSave(data: any) {
    if (data._id === null || data._id === undefined) {
      this.service.addVerb(data).subscribe(
        (res: any) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service.updateVerb(data._id, data).subscribe(
        (res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'data updated successfully!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Failed to update config: ' + err.message,
          });
        }
      );
    }
    this.editingRowId = null;
  }

  // On form submit
  onSubmit(): void {
    if (this.verbForm.valid) {
      const config = this.verbForm.value;
      const cleanedData = {
        ...config,
        department: config.department.id,
        branchId: config.branchId.id,
      };
      this.configService.submitConfig(cleanedData).subscribe(
        (response: any) => {
          console.log('Form submitted successfully', response);
          alert('Configuration added successfully!');
          this.readData();
        },
        (error: any) => {
          console.error('Error submitting form', error);
          alert('An error occurred while submitting the form.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  saveItem(item: any) {
    console.log('Saved item:', item);
    // Save the item after editing
  }

  save() {
    this.items.map((e) => {
      this.service.addVerb(e).subscribe((i) => {
        console.log(i);
      })
    })

  }

  addColumn() {
    const addData = {
      verbCode: '2',
      verbName: 'NAME',
    };
    this.items.push(addData);
  }
}
