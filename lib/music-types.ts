export type MusicTrack = {
  title: string;
  artist: string;
  url: string;
};

export type ResolvedMusicTrack = MusicTrack & { ascii: string };
