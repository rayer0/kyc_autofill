import { CaseType, CorporateProfile, IndividualProfile } from "../types";

const SYSTEM_PROMPT = `You are a KYC OCR expert. Read the provided document preview (image or the first page of a PDF that has been converted to an image) and return ONLY the JSON fields requested. If information is missing, use an empty string. Dates must be formatted as YYYY-MM-DD.`;

const INDIVIDUAL_SCHEMA = {
  fullName: "string",
  dateOfBirth: "YYYY-MM-DD",
  nationality: "string",
  passportNumber: "string",
  address: {
    street: "string",
    city: "string",
    state: "string",
    zipCode: "string",
    country: "string",
  },
};

const CORPORATE_SCHEMA = {
  companyName: "string",
  registrationNumber: "string",
  incorporationDate: "YYYY-MM-DD",
  countryOfIncorporation: "string",
  registeredAddress: "string",
  directors: ["string"],
};

const buildUserPrompt = (type: CaseType) => {
  const schema = type === "individual" ? INDIVIDUAL_SCHEMA : CORPORATE_SCHEMA;
  return `Extract the following JSON schema for a ${
    type === "individual" ? "personal" : "corporate"
  } KYC profile. Return only valid JSON matching the schema.\nSchema:\n${JSON.stringify(schema, null, 2)}`;
};

export interface AnalyzeResult {
  individual?: Partial<IndividualProfile>;
  corporate?: Partial<CorporateProfile>;
}

export async function analyzeDocuments(
  base64Images: string[],
  caseType: CaseType,
  apiKey?: string
): Promise<AnalyzeResult> {
  if (!apiKey) {
    throw new Error("An OpenAI API key is required to analyze documents.");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(caseType) },
    ...base64Images.map((image) => ({
      role: "user" as const,
      content: [
        {
          type: "input_text",
          text: "Document snapshot for extraction",
        },
        {
          type: "input_image",
          image_url: `data:image/png;base64,${image}`,
        },
      ],
    })),
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = content ? JSON.parse(content) : {};

  return caseType === "individual"
    ? { individual: parsed as Partial<IndividualProfile> }
    : { corporate: parsed as Partial<CorporateProfile> };
}

export async function fileToBase64(file: File): Promise<string> {
  const reader = new FileReader();
  const result = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return result;
}
