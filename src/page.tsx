"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Track, InstrumentType } from "@/types/audio";
import { audioEngine } from "@/lib/audioEngine";
import { Sequencer } from "@/components/Sequencer";
import { Mixer } from "@/components/Mixer";
import { SoundLibrary } from "@/components/SoundLibrary";
import { BPMControl } from "@/components/BPMControl";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { sdk } from "@farcaster/miniapp-sdk";

import { IoMdArrowRoundBack } from "react-icons/io";

export default function Home() {
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (document.readyState !== "complete") {
          await new Promise((resolve) => {
            if (document.readyState === "complete") {
              resolve(void 0);
            } else {
              window.addEventListener("load", () => resolve(void 0), {
                once: true,
              });
            }
          });
        }

        await sdk.actions.ready();
        console.log(
          "Farcaster SDK initialized successfully - app fully loaded"
        );
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        setTimeout(async () => {
          try {
            await sdk.actions.ready();
            console.log("Farcaster SDK initialized on retry");
          } catch (retryError) {
            console.error("Farcaster SDK retry failed:", retryError);
          }
        }, 1000);
      }
    };
    initializeFarcaster();
  }, []);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [beatLength, setBeatLength] = useState(4);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopDuration, setLoopDuration] = useState(10);
  const [loopProgress, setLoopProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const loopTimerRef = useRef<number>(0);
  const loopStartTimeRef = useRef<number>(0);

  useEffect(() => {
    audioEngine.initialize();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const addTrack = useCallback((instrument: InstrumentType) => {
    const colors: Record<InstrumentType, string> = {
      bass: "#3b82f6",
      lead: "#8b5cf6",
      pad: "#ec4899",
      kick: "#ef4444",
      snare: "#f97316",
      hihat: "#eab308",
      "acoustic-guitar": "#d97706",
      "vintage-synth": "#06b6d4",
    };

    const names: Record<InstrumentType, string> = {
      bass: "Bass",
      lead: "Lead",
      pad: "Pad",
      kick: "Kick",
      snare: "Snare",
      hihat: "Hi-Hat",
      "acoustic-guitar": "Acoustic Guitar",
      "vintage-synth": "Vintage Synth",
    };

    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: names[instrument],
      instrument,
      pattern: Array(16).fill(false),
      volume: 0.7,
      pan: 0,
      muted: false,
      solo: false,
      notes: [0],
      color: colors[instrument],
    };

    setTracks((prev) => [...prev, newTrack]);
  }, []);

  const updatePattern = useCallback((trackId: string, stepIndex: number) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id === trackId) {
          const newPattern = [...track.pattern];
          newPattern[stepIndex] = !newPattern[stepIndex];
          return { ...track, pattern: newPattern };
        }
        return track;
      })
    );
  }, []);

  const updateVolume = useCallback((trackId: string, volume: number) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === trackId ? { ...track, volume } : track))
    );
  }, []);

  const updatePan = useCallback((trackId: string, pan: number) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === trackId ? { ...track, pan } : track))
    );
  }, []);

  const toggleMute = useCallback((trackId: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId ? { ...track, muted: !track.muted } : track
      )
    );
  }, []);

  const toggleSolo = useCallback((trackId: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId ? { ...track, solo: !track.solo } : track
      )
    );
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setTracks((prev) => prev.filter((track) => track.id !== trackId));
  }, []);

  const playStep = useCallback(
    (step: number) => {
      const hasSolo = tracks.some((track) => track.solo);

      tracks.forEach((track) => {
        const shouldPlay =
          track.pattern[step] && !track.muted && (!hasSolo || track.solo);
        if (shouldPlay) {
          const stepDuration = 60 / bpm / 4;
          audioEngine.playNote(
            track.instrument,
            0,
            stepDuration,
            track.volume,
            track.pan
          );
        }
      });
    },
    [tracks, bpm]
  );

  const [openModal, setOpenModal] = useState(false);
  const [beatName, setBeatName] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setOpenModal(!openModal);
    setMintResult(null);
  };

  const handleMint = async () => {
    if (!beatName.trim()) {
      setMintResult("Please enter a name for the beat.");
      return;
    }

    try {
      setIsMinting(true);
      setMintResult(null);

      // Placeholder minting flow - replace with actual NFT minting logic
      // Example: upload beat audio/metadata to IPFS, create a mint tx, etc.
      await new Promise((resolve) => setTimeout(resolve, 1200));

  setMintResult(`Minted "${beatName}" successfully (mock)`);
  setBeatName("");
  setOpenModal(false);
  setShowConfirm(false);
    } catch (err) {
      console.error(err);
      setMintResult("Mint failed. See console for details.");
    } finally {
      setIsMinting(false);
    }
  };

  const handleConfirmMint = async () => {
    // Close the confirmation modal and proceed with minting
    setShowConfirm(false);
    await handleMint();
  };

  const startPlayback = useCallback(() => {
    setIsPlaying(true);
    let step = 0;
    loopStartTimeRef.current = Date.now();
    loopTimerRef.current = 0;

    intervalRef.current = setInterval(() => {
      setCurrentStep(step);
      playStep(step);
      step = (step + 1) % 16;

      // Update loop progress
      if (loopEnabled && loopDuration > 0) {
        const elapsed = (Date.now() - loopStartTimeRef.current) / 1000;
        const progress = Math.min((elapsed / loopDuration) * 100, 100);
        setLoopProgress(progress);

        // Stop when loop duration is reached (unless infinite)
        if (loopDuration !== -1 && elapsed >= loopDuration) {
          stopPlayback();
        }
      }
    }, (60 / bpm / 4) * 1000);
  }, [bpm, playStep, loopEnabled, loopDuration]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setLoopProgress(0);
    loopTimerRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
  }, [bpm]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex max-md:flex-col max-md:w-[100vw]">
      {/* Sound Library - Left Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-gray-900 max-md:hidden">
        <SoundLibrary onAddTrack={addTrack} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="border-b border-gray-800 bg-gray-900 p-4 max-md:flex max-md:justify-center">
          <div className="flex items-center justify-between max-w-7xl mx-auto ">
            <div className="max-md:hidden">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LoopLab
              </h1>
              <p className="text-sm text-gray-400">
                Professional DAW with Base Blockchain
              </p>
            </div>

            <div className="flex items-center gap-4">
              <BPMControl
                bpm={bpm}
                onBPMChange={setBpm}
                beatLength={beatLength}
                onBeatLengthChange={setBeatLength}
                loopEnabled={loopEnabled}
                onLoopToggle={setLoopEnabled}
                loopDuration={loopDuration}
                onLoopDurationChange={setLoopDuration}
              />

              <div className="flex gap-2">
                {!isPlaying ? (
                  <Button
                    onClick={startPlayback}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-green-500/50 transition-all"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Play
                  </Button>
                ) : (
                  <Button
                    onClick={pausePlayback}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg transition-all"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                <Button
                  onClick={stopPlayback}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition-all hidden"
                >
                  <Square className="w-4 h-4" />
                </Button>
                <Button
                onClick={() => {handleClick()}}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Mint
                </Button>
              </div>

              {/* Export button removed - use NFTMinter component instead if needed */}
            </div>
          </div>
        </div>
        <div className="hidden w-64 border-r border-gray-800 bg-gray-900 max-md:w-full max-md:block max-md:border-r-0 max-md:border-b max-md:h-auto">
          <SoundLibrary onAddTrack={addTrack} />
        </div>

        
        {/* Loop Progress Indicator */}
        {loopEnabled && isPlaying && loopDuration !== -1 && (
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Loop Progress</span>
                <span>
                  {Math.round(loopProgress)}%{" "}
                  {loopDuration !== -1 ? `(${loopDuration}s)` : "∞"}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${loopProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sequencer Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-950">
          <div className="max-w-7xl mx-auto space-y-4 pb-10">
            {tracks.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎵</div>
                <h2 className="text-2xl font-bold mb-2">Start Creating</h2>
                <p className="text-gray-400">
                  Drag instruments from the sound library or click to add tracks
                </p>
              </div>
            ) : (
              tracks.map((track) => (
                <Sequencer
                  key={track.id}
                  track={track}
                  currentStep={isPlaying ? currentStep : -1}
                  onPatternChange={(stepIndex) =>
                    updatePattern(track.id, stepIndex)
                  }
                  onRemove={() => removeTrack(track.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Mixer - Bottom */}
        {tracks.length > 0 && (
          <Mixer
            tracks={tracks}
            onVolumeChange={updateVolume}
            onPanChange={updatePan}
            onMuteToggle={toggleMute}
            onSoloToggle={toggleSolo}
          />
        )}
      </div>
      <div
        className={`${openModal ? "flex" : "hidden"} transition ease-in-out absolute inset-0 justify-center items-center`}
        role="dialog"
        aria-modal={openModal}
        aria-hidden={!openModal}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClick} />

        <div className={`z-10 w-[400px] bg-[#111827] border-2 border-solid border-color-[#374151] rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleClick}
              className="px-3 py-2 rounded-md bg-red-400"
              aria-label="Close"
            >
              <IoMdArrowRoundBack />
            </button>
            <div className="font-semibold text-center text-2xl flex-1">Mint this beat?</div>
            <div className="w-10" />
          </div>

          <label className="block text-sm text-gray-300 mb-2">Beat name</label>
          <input
            value={beatName}
            onChange={(e) => setBeatName(e.target.value)}
            placeholder="Name of Beat"
            className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 text-white mb-4"
            disabled={isMinting}
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleClick}
              className="px-3 py-2 rounded-md bg-gray-700 text-white"
              disabled={isMinting}
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className={`px-3 py-2 rounded-md bg-purple-600 font-semibold text-white ${isMinting ? 'opacity-60 cursor-wait' : ''}`}
              disabled={isMinting}
            >
              {isMinting ? 'Minting...' : 'Mint the Beat'}
            </button>
          </div>

          {mintResult && (
            <div className="mt-3 text-sm text-gray-300">{mintResult}</div>
          )}
        </div>
      </div>

      {/* Confirmation modal that appears after clicking Mint in the main modal */}
      <div className={`${showConfirm ? 'flex' : 'hidden'} absolute inset-0 items-center justify-center`}> 
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
        <div className="z-20 w-[420px] bg-[#0b1220] border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Confirm Mint</h3>
          <p className="text-sm text-gray-400 mb-4">Image Preview</p>

          <div className="w-full h-48 bg-gray-800 rounded-md flex items-center justify-center mb-4">
            {/* Placeholder image box */}
            <img src="../assets/nftSampleImage.png" alt="NFT Preview" className="w-32 h-32 object-contain" />
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowConfirm(false)} className="px-3 py-2 rounded-md bg-gray-700 text-white">Back</button>
            <button onClick={handleConfirmMint} className="px-3 py-2 rounded-md bg-green-600 text-white">Confirm</button>
          </div>
        </div>
      </div>

    </div>
  );
}
