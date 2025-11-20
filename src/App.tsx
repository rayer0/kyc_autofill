import { useEffect, useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { UploadZone } from "./components/UploadZone";
import { SettingsDialog } from "./components/SettingsDialog";
import { useKYCStore } from "./store/useKYCStore";
import { CaseType } from "./types";
import { AlertTriangle, Play } from "lucide-react";
import { DataForm } from "./components/DataForm";
import { DocumentViewer } from "./components/DocumentViewer";
import { analyzeDocuments, fileToBase64 } from "./lib/OpenAIService";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "react-resizable-panels";

function App() {
  const {
    caseType,
    setCaseType,
    uploadedFiles,
    apiKey,
    setIndividualData,
    setCorporateData,
    status,
    setStatus,
    error,
  } = useKYCStore();
  const [activeFileId, setActiveFileId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (uploadedFiles.length > 0 && !activeFileId) {
      setActiveFileId(uploadedFiles[0].id);
    }
  }, [uploadedFiles, activeFileId]);

  const activeFile = useMemo(
    () => uploadedFiles.find((f) => f.id === activeFileId),
    [uploadedFiles, activeFileId]
  );

  const handleAnalyze = async () => {
    if (!apiKey) {
      setStatus("idle", "Add an OpenAI API key before analyzing.");
      return;
    }
    if (uploadedFiles.length === 0) {
      setStatus("idle", "Upload at least one PDF or image to analyze.");
      return;
    }

    setStatus("processing", undefined);
    try {
      const images = await Promise.all(uploadedFiles.map((file) => fileToBase64(file.file)));
      const result = await analyzeDocuments(images, caseType, apiKey);
      if (result.individual) setIndividualData(result.individual);
      if (result.corporate) setCorporateData(result.corporate);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("idle", err instanceof Error ? err.message : "Unable to analyze documents");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white font-semibold">
            KYC
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">KYC Extraction Workbench</h1>
            <p className="text-sm text-slate-500">Local-first review of AI-assisted KYC data</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SettingsDialog />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-3">
        <section className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Case setup</p>
                <p className="text-xs text-slate-500">Choose type and upload documents.</p>
              </div>
            </div>
            <Tabs value={caseType} onValueChange={(value) => setCaseType(value as CaseType)}>
              <TabsList className="mb-4">
                <TabsTrigger value="individual">Individual client</TabsTrigger>
                <TabsTrigger value="corporate">Corporate client</TabsTrigger>
              </TabsList>
              <TabsContent value="individual">
                <p className="mb-2 text-sm text-slate-600">
                  Extract passport and proof-of-address details for an individual.
                </p>
              </TabsContent>
              <TabsContent value="corporate">
                <p className="mb-2 text-sm text-slate-600">
                  Extract entity registration data and directors for a company.
                </p>
              </TabsContent>
            </Tabs>

            <UploadZone />

            <Button
              className="mt-4 w-full gap-2"
              onClick={handleAnalyze}
              disabled={status === "processing" || !apiKey}
            >
              <Play className="h-4 w-4" />
              {apiKey ? (status === "processing" ? "Analyzing..." : "Analyze documents") : "Add API key to analyze"}
            </Button>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="h-[calc(100vh-160px)] rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={45} minSize={30}>
                <DocumentViewer file={activeFile} />
              </ResizablePanel>
              <ResizableHandle className="bg-slate-200" />
              <ResizablePanel defaultSize={55} minSize={35}>
                <div className="h-full overflow-auto p-4">
                  <DataForm caseType={caseType} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
