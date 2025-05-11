import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { MaterialService } from '../../../../../services/materialService';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent {
  @Input() lessonId: string = '';
  materialsForm: FormGroup;
  isNew: boolean = true;

  constructor(
    private fb: FormBuilder,
    private service: MaterialService,
    private msgService: MessageService
  ) {
    this.materialsForm = this.fb.group({
      lessonId: ['', Validators.required],
      mainBooks: this.fb.array([]),
      extraMaterials: this.fb.array([]),
      webLinks: this.fb.array([]),
      libraryLinks: this.fb.array([]),
      softwareTools: this.fb.array([]),
    });
  }

  readData(id: string) {
    this.service.getMaterials(id).subscribe(
      (res: any) => {
        if (res != null && res.length != 0) {
          this.isNew = false;
          // Patch values to the form
          this.materialsForm.patchValue({
            lessonId: res.lessonId,
          });

          // Clear the FormArray before adding the new items to avoid duplication
          this.mainBooks.clear();
          this.extraMaterials.clear();
          this.softwareTools.clear();

          // Dynamically add main books, extra materials, and software tools
          res.mainBooks.forEach((book: string) => {
            this.mainBooks.push(this.fb.control(book, Validators.required));
          });
          res.webLinks.forEach((webLink: string) => {
            this.webLinks.push(this.fb.control(webLink, Validators.required));
          });
          res.libraryLinks.forEach((libraryLink: string) => {
            this.libraryLinks.push(
              this.fb.control(libraryLink, Validators.required)
            );
          });
          res.extraMaterials.forEach((material: string) => {
            this.extraMaterials.push(
              this.fb.control(material, Validators.required)
            );
          });
          res.softwareTools.forEach((tool: string) => {
            this.softwareTools.push(this.fb.control(tool, Validators.required));
          });
        }
      },
      (err) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: err.message,
        });
      }
    );
  }

  ngOnInit() {
    if (this.lessonId) {
      this.readData(this.lessonId);
    }
  }

  get mainBooks() {
    return this.materialsForm.get('mainBooks') as FormArray;
  }

  get extraMaterials() {
    return this.materialsForm.get('extraMaterials') as FormArray;
  }

  get webLinks() {
    return this.materialsForm.get('webLinks') as FormArray;
  }

  get libraryLinks() {
    return this.materialsForm.get('libraryLinks') as FormArray;
  }

  get softwareTools() {
    return this.materialsForm.get('softwareTools') as FormArray;
  }
}
