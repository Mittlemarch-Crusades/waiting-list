"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/mittlemarch-theme.mp3";
const INITIAL_VOLUME = 0.35;

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(INITIAL_VOLUME);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = INITIAL_VOLUME;
    audio.muted = true;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayback = async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      if (!enabled) {
        audioRef.current.muted = false;
        setEnabled(true);
      }

      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const enableMusic = async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      audioRef.current.muted = false;
      await audioRef.current.play();
      setEnabled(true);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="panel gold-frame w-full max-w-md p-5">
      <p className="text-xs uppercase tracking-[0.32em] text-amber-200/80">Atmosphere</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={togglePlayback}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/25 bg-amber-300/10 text-amber-100 transition hover:border-amber-100/45 hover:bg-amber-300/20"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.26em] text-stone-200">Mittlemarch Theme</p>
          <p className="mt-1 text-sm text-stone-400">
            {enabled ? "Music enabled" : "Autoplay muted until you awaken the score"}
          </p>
        </div>

        <button type="button" onClick={enableMusic} className="button-secondary !px-4 !py-2 text-xs">
          Enable Music
        </button>
      </div>

      <label className="mt-5 flex items-center gap-3 text-stone-300">
        <VolumeIcon />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-300"
          aria-label="Music volume"
        />
      </label>

      <p className="mt-4 text-xs leading-relaxed text-stone-500">
        Tavern Brawl by Alexander Nakarada ft. Kevin MacLeod |{" "}
        <a
          href="https://creatorchords.com"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-stone-300"
        >
          creatorchords.com
        </a>
        <br />
        Music promoted by{" "}
        <a
          href="https://www.chosic.com/free-music/all/"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-stone-300"
        >
          chosic.com/free-music/all
        </a>
        <br />
        Creative Commons CC BY 4.0
        <br />
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-stone-300"
        >
          creativecommons.org/licenses/by/4.0
        </a>
      </p>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] translate-x-0.5 fill-current">
      <path d="M8 6.2v11.6c0 .7.8 1.2 1.4.8l8.4-5.8a1 1 0 0 0 0-1.6L9.4 5.4A1 1 0 0 0 8 6.2Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
      <path d="M7 5.5A1.5 1.5 0 0 1 8.5 4h1A1.5 1.5 0 0 1 11 5.5v13A1.5 1.5 0 0 1 9.5 20h-1A1.5 1.5 0 0 1 7 18.5v-13Zm6 0A1.5 1.5 0 0 1 14.5 4h1A1.5 1.5 0 0 1 17 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 13 18.5v-13Z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current text-amber-100">
      <path d="M10.3 5.5a1 1 0 0 1 1.7.7v11.6a1 1 0 0 1-1.7.7L6.7 15H4.5A1.5 1.5 0 0 1 3 13.5v-3A1.5 1.5 0 0 1 4.5 9h2.2l3.6-3.5ZM16.9 8.2a1 1 0 0 1 1.4 0 5.3 5.3 0 0 1 0 7.5 1 1 0 1 1-1.4-1.4 3.3 3.3 0 0 0 0-4.7 1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}
