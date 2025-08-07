import { PDFDocument } from 'pdf-lib';
import { useState } from 'react';

interface PdfGeneratorProps {
  formData: {  // Данные формы (арендатор и владелец)
    renterName: string;
    renterPhone: string;
    renterEmail: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    rentalAmount: string;
    startDate: string;
    endDate: string;
    insuranceAmount: string;
  };
  signatureData: string;  // Подпись в формате base64
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ formData, signatureData }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePdf = async () => {
    // Создаем новый PDF-документ
    const pdfDoc = await PDFDocument.create();

    // Добавляем страницу
    const page = pdfDoc.addPage([600, 400]);

    // Добавляем текст на страницу
    page.drawText(`ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ`, { x: 50, y: 370, size: 18 });
    page.drawText(`Арендатор: ${formData.renterName}`, { x: 50, y: 330 });
    page.drawText(`Телефон арендатора: ${formData.renterPhone}`, { x: 50, y: 310 });
    page.drawText(`Email арендатора: ${formData.renterEmail}`, { x: 50, y: 290 });

    page.drawText(`Владелец: ${formData.ownerName}`, { x: 50, y: 260 });
    page.drawText(`Телефон владельца: ${formData.ownerPhone}`, { x: 50, y: 240 });
    page.drawText(`Email владельца: ${formData.ownerEmail}`, { x: 50, y: 220 });

    page.drawText(`Сумма аренды: ${formData.rentalAmount}`, { x: 50, y: 190 });
    page.drawText(`Дата начала аренды: ${formData.startDate}`, { x: 50, y: 170 });
    page.drawText(`Дата окончания аренды: ${formData.endDate}`, { x: 50, y: 150 });

    page.drawText(`Страховка: ${formData.insuranceAmount}`, { x: 50, y: 130 });

    // Добавляем подпись арендатора
    const signatureImage = await pdfDoc.embedPng(signatureData);
    page.drawImage(signatureImage, { x: 50, y: 60, width: 200, height: 100 });

    // Сохраняем PDF в формате base64
    const pdfBytes = await pdfDoc.save();
    const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));

    // Обновляем URL для скачивания PDF
    setPdfUrl(pdfUrl);
  };

  return (
    <div className="mt-4">
      <button onClick={generatePdf} className="w-full p-3 bg-blue-500 text-white rounded-md sm:w-auto">
        Сгенерировать и скачать PDF
      </button>

      {pdfUrl && (
        <div className="mt-4">
          <a href={pdfUrl} download="Contract.pdf" className="text-blue-600 hover:underline">
            Скачать договор
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfGenerator;
