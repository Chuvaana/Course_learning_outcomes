import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CLOService } from '../../../../../../../services/cloService';

@Component({
  selector: 'app-schedule',
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  customers!: any;

  constructor(private cloService: CLOService) {}

  ngOnInit() {
    // this.cloService.getPointPlan().subscribe((data) => {
    //   this.customers = data;
    // });

    this.customers = [
      { week: 1, title: 'John Doe', time: 30, type: 'ALEC' },
      { week: 2, title: 'John Doe', time: 30, type: 'ALEC' },
      { week: 3, title: 'John Doe', time: 30, type: 'ALEC' },
      { week: 4, title: 'John Doe', time: 30, type: 'ALEC' },
      { week: 5, title: 'John Doe', time: 30, type: 'CLAB' },
      { week: 6, title: 'John Doe', time: 30, type: 'CLAB' },
      { week: 7, title: 'John Doe', time: 30, type: 'CLAB' },
      { week: 8, title: 'John Doe', time: 30, type: 'CLAB' },
      { week: 9, title: 'John Doe', time: 30, type: 'BSEM' },
      { week: 10, title: 'John Doe', time: 30, type: 'BSEM' },
      { week: 11, title: 'John Doe', time: 30, type: 'BSEM' },
      { week: 12, title: 'John Doe', time: 30, type: 'BSEM' },
    ];
  }

  calculateCustomerTotal(name: string) {
    let total = 0;

    if (this.customers) {
      for (let customer of this.customers) {
        if (customer.representative?.name === name) {
          total++;
        }
      }
    }

    return total;
  }

  // getSeverity(status: string) {
  //   switch (status) {
  //     case 'unqualified':
  //       return 'danger';

  //     case 'qualified':
  //       return 'success';

  //     case 'new':
  //       return 'info';

  //     case 'negotiation':
  //       return 'warn';

  //     case 'renewal':
  //       return null;
  //   }
  // }
}
