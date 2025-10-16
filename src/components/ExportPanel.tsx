"use client";

import { useState } from "react";
import type { Track } from "@/types/audio";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AudioExporter } from "@/lib/audioExport";
import { Download, FileMusic, FileAudio } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ExportPanelProps {
  tracks: Track[];
  bpm: number;
}

type AudioQuality = "lossless" | "320" | "192";

export function ExportPanel({ tracks, bpm }: ExportPanelProps) {
  const [beatName, setBeatName] = useState("my-beat");
  const [description, setDescription] = useState("");
  const [artistName, setArtistName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [quality, setQuality] = useState<AudioQuality>("lossless");

  const handleExportWAV = async () => {
    setIsExporting(true);
    try {
      await AudioExporter.exportAsWAV(tracks, bpm, beatName);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMP3 = async () => {
    setIsExporting(true);
    try {
      await AudioExporter.exportAsMP3(tracks, bpm, beatName);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportProject = () => {
    AudioExporter.exportProject(tracks, bpm, beatName);
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Export Beat</CardTitle>
        <CardDescription>
          Download your beat or mint as NFT on Base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="download" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="nft">Mint NFT</TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="beatName" className="text-white">
                Beat Name
              </Label>
              <Input
                id="beatName"
                value={beatName}
                onChange={(e) => setBeatName(e.target.value)}
                placeholder="Enter beat name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality" className="text-white">
                Audio Quality
              </Label>
              <Select
                value={quality}
                onValueChange={(val: string) => setQuality(val as AudioQuality)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lossless">
                    Lossless WAV (44.1kHz, 16-bit)
                  </SelectItem>
                  <SelectItem value="320">
                    High Quality MP3 (320kbps)
                  </SelectItem>
                  <SelectItem value="192">Standard MP3 (192kbps)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleExportWAV}
                disabled={isExporting}
                className="w-full"
                variant="outline"
              >
                <FileAudio className="w-4 h-4 mr-2" />
                {quality === "lossless" ? "Export WAV" : "Export MP3"}
              </Button>

              <Button
                onClick={handleExportProject}
                disabled={isExporting}
                className="w-full"
                variant="outline"
              >
                <FileMusic className="w-4 h-4 mr-2" />
                Save Project
              </Button>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {quality === "lossless"
                ? "Uncompressed WAV format - highest quality, larger file size"
                : quality === "320"
                ? "High quality MP3 - excellent sound, smaller file size"
                : "Standard MP3 - good sound, smallest file size"}
            </p>
          </TabsContent>

          <TabsContent value="nft" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="nftBeatName" className="text-white">
                Beat Title
              </Label>
              <Input
                id="nftBeatName"
                value={beatName}
                onChange={(e) => setBeatName(e.target.value)}
                placeholder="Enter beat title"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artistName" className="text-white">
                Artist Name
              </Label>
              <Input
                id="artistName"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Enter your artist name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your beat"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                🚀 Connect your wallet to mint this beat as an NFT on Base
                blockchain.
              </p>
            </div>

            <Button className="w-full" disabled>
              <Download className="w-4 h-4 mr-2" />
              Connect Wallet to Mint
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
