"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Minus, Activity, Infinity } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface BPMControlProps {
  bpm: number;
  onBPMChange: (bpm: number) => void;
  beatLength: number;
  onBeatLengthChange: (length: number) => void;
  loopEnabled: boolean;
  onLoopToggle: (enabled: boolean) => void;
  loopDuration: number;
  onLoopDurationChange: (duration: number) => void;
}

export function BPMControl({
  bpm,
  onBPMChange,
  beatLength,
  onBeatLengthChange,
  loopEnabled,
  onLoopToggle,
  loopDuration,
  onLoopDurationChange,
}: BPMControlProps) {
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [customBeatLength, setCustomBeatLength] = useState<string>("");
  const [customLoopDuration, setCustomLoopDuration] = useState<string>("");
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // cross-env timeout ID
  const [customMode, setCustomMode] = useState(false);
  const [loopCustomMode, setLoopCustomMode] = useState(false);

  // customMode toggles the beat-length custom input; loopCustomMode toggles loop custom input

  const handleBPMChange = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(60, Math.min(200, newBpm));
    onBPMChange(clampedBpm);
  }, [onBPMChange]);

  const handleTapTempo = useCallback(() => {
    const now = Date.now();

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    setTapTimes((prev) => {
      const newTimes = [...prev, now].slice(-4);

      if (newTimes.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < newTimes.length; i++) {
          intervals.push(newTimes[i] - newTimes[i - 1]);
        }
        const avgInterval =
          intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const calculatedBpm = Math.round(60000 / avgInterval);
        handleBPMChange(calculatedBpm);
      }

      return newTimes;
    });

    tapTimeoutRef.current = setTimeout(() => {
      setTapTimes([]);
    }, 2000);
  }, [handleBPMChange]);

  const handleBeatLengthChange = (value: string) => {
    if (value === "custom") {
      const custom = parseFloat(customBeatLength) || 4;
      onBeatLengthChange(Math.max(1, Math.min(60, custom)));
    } else {
      onBeatLengthChange(parseFloat(value));
    }
  };

  const handleLoopDurationChange = (value: string) => {
    if (value === "infinity") {
      onLoopDurationChange(-1);
    } else if (value === "custom") {
      const custom = parseFloat(customLoopDuration) || 10;
      onLoopDurationChange(Math.max(1, Math.min(120, custom)));
    } else {
      onLoopDurationChange(parseFloat(value));
    }
  };

  return (
    <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-2 flex-wrap">
      {/* BPM Control */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          BPM
        </span>

        <Button
          size="sm"
          onClick={() => handleBPMChange(bpm - 1)}
          className="h-8 w-8 p-0 bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <Input
          type="number"
          value={bpm}
          onChange={(e) => handleBPMChange(parseInt(e.target.value) || 120)}
          min={60}
          max={200}
          className="w-16 h-8 text-center text-sm bg-gray-900 border-gray-700 text-white font-bold"
        />

        <Button
          size="sm"
          onClick={() => handleBPMChange(bpm + 1)}
          className="h-8 w-8 p-0 bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          onClick={handleTapTempo}
          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
        >
          <Activity className="w-4 h-4 mr-1" />
          <span className="text-xs font-bold">Tap</span>
        </Button>
      </div>

      {/* Beat Length Control */}
      <div className="items-center gap-2 hidden">
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          Beat
        </span>
        <div className="flex items-center gap-1">
          {[2, 4, 8, 16].map((n) => (
            <Button
              key={n}
              size="sm"
              onClick={() => {
                onBeatLengthChange(n);
                setCustomMode(false);
              }}
              className={`h-8 px-2 text-xs ${
                beatLength === n
                  ? "bg-green-600"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white font-bold transition-all`}
            >
              {n}
            </Button>
          ))}

          <Button
            size="sm"
            onClick={() => setCustomMode((s) => !s)}
            className={`h-8 px-2 text-xs ${
              customMode ? "bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"
            } text-white font-bold transition-all`}
          >
            Custom
          </Button>
        </div>

        {(customMode || beatLength > 16) && (
          <Input
            type="number"
            placeholder="1-60"
            value={customBeatLength}
            onChange={(e) => setCustomBeatLength(e.target.value)}
            onBlur={() => handleBeatLengthChange("custom")}
            min={1}
            max={60}
            className="w-16 h-8 text-center text-xs bg-gray-900 border-gray-700 text-white"
          />
        )}
      </div>

      {/* Loop Controls */}
      <div className="hidden items-center gap-2">
        <Label
          htmlFor="loop-toggle"
          className="text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer"
        >
          Loop
        </Label>
        <Switch
          id="loop-toggle"
          checked={loopEnabled}
          onCheckedChange={onLoopToggle}
          className="data-[state=checked]:bg-green-600"
        />

        {loopEnabled && (
          <>
            <div className="flex items-center gap-1">
              {[5, 10, 20, 30].map((n) => (
                <Button
                  key={n}
                  size="sm"
                  onClick={() => {
                    handleLoopDurationChange(n.toString());
                    setLoopCustomMode(false);
                  }}
                  className={`h-8 px-2 text-xs ${
                    loopDuration === n
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white font-bold transition-all`}
                >
                  {n}s
                </Button>
              ))}

              <Button
                size="sm"
                onClick={() => {
                  handleLoopDurationChange("infinity");
                  setLoopCustomMode(false);
                }}
                className={`h-8 px-2 text-xs ${
                  loopDuration === -1
                    ? "bg-green-600"
                    : "bg-gray-700 hover:bg-gray-600"
                } text-white font-bold transition-all`}
              >
                <div className="flex items-center gap-1">
                  <Infinity className="w-3 h-3" />∞
                </div>
              </Button>

              <Button
                size="sm"
                onClick={() => setLoopCustomMode((s) => !s)}
                className={`h-8 px-2 text-xs ${
                  loopCustomMode
                    ? "bg-yellow-500"
                    : "bg-gray-700 hover:bg-gray-600"
                } text-white font-bold transition-all`}
              >
                Custom
              </Button>
            </div>

            {(loopCustomMode || (loopDuration > 30 && loopDuration !== -1)) && (
              <Input
                type="number"
                placeholder="1-120"
                value={customLoopDuration}
                onChange={(e) => setCustomLoopDuration(e.target.value)}
                onBlur={() => handleLoopDurationChange("custom")}
                min={1}
                max={120}
                className="w-16 h-8 text-center text-xs bg-gray-900 border-gray-700 text-white"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
