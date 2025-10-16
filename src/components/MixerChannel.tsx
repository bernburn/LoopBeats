"use client";

import type { Track } from "@/types/audio";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface MixerChannelProps {
  track: Track;
  onVolumeChange: (trackId: string, volume: number) => void;
  onPanChange: (trackId: string, pan: number) => void;
  onMuteToggle: (trackId: string) => void;
  onSoloToggle: (trackId: string) => void;
}

export function MixerChannel({
  track,
  onVolumeChange,
  onPanChange,
  onMuteToggle,
  onSoloToggle,
}: MixerChannelProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2 min-w-[120px]">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: track.color }}
        />
        <span className="text-sm font-medium text-white truncate">
          {track.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={track.muted ? "destructive" : "outline"}
          onClick={() => onMuteToggle(track.id)}
          className="w-12"
        >
          {track.muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant={track.solo ? "default" : "outline"}
          onClick={() => onSoloToggle(track.id)}
          className="w-12"
        >
          S
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs text-gray-400 w-12">Vol</span>
        <Slider
          value={[track.volume * 100]}
          onValueChange={(value: number[]) =>
            onVolumeChange(track.id, value[0] / 100)
          }
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-gray-400 w-12 text-right">
          {Math.round(track.volume * 100)}%
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs text-gray-400 w-12">Pan</span>
        <Slider
          value={[track.pan * 100]}
          onValueChange={(value: number[]) =>
            onPanChange(track.id, value[0] / 100)
          }
          min={-100}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-gray-400 w-12 text-right">
          {track.pan > 0 ? "R" : track.pan < 0 ? "L" : "C"}
          {Math.abs(Math.round(track.pan * 100))}
        </span>
      </div>
    </div>
  );
}
