import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const url = "http://localhost:4000";

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };

      audioRef.current.onended = () => {
        if (loop) {
          audioRef.current.play();
        } else {
          next();
        }
      };
    }, 1000);
  }, [audioRef, loop]);

  useEffect(() => {
    if (track && playStatus) {
      const playAudio = async () => {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      };
      playAudio();
    }
  }, [track, playStatus]);

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    songsData.forEach((item) => {
      if (id === item._id) {
        setTrack(item);
      }
    });

    setPlayStatus(true);
  };

  const previous = () => {
    songsData.forEach((item, index) => {
      if (track?._id === item._id && index > 0) {
        setTrack(songsData[index - 1]);
      }
    });
  };

  const next = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * songsData.length);
      setTrack(songsData[randomIndex]);
    } else {
      songsData.forEach((item, index) => {
        if (track?._id === item._id && index < songsData.length - 1) {
          setTrack(songsData[index + 1]);
        }
      });
    }
  };

  const seekSong = (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongsData(response.data.songs);
      setTrack(response.data.songs[0]);
    } catch (error) {
      console.error("Error fetching songs data:", error);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumsData(response.data.album);
    } catch (error) {
      console.error("Error fetching albums data:", error);
    }
  };

  const toggleShuffle = () => {
    setShuffle((prevState) => !prevState);
  };

  const toggleLoop = () => {
    setLoop((prevState) => !prevState);
  };

  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    toggleShuffle,
    shuffle,
    toggleLoop,
    loop,
    songsData,
    albumsData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
