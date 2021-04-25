import { createContext, useState, ReactNode, useContext } from "react";

type PlayerContextProps = {
  children: ReactNode;
};
type Episode = {
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
};
type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNextEpisode: boolean;
  hasPreviousEpisode: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffling: () => void;
  setPlayingState: (state: boolean) => void;
  playNextEpisode: () => void;
  playPreviousEpisode: () => void;
  clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProps) {
  const [episodeList, setEpisodeList] = useState([] as Episode[]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }
  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  function toggleLoop() {
    setIsLooping(!isLooping);
  }
  function toggleShuffling() {
    setIsShuffling(!isShuffling);
  }
  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  const hasPreviousEpisode = currentEpisodeIndex > 0;
  const hasNextEpisode =
    isShuffling || currentEpisodeIndex + 1 < episodeList.length;

  function playNextEpisode() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      );
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNextEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }
  function playPreviousEpisode() {
    if (hasPreviousEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        play,
        playList,
        togglePlay,
        toggleLoop,
        toggleShuffling,
        setPlayingState,
        playNextEpisode,
        playPreviousEpisode,
        hasNextEpisode,
        hasPreviousEpisode,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};
