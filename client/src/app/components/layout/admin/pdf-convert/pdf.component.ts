import { Component } from '@angular/core';
import { PdfGeneratorService } from '../../../../services/pdf-generator.service';

@Component({
  selector: 'pdf-root',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent {

  body = [
    ['qw', 'Age', 'Country', 'Country'],
    ['as', '30', 'USA', 'Country'],
    ['sd', '28', 'Canada', 'Country']
  ];

  constructor(private pdfService: PdfGeneratorService) {}

  createPdf() {
    console.log(this.body);
    this.pdfService.generatePdfTest(this.body);
  }
}
