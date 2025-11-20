import { create } from "zustand";
import { v4 as uuid } from "uuid";
import {
  CaseState,
  CaseType,
  CorporateProfile,
  IndividualProfile,
  UploadedFile,
} from "../types";

const emptyIndividual: IndividualProfile = {
  fullName: "",
  dateOfBirth: "",
  nationality: "",
  passportNumber: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
};

const emptyCorporate: CorporateProfile = {
  companyName: "",
  registrationNumber: "",
  incorporationDate: "",
  countryOfIncorporation: "",
  registeredAddress: "",
  directors: [""],
};

interface Actions {
  setCaseType: (type: CaseType) => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  setIndividualData: (data: Partial<IndividualProfile>) => void;
  setCorporateData: (data: Partial<CorporateProfile>) => void;
  setStatus: (status: CaseState["status"], error?: string) => void;
  setApiKey: (key?: string) => void;
  reset: () => void;
}

const loadApiKey = () => localStorage.getItem("openai-api-key") || undefined;

export const useKYCStore = create<CaseState & Actions>((set, get) => ({
  caseType: "individual",
  individualData: emptyIndividual,
  corporateData: emptyCorporate,
  uploadedFiles: [],
  apiKey: loadApiKey(),
  status: "idle",
  error: undefined,
  setCaseType: (type) => set({ caseType: type }),
  addFiles: (files) =>
    set((state) => ({
      uploadedFiles: [
        ...state.uploadedFiles,
        ...files.map((file) => ({
          id: uuid(),
          name: file.name,
          type: file.type,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
          file,
        })),
      ],
    })),
  removeFile: (id) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
    })),
  setIndividualData: (data) =>
    set((state) => ({
      individualData: { ...state.individualData, ...data },
    })),
  setCorporateData: (data) =>
    set((state) => ({
      corporateData: { ...state.corporateData, ...data },
    })),
  setStatus: (status, error) => set({ status, error }),
  setApiKey: (key) => {
    if (key) {
      localStorage.setItem("openai-api-key", key);
    } else {
      localStorage.removeItem("openai-api-key");
    }
    set({ apiKey: key });
  },
  reset: () => set({
    individualData: emptyIndividual,
    corporateData: emptyCorporate,
    uploadedFiles: [],
    status: "idle",
    error: undefined,
  }),
}));
