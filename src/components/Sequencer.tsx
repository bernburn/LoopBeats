"use client";

import type { Track } from "@/types/audio";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface SequencerProps {
  track: Track;
  currentStep: number;
  onPatternChange: (stepIndex: number) => void;
  onRemove: () => void;
}

export function Sequencer({
  track,
  currentStep,
  onPatternChange,
  onRemove,
}: SequencerProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-lg"
            style={{
              backgroundColor: track.color,
              boxShadow: `0 0 10px ${track.color}50`,
            }}
          />
          <span className="text-sm font-semibold text-white">{track.name}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {track.instrument}
          </span>
        </div>
        <Button
          onClick={onRemove}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400 text-gray-500"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-16 gap-1">
        {track.pattern.map((active, index) => {
          const isCurrentStep = currentStep === index;
          const isMajorBeat = index % 4 === 0;

          return (
            <button
              key={index}
              onClick={() => onPatternChange(index)}
              className={`
                h-8 rounded transition-all cursor-pointer
                ${
                  active
                    ? "opacity-100 shadow-lg"
                    : "opacity-40 hover:opacity-70"
                }
                ${isCurrentStep ? "ring-2 ring-white scale-110 z-10" : ""}
                ${
                  isMajorBeat
                    ? "border-2 border-white/20"
                    : "border border-gray-700"
                }
                hover:scale-105 active:scale-95
              `}
              style={{
                backgroundColor: active ? track.color : "#1f2937",
                boxShadow: active ? `0 0 15px ${track.color}60` : "none",
              }}
              disabled={track.muted}
            />
          );
        })}
      </div>
    </div>
  );
}
