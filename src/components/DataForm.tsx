import { useKYCStore } from "../store/useKYCStore";
import { CaseType } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface Props {
  caseType: CaseType;
}

export function DataForm({ caseType }: Props) {
  const {
    individualData,
    corporateData,
    setIndividualData,
    setCorporateData,
  } = useKYCStore();

  const data = caseType === "individual" ? individualData : corporateData;

  const handleExport = () => {
    const payload = caseType === "individual" ? individualData : corporateData;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${caseType}-kyc.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateAddress = (key: keyof typeof individualData.address, value: string) => {
    setIndividualData({
      address: {
        ...individualData.address,
        [key]: value,
      },
    });
  };

  const updateDirector = (idx: number, value: string) => {
    const directors = [...corporateData.directors];
    directors[idx] = value;
    setCorporateData({ directors });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Structured data</p>
          <p className="text-xs text-slate-500">Review and fix extracted values.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export JSON
        </Button>
      </div>

      {caseType === "individual" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Full name">
            <Input
              value={individualData.fullName}
              onChange={(e) => setIndividualData({ fullName: e.target.value })}
            />
          </Field>
          <Field label="Date of birth">
            <Input
              type="date"
              value={individualData.dateOfBirth}
              onChange={(e) => setIndividualData({ dateOfBirth: e.target.value })}
            />
          </Field>
          <Field label="Nationality">
            <Input
              value={individualData.nationality}
              onChange={(e) => setIndividualData({ nationality: e.target.value })}
            />
          </Field>
          <Field label="Passport number">
            <Input
              value={individualData.passportNumber}
              onChange={(e) => setIndividualData({ passportNumber: e.target.value })}
            />
          </Field>
          <Field label="Street">
            <Input
              value={individualData.address.street}
              onChange={(e) => updateAddress("street", e.target.value)}
            />
          </Field>
          <Field label="City">
            <Input
              value={individualData.address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
            />
          </Field>
          <Field label="State / Province">
            <Input
              value={individualData.address.state}
              onChange={(e) => updateAddress("state", e.target.value)}
            />
          </Field>
          <Field label="Postal code">
            <Input
              value={individualData.address.zipCode}
              onChange={(e) => updateAddress("zipCode", e.target.value)}
            />
          </Field>
          <Field label="Country">
            <Input
              value={individualData.address.country}
              onChange={(e) => updateAddress("country", e.target.value)}
            />
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Company name">
            <Input
              value={corporateData.companyName}
              onChange={(e) => setCorporateData({ companyName: e.target.value })}
            />
          </Field>
          <Field label="Registration number">
            <Input
              value={corporateData.registrationNumber}
              onChange={(e) => setCorporateData({ registrationNumber: e.target.value })}
            />
          </Field>
          <Field label="Incorporation date">
            <Input
              type="date"
              value={corporateData.incorporationDate}
              onChange={(e) => setCorporateData({ incorporationDate: e.target.value })}
            />
          </Field>
          <Field label="Country of incorporation">
            <Input
              value={corporateData.countryOfIncorporation}
              onChange={(e) => setCorporateData({ countryOfIncorporation: e.target.value })}
            />
          </Field>
          <Field label="Registered address" className="md:col-span-2">
            <Textarea
              value={corporateData.registeredAddress}
              onChange={(e) => setCorporateData({ registeredAddress: e.target.value })}
              rows={3}
            />
          </Field>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium text-slate-700">Directors</Label>
            <div className="space-y-2">
              {corporateData.directors.map((director, idx) => (
                <Input
                  key={idx}
                  value={director}
                  onChange={(e) => updateDirector(idx, e.target.value)}
                  placeholder={`Director ${idx + 1}`}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCorporateData({ directors: [...corporateData.directors, ""] })}
              >
                Add director
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      {children}
    </div>
  );
}
