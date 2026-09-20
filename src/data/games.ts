import gamesSeed from "./all-games-seed.json";

const cardImages = import.meta.glob<string>("../assets/games/*-card.jpg", {
  eager: true,
  import: "default",
  query: "?url",
});

export interface GameCardData {
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly price: string;
  readonly shortDescription: string;
  readonly image: string;
  readonly rating: number;
  readonly likesCount: number;
  readonly featured: boolean;
}

const getGameImage = (slug: string): string => {
  const imagePath = `../assets/games/${slug}-card.jpg`;
  const image = cardImages[imagePath];

  if (image === undefined) {
    throw new Error(`Image not found for game: ${slug}`);
  }

  return image;
};

export const allGames: readonly GameCardData[] = gamesSeed.data.map(
  (game): GameCardData => ({
    slug: game.slug,
    name: game.name,
    category: game.category,
    price: game.price,
    shortDescription: game.shortDescription,
    image: getGameImage(game.slug),
    rating: game.rating,
    likesCount: game.likesCount,
    featured: game.featured,
  }),
);

export const featuredGames: readonly GameCardData[] = allGames.filter(
  (game) => game.featured,
);
