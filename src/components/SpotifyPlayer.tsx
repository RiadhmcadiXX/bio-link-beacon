import { Heart, Play, SkipBack, SkipForward, Shuffle, Pause } from "lucide-react";

const SpotifyPlayer = () => {
  return (
    <div className="flex items-center w-full max-w-lg p-2 bg-blue-900 text-white rounded-xl shadow-lg space-x-4">
      {/* Album Art */}
      <img
        src="src\components\coverAlbum.png" // Replace with actual image
        alt="Album"
        className="w-16 h-16 rounded-md object-cover"
      />

      {/* Track Info */}
      <div className="flex-1">
        <p className="text-sm text-gray-300 mb-0.5">Daft Punk</p>
        <h3 className="font-bold leading-tight text-lg">Instant Crush</h3>
        <p className="text-xs text-gray-400">Spotify</p>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-white/20 rounded-full">
          <div className="h-full w-2/5 bg-white rounded-full" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col justify-between items-center h-full space-y-2">
        <div className="flex items-center space-x-3 text-white">
          <Shuffle className="w-4 h-4 opacity-80" />
          <SkipBack className="w-4 h-4 opacity-80" />
          <Play className="w-5 h-5 bg-white text-purple-900 p-1 rounded-full" />
          <SkipForward className="w-4 h-4 opacity-80" />
        </div>
        <Heart className="w-4 h-4 text-white opacity-80" />
      </div>
    </div>
  );
};

export default SpotifyPlayer;
