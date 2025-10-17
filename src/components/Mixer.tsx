"use client";

import type { Track } from "@/types/audio";
import { Button } from "./ui/button";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Slider } from "./ui/slider";
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Music,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface MixerProps {
  tracks: Track[];
  onVolumeChange: (trackId: string, volume: number) => void;
  onPanChange: (trackId: string, pan: number) => void;
  onMuteToggle: (trackId: string) => void;
  onSoloToggle: (trackId: string) => void;
}

export function Mixer({
  tracks,
  onVolumeChange,
  onPanChange,
  onMuteToggle,
  onSoloToggle,
}: MixerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isSlideDown, setIsSlideDown] = useState(false);
  const [buttonText, setButtonText] = useState("Show Mixer");

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleClick = () => {
    setIsSlideDown(!isSlideDown)
    console.log(isSlideDown)
  }

  const formatPanValue = (pan: number) => {
    if (pan === 0) return "C";
    const direction = pan > 0 ? "R" : "L";
    const value = Math.abs(Math.round(pan * 100));
    return `${direction}${value}`;
  };

  return (
    <>
    <button onClick={() => handleClick()} className={`fixed bottom-0 w-auto border-2 border-solid border-color-[#374151] border-radius-0 bg-[#111827] p-2 hover:scale-[1.1] transition ease-in-out`}>Show Mixer</button>
    <div className={`fixed w-full bottom-0 z-10 bg-gray-900 border-t border-gray-700 p-2 transition ${isSlideDown ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className={`flex items-center mb-2 transition `}>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
          <Music className="w-3 h-3" />
          Mixer
        </h3>
        <div className="flex gap-1 ml-[20px]">
          <Button 
            onClick={() => handleClick()}
            className={`h-7 text-sm p-0 bg-gray-700 hover:bg-gray-600 text-white `}
            aria-label="Hide Mixer">Hide Mixer</Button>
          <Button
            size="sm"
            onClick={() => scroll("left")}
            className="h-7 bg-gray-700 hover:bg-gray-600 text-white"
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </Button>
          <Button
            size="sm"
            onClick={() => scroll("right")}
            className="h-7 bg-gray-700 hover:bg-gray-600 text-white"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </Button>
        </div>
      </div>

      <TooltipProvider delayDuration={300}>
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pb-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex-shrink-0 bg-gray-800 rounded-lg p-2 border border-gray-700"
            >
              {/* Track Name with Color Indicator */}
              <div className="flex items-center gap-1 mb-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: track.color }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-white truncate">
                  {track.name}
                </span>
              </div>

              {/* Mute/Solo Buttons */}
              <div className="flex gap-1 mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => onMuteToggle(track.id)}
                      className={`h-6 p-0  transition-all ${
                        track.muted
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                      aria-label={track.muted ? "Unmute track" : "Mute track"}
                      aria-pressed={track.muted}
                    >
                      {track.muted ? (
                        <VolumeX className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{track.muted ? "Unmute" : "Mute"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => onSoloToggle(track.id)}
                      className={`h-6 text-xs font-bold w-0 p-0 transition-all ${
                        track.solo
                          ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                      aria-label={track.solo ? "Disable solo" : "Solo track"}
                      aria-pressed={track.solo}
                    >
                      S
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{track.solo ? "Un-solo" : "Solo"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Volume Control with Icon */}
              <div className="mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between mb-1">
                      <Volume2 className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {Math.round(track.volume * 100)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Volume: {Math.round(track.volume * 100)}%
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Slider
                  value={[track.volume * 100]}
                  onValueChange={(value: number[]) =>
                    onVolumeChange(track.id, value[0] / 100)
                  }
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label={`Volume for ${track.name}`}
                />
              </div>

              {/* Pan Control with Icon */}
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Pan</span>
                      <span className="text-xs text-gray-400">
                        {formatPanValue(track.pan)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Pan:{" "}
                      {track.pan > 0
                        ? "Right"
                        : track.pan < 0
                        ? "Left"
                        : "Center"}
                      {track.pan !== 0
                        ? ` ${Math.abs(Math.round(track.pan * 100))}`
                        : ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Slider
                  value={[track.pan * 100]}
                  onValueChange={(value: number[]) =>
                    onPanChange(track.id, value[0] / 100)
                  }
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label={`Pan for ${track.name}`}
                />
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div></>
  );
}
