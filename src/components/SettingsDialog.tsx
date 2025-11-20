import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useKYCStore } from "../store/useKYCStore";
import { KeyRound } from "lucide-react";

export function SettingsDialog() {
  const { apiKey, setApiKey } = useKYCStore();
  const [value, setValue] = useState(apiKey ?? "");

  useEffect(() => {
    setValue(apiKey ?? "");
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(value.trim() || undefined);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <KeyRound className="h-4 w-4" /> API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API key</DialogTitle>
          <DialogDescription>
            The key is stored in your browser only. Without it, AI extraction will remain disabled.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="api-key">
            API Key
          </label>
          <Input
            id="api-key"
            placeholder="sk-..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="password"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setValue(apiKey ?? "")}>Reset</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
