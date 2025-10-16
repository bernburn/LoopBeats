"use client";

import { useState } from "react";
import type { InstrumentType } from "@/types/audio";
import { INSTRUMENTS } from "@/lib/instruments";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight, Volume2 } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface SoundLibraryProps {
  onAddTrack: (instrument: InstrumentType) => void;
}

interface CategoryConfig {
  name: string;
  instruments: InstrumentType[];
  icon: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    name: "Drums",
    instruments: ["kick", "snare", "hihat"],
    icon: "🥁",
  },
  {
    name: "Synths",
    instruments: ["bass", "lead", "pad"],
    icon: "🎹",
  },
];

export function SoundLibrary({ onAddTrack }: SoundLibraryProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Drums", "Synths"])
  );
  const [draggingInstrument, setDraggingInstrument] =
    useState<InstrumentType | null>(null);
  const [previewingInstrument, setPreviewingInstrument] =
    useState<InstrumentType | null>(null);

  const toggleCategory = (categoryName: string): void => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleDragStart = (instrument: InstrumentType): void => {
    // setDraggingInstrument(instrument);
  };

  const handleDragEnd = (): void => {
    // setDraggingInstrument(null);
  };

  const handleMouseEnter = (instrument: InstrumentType): void => {
    setPreviewingInstrument(instrument);
    audioEngine.playNote(instrument, 3, 0.15, 0.5, 0);
  };

  const handleMouseLeave = (): void => {
    setPreviewingInstrument(null);
  };

  const handleClick = (instrument: InstrumentType): void => {
    onAddTrack(instrument);
  };

  return (
    <Card className="relative bg-gray-900 border-gray-700 h-full">
      <div className="sticky top-0">
        <CardHeader className="top-0 pb-3">
          <CardTitle className=" text-white text-lg">Sound Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-md:flex max-md:justify-center max-md:items-center">
          {CATEGORIES.map((category) => {
            const isExpanded = expandedCategories.has(category.name);
            return (
              <div key={category.name} className="space-y-2 max-md:space-y-0">
                <Button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full justify-start text-white hover:bg-gray-800 px-2 h-9 bg-transparent font-semibold transition-all "
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </Button>

                {isExpanded && (
                  <div className="space-y-1 ml-2">
                    {category.instruments.map((instrumentType) => {
                      const instrument = INSTRUMENTS[instrumentType];
                      const isDragging = draggingInstrument === instrumentType;
                      const isPreviewing =
                        previewingInstrument === instrumentType;

                      return (
                        <div
                          key={instrumentType}
                          // draggable
                          // onDragStart={() => handleDragStart(instrumentType)}
                          // onDragEnd={handleDragEnd}
                          onMouseEnter={() => handleMouseEnter(instrumentType)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleClick(instrumentType)}
                          className={`z-20 
                          flex items-center gap-2 p-3 rounded-lg cursor-pointer
                          transition-all duration-200 shadow-md
                          ${
                            isDragging
                              ? "opacity-50 scale-95"
                              : "opacity-100 scale-100"
                          }
                          ${
                            isPreviewing
                              ? "ring-2 ring-white shadow-xl scale-105"
                              : ""
                          }
                          hover:scale-105 hover:shadow-lg active:scale-95
                        `}
                          style={{
                            backgroundColor: instrument.color,
                            color: "white",
                          }}
                        >
                          <span className="text-xl">{instrument.icon}</span>
                          <span className="text-sm flex-1">
                            {instrument.name}
                          </span>
                          {isPreviewing && (
                            <Volume2 className="w-4 h-4 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 text-xs text-gray-400 space-y-1 max-md:hidden">
            <p>
              💡 <strong>Tip:</strong> Click sounds in the sequencer to add
              tracks
            </p>
            <p>🎵 Hover over sounds to preview them</p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
