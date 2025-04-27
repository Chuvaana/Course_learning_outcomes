import { Component } from '@angular/core';
import { PdfGeneratorService } from '../../../../services/pdf-generator.service';
import { PdfCloGeneratorService } from '../../../../services/pdf-clo-generator.service';

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

  data = [
    ['qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country'],
    ['qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country'],
    ['qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country', 'Country','qw', 'Age', 'Country'],
  ];

  constructor(private pdfService: PdfGeneratorService, private pdfCloService : PdfCloGeneratorService) {}

  createPdf() {
    console.log(this.body);
    this.pdfService.generatePdfTest(this.body);
  }
  generatePdf(){
    // this.pdfCloService.generatePdf(this.data);

  }
}
