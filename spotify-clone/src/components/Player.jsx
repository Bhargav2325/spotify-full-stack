import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    playStatus,
    setPlayStatus,
    play,
    pause,
    time,
    previous,
    next,
    seekSong,
    shuffle,
    toggleShuffle,
    loop,
    toggleLoop,
  } = useContext(PlayerContext);

  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      if (playStatus) {
        audio.play();
      } else {
        audio.pause();
      }

      const handleEnded = () => {
        if (loop) {
          audio.currentTime = 0;
          audio.play();
        } else {
          setPlayStatus(false);
        }
      };

      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [playStatus, loop, setPlayStatus]);

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;

    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = previousVolume;
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      audioRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (minute, second) => {
    return `${minute || 0}:${second < 10 ? `0${second || 0}` : second || 0}`;
  };

  return track ? (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
      <audio ref={audioRef} src={track.audio} preload="auto"></audio>

      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src={track.image} alt={track.name} />
        <div>
          <p>{track.name}</p>
          <p>{track.desc.slice(0, 12)}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img
            onClick={toggleShuffle}
            className={`w-4 cursor-pointer ${
              shuffle ? "opacity-100" : "opacity-50"
            }`}
            src={assets.shuffle_icon}
            alt="Shuffle"
            title="Shuffle"
          />
          <img
            title="Previous"
            onClick={previous}
            className="w-4 cursor-pointer"
            src={assets.prev_icon}
            alt="Previous"
          />
          {playStatus ? (
            <img
              title="Pause"
              onClick={pause}
              className="w-4 cursor-pointer"
              src={assets.pause_icon}
              alt="Pause"
            />
          ) : (
            <img
              title="Play"
              onClick={play}
              className="w-4 cursor-pointer"
              src={assets.play_icon}
              alt="Play"
            />
          )}
          <img
            title="Next"
            onClick={next}
            className="w-4 cursor-pointer"
            src={assets.next_icon}
            alt="Next"
          />
          <img
            title="Loop"
            onClick={toggleLoop}
            className={`w-4 cursor-pointer ${
              loop ? "opacity-100" : "opacity-50"
            }`}
            src={assets.loop_icon}
            alt="Loop"
          />
        </div>

        <div className="flex items-center gap-5">
          <p>{formatTime(time.currentTime.minute, time.currentTime.second)}</p>

          <div
            ref={seekBg}
            onClick={seekSong}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
          >
            <div
              ref={seekBar}
              className="h-1 bg-green-800 rounded-full"
              style={{
                width: `${time.progress || 0}%`,
              }}
            ></div>
          </div>

          <p>{formatTime(time.totalTime.minute, time.totalTime.second)}</p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 opacity-75">
        <img
          title="Plays"
          className="w-4"
          src={assets.plays_icon}
          alt="Plays"
        />
        <img title="Mice" className="w-4" src={assets.mic_icon} alt="Mic" />
        <img
          title="Queue"
          className="w-4"
          src={assets.queue_icon}
          alt="Queue"
        />
        <img
          title="Speaker"
          className="w-4"
          src={assets.speaker_icon}
          alt="Speaker"
        />

        <img
          title="Volume"
          className="w-4 cursor-pointer "
          src={isMuted ? assets.mute_icon : assets.volume_icon}
          alt="Volume"
          onClick={toggleMute}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-gray-300 rounded cursor-pointer"
        />

        <img
          title="Mini Player"
          className="w-4"
          src={assets.mini_player_icon}
          alt="Mini Player"
        />
        <img title="Zoom" className="w-4" src={assets.zoom_icon} alt="Zoom" />
      </div>
    </div>
  ) : null;
};

export default Player;
