import { VideoPlayer } from './video-player';
import PoemDisplay from './PoemDisplay';

export default function HeroOverlay() {
  return (
    <div className="relative w-full" style={{ height: '400vh' }}>
      {/* Video as background, spans both hero and poem */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <VideoPlayer />
      </div>
      {/* Hero section (empty, just for spacing) */}
      <div className="w-full h-screen" />
      {/* Poem section, sticky at top after hero */}
      <div className="sticky top-0 z-10 w-full flex flex-col items-center justify-center">
        <PoemDisplay />
      </div>
    </div>
  );
} 