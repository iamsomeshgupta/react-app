// src/components/MusicPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';

const MusicPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #282c34;
  color: white;
  padding: 20px;
  text-align: center;
`;

const SongDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const CoverImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 24px;

  &:disabled {
    color: grey;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.input`
  width: 80%;
  margin: 20px 0;
`;

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const songs = [
    {
      src: '/songs/Lutt Putt Gaya (Full Video) Shah Rukh Khan,Taapsee,Rajkumar H,Pritam,Arijit,Swanand,IPSingh  Dunki.mp3',
      title: 'Song 1',
      artist: 'Artist 1',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcZ-GXd6jTaoe9AJlmXz-MyBFlVwoeXin84A&s',
    },
    {
      src: '/songs/Dunki_ O Maahi (Full Video)  Shah Rukh Khan  Taapsee Pannu  Pritam  Arijit Singh  Irshad Kamil.mp3',
      title: 'Song 2',
      artist: ' Pritam , Arijit Singh , Irshad Kamil',
      cover: 'data:image/jpeg;base64,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',
    },
  ];
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleProgressChange = (e) => {
    const progress = e.target.value;
    const newTime = (audioRef.current.duration / 100) * progress;
    audioRef.current.currentTime = newTime;
    setProgress(progress);
  };

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setProgress(0);
  };

  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    setProgress(0);
  };

  useEffect(() => {
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentSongIndex]);

  return (
    <MusicPlayerContainer>
      <SongDetails>
        <CoverImage src={songs[currentSongIndex].cover} alt={`${songs[currentSongIndex].title} cover`} />
        <h2>{songs[currentSongIndex].title}</h2>
        <h3>{songs[currentSongIndex].artist}</h3>
        <p>{songs[currentSongIndex].album}</p>
      </SongDetails>
      <audio
        ref={audioRef}
        src={songs[currentSongIndex].src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />
      <ProgressBar
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleProgressChange}
      />
      <Controls>
        <Button onClick={prevSong}>
          <FaBackward />
        </Button>
        <Button onClick={playPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>
        <Button onClick={nextSong}>
          <FaForward />
        </Button>
      </Controls>
    </MusicPlayerContainer>
  );
};

export default MusicPlayer;
