"use client";

import MusicProvider from "@/components/providers/music";
import Workspace from "@/components/ui/workspace";
import ImportExportTest from "@/components/ui/import-export-test";
import { MusicScore } from "@/types/music";

export default function Home() {
  return (
    <MusicProvider>
      <ImportExportTest
        setScore={function (score: MusicScore): void {
          throw new Error("Function not implemented.");
        }}
        setImportedAudio={function (audio: File): void {
          throw new Error("Function not implemented.");
        }}
        play={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <Workspace />
    </MusicProvider>
  );
}
