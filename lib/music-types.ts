export type MusicTrack = {
  title: string;
  artist: string;
  url: string;
  cover: string;
};

export type ResolvedMusicTrack = MusicTrack & { ascii: string };

export type MusicPlaylist<TTrack extends MusicTrack = MusicTrack> = {
  title: string;
  bg: number;
  tracks: TTrack[];
};

export type ResolvedMusicPlaylist = MusicPlaylist<ResolvedMusicTrack>;
