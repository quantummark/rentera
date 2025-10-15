export interface GeneratePdfData {
  owner?: { fullName?: string; phone?: string }
  renter?: { fullName?: string; phone?: string }
  address?: string
  rentalStart?: string
  rentalEnd?: string
  rentAmount?: string | number
  additionalTerms?: string
  signatures?: { owner?: string; renter?: string }
}