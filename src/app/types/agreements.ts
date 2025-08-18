// types/agreements.ts

export interface AgreementType {
  id: string;
  renterName: string;
  renterAvatar?: string;
  requestDate: string; // ISO string
  status: 'pending' | 'accepted' | 'rejected';
  ownerName?: string;
  ownerAvatar?: string;
  signedByOwner?: boolean;
  signedByRenter?: boolean;
  signatureOwner?: string; // base64 или url
  signatureRenter?: string; // base64 или url
  pdfUrl?: string; // ссылка на сгенерированный PDF
}
