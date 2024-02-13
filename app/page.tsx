import MusicProvider from "@/components/providers/music";
import Workspace from "@/components/ui/workspace";

export default function Home() {
  return (
    <MusicProvider>
      <Workspace />
    </MusicProvider>
  );
}
