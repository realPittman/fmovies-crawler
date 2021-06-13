interface Genre {
  name: string;
  slug: string;
  key: string | number;
}

interface Type {
  name: string;
  slug: string;
  key: string;
}

interface Quality {
  name: string;
  slug: string;
  key: string;
}

export interface Options {
  genres: Genre[];
  types: Type[];
  qualities: Quality[];
}

export const searchOptions: Options = {
  genres: [
    { name: 'All', slug: 'all', key: 'and' },
    { name: 'Action', slug: 'action', key: 25 },
    { name: 'Adventure', slug: 'adventure', key: 17 },
    { name: 'Animation', slug: 'animation', key: 10 },
    { name: 'Biography', slug: 'biography', key: 215 },
    { name: 'Costume', slug: 'costume', key: 1693 },
    { name: 'Comedy', slug: 'comedy', key: 14 },
    { name: 'Crime', slug: 'crime', key: 26 },
    { name: 'Documentary', slug: 'documentary', key: 131 },
    { name: 'Drama', slug: 'drama', key: 1 },
    { name: 'Family', slug: 'family', key: 43 },
    { name: 'Fantasy', slug: 'fantasy', key: 31 },
    { name: 'Game Show', slug: 'game-show', key: 212 },
    { name: 'History', slug: 'history', key: 47 },
    { name: 'Horror', slug: 'horror', key: 74 },
    { name: 'Kung fu', slug: 'Kung-fu', key: 248 },
    { name: 'Music', slug: 'music', key: 199 },
    { name: 'Mystery', slug: 'mystery', key: 64 },
    { name: 'Reality TV', slug: 'reality-tv', key: 4 },
    { name: 'Romance', slug: 'romance', key: 23 },
    { name: 'Sci-Fi', slug: 'sci-fi', key: 15 },
    { name: 'Sport', slug: 'sport', key: 44 },
    { name: 'Thriller', slug: 'thriller', key: 7 },
    { name: 'TV Show', slug: 'tv-show', key: 139 },
    { name: 'War', slug: 'war', key: 58 },
    { name: 'Western', slug: 'western', key: 28 },
  ],
  types: [
    {
      name: 'Movie',
      slug: 'movie',
      key: 'movie',
    },
    {
      name: 'TV Series',
      slug: 'tv-series',
      key: 'series',
    },
  ],
  qualities: [
    { name: 'HD', slug: 'hd', key: 'HD' },
    { name: 'HDRip', slug: 'hd-rip', key: 'HDRip' },
    { name: 'SD', slug: 'sd', key: 'SD' },
    { name: 'TS', slug: 'ts', key: 'TS' },
    { name: 'CAM', slug: 'cam', key: 'CAM' },
  ],
};
