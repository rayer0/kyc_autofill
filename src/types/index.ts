export type CaseType = "individual" | "corporate";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IndividualProfile {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  address: Address;
}

export interface CorporateProfile {
  companyName: string;
  registrationNumber: string;
  incorporationDate: string;
  countryOfIncorporation: string;
  registeredAddress: string;
  directors: string[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl: string;
  file: File;
}

export interface CaseState {
  caseType: CaseType;
  individualData: IndividualProfile;
  corporateData: CorporateProfile;
  uploadedFiles: UploadedFile[];
  apiKey?: string;
  status: "idle" | "processing" | "ready";
  error?: string;
}
