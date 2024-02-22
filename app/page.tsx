import MusicProvider from "@/components/providers/music";
import Workspace from "@/components/ui/workspace";
import ImportExportTest from "@/components/ui/import-export-test";

export default function Home() {
  return (
    <MusicProvider>
      <ImportExportTest />
      <Workspace />
    </MusicProvider>
  );
}
