import { VideoType } from 'src/selenium/providers/video.service';

interface GenreInterface {
  name: string;
  slug: string;
  key: number;
}

interface TypeInterface {
  name: string;
  slug: string;
  key: string;
}

interface QualityInterface {
  name: string;
  slug: string;
  key: string;
}

export interface OptionsInterface {
  genres: GenreInterface[];
  types: TypeInterface[];
  qualities: QualityInterface[];
}

export enum GenreSlugs {
  ACTION = 'action',
  ADVENTURE = 'adventure',
  ANIMATION = 'animation',
  BIOGRAPHY = 'biography',
  COSTUME = 'costume',
  COMEDY = 'comedy',
  CRIME = 'crime',
  DOCUMENTARY = 'documentary',
  DRAMA = 'drama',
  FAMILY = 'family',
  FANTASY = 'fantasy',
  GAME_SHOW = 'game-show',
  HISTORY = 'history',
  HORROR = 'horror',
  KUNG_FU = 'kung-fu',
  MUSIC = 'music',
  MYSTERY = 'mystery',
  REALITY_TV = 'reality-tv',
  ROMANCE = 'romance',
  SCI_FI = 'sci-fi',
  SPORT = 'sport',
  THRILLER = 'thriller',
  TV_SHOW = 'tv-show',
  WAR = 'war',
  WESTERN = 'western',
}

export enum QualitySlugs {
  HD = 'hd',
  HD_DRIP = 'hd-rip',
  SD = 'sd',
  TS = 'ts',
  CAM = 'cam',
}

export const searchOptions: OptionsInterface = {
  genres: [
    { name: 'Action', slug: GenreSlugs.ACTION, key: 25 },
    { name: 'Adventure', slug: GenreSlugs.ADVENTURE, key: 17 },
    { name: 'Animation', slug: GenreSlugs.ANIMATION, key: 10 },
    { name: 'Biography', slug: GenreSlugs.BIOGRAPHY, key: 215 },
    { name: 'Costume', slug: GenreSlugs.COSTUME, key: 1693 },
    { name: 'Comedy', slug: GenreSlugs.COMEDY, key: 14 },
    { name: 'Crime', slug: GenreSlugs.CRIME, key: 26 },
    { name: 'Documentary', slug: GenreSlugs.DOCUMENTARY, key: 131 },
    { name: 'Drama', slug: GenreSlugs.DRAMA, key: 1 },
    { name: 'Family', slug: GenreSlugs.FAMILY, key: 43 },
    { name: 'Fantasy', slug: GenreSlugs.FANTASY, key: 31 },
    { name: 'Game Show', slug: GenreSlugs.GAME_SHOW, key: 212 },
    { name: 'History', slug: GenreSlugs.HISTORY, key: 47 },
    { name: 'Horror', slug: GenreSlugs.HORROR, key: 74 },
    { name: 'Kung fu', slug: GenreSlugs.KUNG_FU, key: 248 },
    { name: 'Music', slug: GenreSlugs.MUSIC, key: 199 },
    { name: 'Mystery', slug: GenreSlugs.MYSTERY, key: 64 },
    { name: 'Reality TV', slug: GenreSlugs.REALITY_TV, key: 4 },
    { name: 'Romance', slug: GenreSlugs.ROMANCE, key: 23 },
    { name: 'Sci-Fi', slug: GenreSlugs.SCI_FI, key: 15 },
    { name: 'Sport', slug: GenreSlugs.SPORT, key: 44 },
    { name: 'Thriller', slug: GenreSlugs.THRILLER, key: 7 },
    { name: 'TV Show', slug: GenreSlugs.TV_SHOW, key: 139 },
    { name: 'War', slug: GenreSlugs.WAR, key: 58 },
    { name: 'Western', slug: GenreSlugs.WESTERN, key: 28 },
  ],
  types: [
    {
      name: 'Movie',
      slug: VideoType.MOVIE,
      key: 'movie',
    },
    {
      name: 'TV Series',
      slug: VideoType.SERIES,
      key: 'series',
    },
  ],
  qualities: [
    { name: 'HD', slug: QualitySlugs.HD, key: 'HD' },
    { name: 'HDRip', slug: QualitySlugs.HD_DRIP, key: 'HDRip' },
    { name: 'SD', slug: QualitySlugs.SD, key: 'SD' },
    { name: 'TS', slug: QualitySlugs.TS, key: 'TS' },
    { name: 'CAM', slug: QualitySlugs.CAM, key: 'CAM' },
  ],
};
