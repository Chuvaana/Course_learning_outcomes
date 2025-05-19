import { Component } from '@angular/core';
import { PdfCloGeneratorService } from '../../../../services/pdf-clo-generator.service';
import { PdfGeneratorService } from '../../../../services/pdf-generator.service';
import { PdfHeaderTitleService } from '../../../../services/pdf-header-title.service';
import { PdfMainService } from '../../../../services/pdf-main.service';

@Component({
  selector: 'pdf-root',
  templateUrl: './pdf.component.html',
  styleUrls: [],
})
export class PdfComponent {
  body = [
    ['qw', 'Age', 'Country', 'Country'],
    ['as', '30', 'USA', 'Country'],
    ['sd', '28', 'Canada', 'Country'],
  ];

  data = [
    [
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
    ],
    [
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
    ],
    [
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
    ],
  ];

  constructor(
    private pdfService: PdfGeneratorService,
    private pdfCloService: PdfCloGeneratorService,
    private pdfTitleHeaderService: PdfHeaderTitleService,
    private pdfMainService: PdfMainService
  ) {}

  createPdf() {
    console.log(this.body);
    this.pdfService.generatePdfTest(this.body);
  }
  generatePdf() {
    // this.pdfCloService.generatePdf(this.data);
  }

  mainTitle() {
    this.pdfTitleHeaderService.generatePdfAll(this.body);
  }

  PdfMainService() {
    this.pdfMainService.generatePdfAll(this.body);
  }
}
