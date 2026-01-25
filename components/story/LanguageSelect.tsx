"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/lib/types/database";

interface LanguageSelectProps {
  value: Language;
  onValueChange: (value: Language) => void;
}

const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
};

export function LanguageSelect({ value, onValueChange }: LanguageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{languageLabels.en}</SelectItem>
        <SelectItem value="hi">{languageLabels.hi}</SelectItem>
        <SelectItem value="ta">{languageLabels.ta}</SelectItem>
      </SelectContent>
    </Select>
  );
}
