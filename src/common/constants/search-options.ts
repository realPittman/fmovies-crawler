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

interface CountryInterface {
  name: string;
  slug: string;
  key: number;
}

interface QualityInterface {
  name: string;
  slug: string;
  key: string;
}

export interface OptionsInterface {
  genres: GenreInterface[];
  types: TypeInterface[];
  countries: CountryInterface[];
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

export enum CountrySlugs {
  UNITED_STATES = 'united-states',
  UNITED_KINGDOM = 'united-kingdom',
  CANADA = 'canada',
  FRANCE = 'france',
  WEST_GERMANY = 'west-germany',
  JAPAN = 'japan',
  AUSTRALIA = 'australia',
  ITALY = 'italy',
  INTERNATIONAL = 'international',
  SPAIN = 'spain',
  HONG_KONG = 'hong-kong',
  CHINA = 'china',
  IRELAND = 'ireland',
  KOREA = 'korea',
  INDIA = 'india',
  BELGIUM = 'belgium',
  DENMARK = 'denmark',
  SWEDEN = 'sweden',
  NEW_ZEALAND = 'new-zealand',
  NETHERLANDS = 'netherlands',
  SOUTH_AFRICA = 'south-africa',
  NORWAY = 'norway',
  MEXICO = 'mexico',
  SWITZERLAND = 'switzerland',
  AUSTRIA = 'austria',
  CZECH_REPUBLIC = 'czech-republic',
  BRAZIL = 'brazil',
  RUSSIA = 'russia',
  ARGENTINA = 'argentina',
  HUNGARY = 'hungary',
  POLAND = 'poland',
  FINLAND = 'finland',
  ISRAEL = 'israel',
  ROMANIA = 'romania',
  LUXEMBOURG = 'luxembourg',
  THAILAND = 'thailand',
  TAIWAN = 'taiwan',
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
  countries: [
    // TODO: write country names
    { name: '', slug: CountrySlugs.UNITED_STATES, key: 2 },
    { name: '', slug: CountrySlugs.UNITED_KINGDOM, key: 8 },
    { name: '', slug: CountrySlugs.CANADA, key: 181861 },
    { name: '', slug: CountrySlugs.FRANCE, key: 11 },
    { name: '', slug: CountrySlugs.WEST_GERMANY, key: 181873 },
    { name: '', slug: CountrySlugs.JAPAN, key: 36 },
    { name: '', slug: CountrySlugs.AUSTRALIA, key: 181851 },
    { name: '', slug: CountrySlugs.ITALY, key: 181857 },
    { name: '', slug: CountrySlugs.INTERNATIONAL, key: 18 },
    { name: '', slug: CountrySlugs.SPAIN, key: 181871 },
    { name: '', slug: CountrySlugs.HONG_KONG, key: 2630 },
    { name: '', slug: CountrySlugs.CHINA, key: 108 },
    { name: '', slug: CountrySlugs.IRELAND, key: 181862 },
    { name: '', slug: CountrySlugs.KOREA, key: 79 },
    { name: '', slug: CountrySlugs.INDIA, key: 34 },
    { name: '', slug: CountrySlugs.BELGIUM, key: 181849 },
    { name: '', slug: CountrySlugs.DENMARK, key: 181855 },
    { name: '', slug: CountrySlugs.SWEDEN, key: 181883 },
    { name: '', slug: CountrySlugs.NEW_ZEALAND, key: 181847 },
    { name: '', slug: CountrySlugs.NETHERLANDS, key: 181848 },
    { name: '', slug: CountrySlugs.SOUTH_AFRICA, key: 181850 },
    { name: '', slug: CountrySlugs.NORWAY, key: 181901 },
    { name: '', slug: CountrySlugs.MEXICO, key: 181852 },
    { name: '', slug: CountrySlugs.SWITZERLAND, key: 181869 },
    { name: '', slug: CountrySlugs.AUSTRIA, key: 181882 },
    { name: '', slug: CountrySlugs.CZECH_REPUBLIC, key: 181859 },
    { name: '', slug: CountrySlugs.BRAZIL, key: 181867 },
    { name: '', slug: CountrySlugs.RUSSIA, key: 181860 },
    { name: '', slug: CountrySlugs.ARGENTINA, key: 181863 },
    { name: '', slug: CountrySlugs.HUNGARY, key: 181876 },
    { name: '', slug: CountrySlugs.POLAND, key: 181880 },
    { name: '', slug: CountrySlugs.FINLAND, key: 181877 },
    { name: '', slug: CountrySlugs.ISRAEL, key: 181887 },
    { name: '', slug: CountrySlugs.ROMANIA, key: 181895 },
    { name: '', slug: CountrySlugs.LUXEMBOURG, key: 181878 },
    { name: '', slug: CountrySlugs.THAILAND, key: 94 },
    { name: '', slug: CountrySlugs.TAIWAN, key: 1434 },
  ],
  qualities: [
    { name: 'HD', slug: QualitySlugs.HD, key: 'HD' },
    { name: 'HDRip', slug: QualitySlugs.HD_DRIP, key: 'HDRip' },
    { name: 'SD', slug: QualitySlugs.SD, key: 'SD' },
    { name: 'TS', slug: QualitySlugs.TS, key: 'TS' },
    { name: 'CAM', slug: QualitySlugs.CAM, key: 'CAM' },
  ],
};
