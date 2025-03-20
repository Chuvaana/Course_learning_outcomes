import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MaterialService } from '../../../../../services/materialService';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss'
})
export class MaterialsComponent {
  materialsForm: FormGroup;

  constructor(private fb: FormBuilder, private service: MaterialService) {
    this.materialsForm = this.fb.group({
      lessonCode: ['yuyu', Validators.required],
      mainBooks: this.fb.array([]),
      extraMaterials: this.fb.array([]),
      webLinks: ['', Validators.required],
      libraryLink: ['', Validators.required],
      softwareTools: this.fb.array([]),
    });

    this.addMainBook();
    this.addExtraMaterial();
    this.addSoftwareTool();
  }

  get mainBooks() {
    return this.materialsForm.get('mainBooks') as FormArray;
  }

  get extraMaterials() {
    return this.materialsForm.get('extraMaterials') as FormArray;
  }

  get softwareTools() {
    return this.materialsForm.get('softwareTools') as FormArray;
  }

  addMainBook() {
    this.mainBooks.push(this.fb.control('', Validators.required));
  }

  removeMainBook(index: number) {
    this.mainBooks.removeAt(index);
  }

  addExtraMaterial() {
    this.extraMaterials.push(this.fb.control('', Validators.required));
  }

  removeExtraMaterial(index: number) {
    this.extraMaterials.removeAt(index);
  }

  addSoftwareTool() {
    this.softwareTools.push(this.fb.control('', Validators.required));
  }

  removeSoftwareTool(index: number) {
    this.softwareTools.removeAt(index);
  }

  onSubmit() {
    console.log(this.materialsForm.value);
    const formData = {
      lessonCode: this.materialsForm.value.lessonCode,
      mainBooks: this.mainBooks.value.filter((book: string) => book.trim() !== ''), // Remove empty values
      extraMaterials: this.extraMaterials.value.filter((material: string) => material.trim() !== ''),
      webLinks: this.materialsForm.value.webLinks,
      libraryLink: this.materialsForm.value.libraryLink,
      softwareTools: this.softwareTools.value.filter((tool: string) => tool.trim() !== '')
    };
  
    console.log('Submitting:', formData);
  
    this.service.addMaterials(formData).subscribe((res: any) => {
      console.log(res);
    })
  }
}
