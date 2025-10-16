"use client";

import type { InstrumentType } from "@/types/audio";
import { INSTRUMENTS } from "@/lib/instruments";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface InstrumentSelectorProps {
  onAddTrack: (instrument: InstrumentType) => void;
}

export function InstrumentSelector({ onAddTrack }: InstrumentSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {(Object.keys(INSTRUMENTS) as InstrumentType[]).map((instrumentType) => {
        const instrument = INSTRUMENTS[instrumentType];
        return (
          <Button
            key={instrumentType}
            onClick={() => onAddTrack(instrumentType)}
            className="h-24 flex flex-col items-center justify-center gap-2"
            style={{
              backgroundColor: instrument.color,
              color: "white",
            }}
          >
            <span className="text-3xl">{instrument.icon}</span>
            <span className="text-sm font-medium">{instrument.name}</span>
            <Plus className="w-4 h-4" />
          </Button>
        );
      })}
    </div>
  );
}
