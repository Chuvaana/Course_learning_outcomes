import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-progress-poll',
  imports: [ CheckboxModule, DropdownModule, InputTextModule, IftaLabelModule, RouterModule, TieredMenuModule, ToastModule, FormsModule ],
  templateUrl: './progress-poll.component.html',
  styleUrl: './progress-poll.component.scss',
})
export class ProgressPollComponent {
  lessonId: string = '';
  items: MenuItem[] | undefined;
  value: string | undefined;

  cities: City[] | undefined;

  checked: boolean = false;
  selectedCity: City | undefined;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];
  }


}
