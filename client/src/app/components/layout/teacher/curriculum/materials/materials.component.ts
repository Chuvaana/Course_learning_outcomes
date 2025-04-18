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
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MaterialService } from '../../../../../services/materialService';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
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
    } else {
      this.addMainBook();
      this.addExtraMaterial();
      this.addSoftwareTool();
      this.addWebLinks();
      this.addLibraryLinks();
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

  addWebLinks() {
    this.webLinks.push(this.fb.control('', Validators.required));
  }

  removeWebLinks(index: number) {
    this.webLinks.removeAt(index);
  }

  addLibraryLinks() {
    this.libraryLinks.push(this.fb.control('', Validators.required));
  }

  removeLibraryLinks(index: number) {
    this.libraryLinks.removeAt(index);
  }

  addSoftwareTool() {
    this.softwareTools.push(this.fb.control('', Validators.required));
  }

  removeSoftwareTool(index: number) {
    this.softwareTools.removeAt(index);
  }

  onSubmit() {
    const formData = {
      lessonId: this.lessonId,
      mainBooks: this.mainBooks.value.filter(
        (book: string) => book.trim() !== ''
      ),
      extraMaterials: this.extraMaterials.value.filter(
        (material: string) => material.trim() !== ''
      ),
      webLinks: this.webLinks.value.filter(
        (link: string) => link.trim() !== ''
      ),
      libraryLinks: this.libraryLinks.value.filter(
        (link: string) => link.trim() !== ''
      ),
      softwareTools: this.softwareTools.value.filter(
        (tool: string) => tool.trim() !== ''
      ),
    };

    const isFormEmpty =
      !formData.mainBooks.length &&
      !formData.extraMaterials.length &&
      !formData.webLinks.length &&
      !formData.libraryLinks.length &&
      !formData.softwareTools.length;

    if (isFormEmpty) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Та дор хаяж нэг мэдээлэл оруулах шаардлагатай.',
      });
      return;
    }

    if (this.isNew) {
      this.service.addMaterials(formData).subscribe(
        (res: any) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
          this.materialsForm.patchValue({
            lessonId: res.material.lessonId,
            mainBooks: res.material.mainBooks,
            extraMaterials: res.material.extraMaterials,
            webLinks: res.material.webLinks,
            libraryLinks: res.material.libraryLinks,
            softwareTools: res.material.softwareTools,
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
      this.service.updateMaterials(this.lessonId, formData).subscribe(
        (res: any) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
          this.materialsForm.patchValue({
            lessonId: res.material.lessonId,
            mainBooks: res.material.mainBooks,
            extraMaterials: res.material.extraMaterials,
            webLinks: res.material.webLinks,
            libraryLinks: res.material.libraryLinks,
            softwareTools: res.material.softwareTools,
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
    }
  }
}
