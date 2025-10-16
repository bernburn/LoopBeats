"use client";

import type { InstrumentType } from "@/types/audio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface ToneSelectorProps {
  value: InstrumentType;
  onChange: (instrument: InstrumentType) => void;
  onPreview?: () => void;
}

const TONE_PRESETS: Record<InstrumentType, string> = {
  kick: "Kick Drum",
  snare: "Snare Drum",
  hihat: "Hi-Hat",
  bass: "Bass Synth",
  lead: "Lead Synth",
  pad: "Pad Synth",
  "acoustic-guitar": "Acoustic Guitar",
  "vintage-synth": "Vintage Synth",
};

export function ToneSelector({
  value,
  onChange,
  onPreview,
}: ToneSelectorProps) {
  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      audioEngine.playNote(value, 0, 0.3, 0.5, 0);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={(val: string) => onChange(val as InstrumentType)}
      >
        <SelectTrigger className="flex-1 h-8 bg-gray-900 border-gray-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kick">{TONE_PRESETS.kick}</SelectItem>
          <SelectItem value="snare">{TONE_PRESETS.snare}</SelectItem>
          <SelectItem value="hihat">{TONE_PRESETS.hihat}</SelectItem>
          <SelectItem value="bass">{TONE_PRESETS.bass}</SelectItem>
          <SelectItem value="lead">{TONE_PRESETS.lead}</SelectItem>
          <SelectItem value="pad">{TONE_PRESETS.pad}</SelectItem>
          <SelectItem value="acoustic-guitar">
            {TONE_PRESETS["acoustic-guitar"]}
          </SelectItem>
          <SelectItem value="vintage-synth">
            {TONE_PRESETS["vintage-synth"]}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        size="sm"
        variant="outline"
        onClick={handlePreview}
        className="h-8 w-8 p-0"
        title="Preview tone"
      >
        <Play className="w-3 h-3" />
      </Button>
    </div>
  );
}
