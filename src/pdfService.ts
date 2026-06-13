import PDFDocument from 'pdfkit';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  eventId: string;
  customerName: string;
  customerAddress: string;
  customerTaxId: string;
  isCompanyInvoice: boolean;
  email: string;
  plan: string;
  total: number;
}

export function generateInvoicePdfBuffer(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // Header - Left: Invoice Info, Right: Company Info
      const formattedDate = new Date(invoiceData.date).toLocaleDateString('sl-SI');
      
      doc.fontSize(10);
      
      // Top Left
      doc.font('Helvetica-Bold').text(`Račun št.: ${invoiceData.invoiceNumber}`, 50, 50);
      doc.font('Helvetica').text(`Datum izdaje: Tržič, ${formattedDate}`, 50, 65);
      doc.text(`Datum opr. storitve: ${formattedDate}`, 50, 80);
      doc.text(`Rok plačila: Plačano ob nakupu`, 50, 95);

      // Top Right
      doc.font('Helvetica-Bold').text(`Spletna prodaja Jaka Meglic s.p.`, 300, 50, { align: 'right' });
      doc.font('Helvetica').text(`Zelenica 4`, 300, 65, { align: 'right' });
      doc.text(`4290 Tržič`, 300, 80, { align: 'right' });
      doc.text(`Davčna št.: 76794784`, 300, 95, { align: 'right' });
      doc.text(`IBAN št.: SI56040010103769716`, 300, 110, { align: 'right' });
      doc.text(`Matična št.: 9391207000`, 300, 125, { align: 'right' });

      // Divider line
      doc.moveTo(50, 160).lineTo(550, 160).strokeColor('#e5e7eb').lineWidth(1).stroke();

      // Customer Info
      doc.moveDown(4);
      doc.font('Helvetica-Bold').text(invoiceData.customerName, 50, 180);
      doc.font('Helvetica').text(invoiceData.customerAddress, 50, 195);
      if (invoiceData.isCompanyInvoice && invoiceData.customerTaxId) {
        doc.text(`ID za DDV / Davčna št.: ${invoiceData.customerTaxId}`, 50, 210);
      } else {
        doc.text(invoiceData.email, 50, 210);
      }

      // Divider line
      doc.moveTo(50, 250).lineTo(550, 250).strokeColor('#e5e7eb').stroke();

      // Table Header
      const tableTop = 270;
      doc.font('Helvetica-Bold');
      doc.text('Opis', 50, tableTop);
      doc.text('Količina', 350, tableTop, { width: 50, align: 'right' });
      doc.text('Enota', 420, tableTop, { width: 50, align: 'right' });
      doc.text('Znesek', 480, tableTop, { width: 70, align: 'right' });
      
      // Divider line
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#000000').stroke();

      // Table Row
      const rowTop = tableTop + 30;
      doc.font('Helvetica');
      doc.text(`Spletna platforma Kliksy paket: ${invoiceData.plan}`, 50, rowTop);
      doc.text(`1`, 350, rowTop, { width: 50, align: 'right' });
      doc.text(`${invoiceData.total.toFixed(2)} €`, 420, rowTop, { width: 50, align: 'right' });
      doc.text(`${invoiceData.total.toFixed(2)} €`, 480, rowTop, { width: 70, align: 'right' });
      
      // Divider line
      doc.moveTo(350, rowTop + 20).lineTo(550, rowTop + 20).strokeColor('#e5e7eb').stroke();

      // Total
      doc.font('Helvetica-Bold');
      doc.text(`Skupaj`, 400, rowTop + 30);
      doc.text(`${invoiceData.total.toFixed(2)} €`, 480, rowTop + 30, { width: 70, align: 'right' });

      doc.moveTo(350, rowTop + 50).lineTo(550, rowTop + 50).strokeColor('#000000').stroke();
      doc.text(`Za plačilo`, 400, rowTop + 60);
      doc.text(`${invoiceData.total.toFixed(2)} €`, 480, rowTop + 60, { width: 70, align: 'right' });

      // Footer Text
      doc.moveDown(4);
      doc.font('Helvetica');
      doc.text(`Račun je bil v celoti plačan preko spleta ob nakupu.`, 50, rowTop + 120);
      doc.moveDown(1);
      doc.text(`DDV ni obračunan na podlagi 1. odstavka 94. člena Zakona o davku na dodano vrednost.`, 50, doc.y);
      
      doc.moveDown(2);
      doc.text(`Elektronski podpis: Jaka Meglič s.p.`, 350, doc.y, { align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
