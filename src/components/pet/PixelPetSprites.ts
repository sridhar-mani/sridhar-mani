/**
 * Procedural Pixel Art Sprite Matrices for "Byte" the Portfolio Pet
 * '.' = transparent
 * 'O' = outline (dark slate)
 * 'F' = primary fur
 * 'S' = shadow / belly
 * 'E' = eyes
 * 'A' = accent / neon highlight
 * 'H' = heart / pink
 */

export type SpriteMatrix = string[];

export interface PetPalette {
  O: string;
  F: string;
  S: string;
  E: string;
  A: string;
  H: string;
  [key: string]: string;
}

export const CAT_PALETTE: PetPalette = {
  O: '#1E293B', // Slate 800
  F: '#F97316', // Vibrant Orange / Calico
  S: '#FED7AA', // Cream belly
  E: '#0284C7', // Cyan eyes
  A: '#06B6D4', // Neon cyber collar
  H: '#F43F5E', // Pink heart/nose
};

export const SHIBA_PALETTE: PetPalette = {
  O: '#1E293B',
  F: '#EAB308', // Shiba Gold
  S: '#FEF08A', // Light cream
  E: '#0F172A', // Dark eyes
  A: '#8B5CF6', // Purple cyber collar
  H: '#EC4899',
};

// Baby Stage (12x12)
export const BABY_CAT_FRAMES: Record<string, SpriteMatrix[]> = {
  idle: [
    [
      "..OO....OO..",
      ".OFFO..OFFO.",
      ".OFFFFFFFO..",
      "OFFEFFFFEFO.",
      "OFFEFFFFEFO.",
      "OFFFHFFHFFO.",
      ".OFFFFFFFO..",
      "..OFFFSFFO..",
      "..OFFFFFSO..",
      "..OFAAAAFO..",
      "...OOOOOO...",
      "............",
    ],
    [
      "..OO....OO..",
      ".OFFO..OFFO.",
      ".OFFFFFFFO..",
      "OFFEFFFFEFO.",
      "OFFEFFFFEFO.",
      "OFFFHFFHFFO.",
      ".OFFFFFFFO..",
      "..OFFSSFFO..",
      "..OFFFSFSO..",
      "..OFAAAAFO..",
      "...OOOOOO...",
      "............",
    ],
  ],
  happy: [
    [
      "..OO....OO..",
      ".OFFO..OFFO.",
      ".OFFFFFFFO..",
      "OFF^FFFF^FO.",
      "OFF-FFFF-FO.",
      "OFFFHHFFFO..",
      ".OFFFFFFFO..",
      "..OFFSSSFO..",
      "..OFAAAAFO..",
      "...OO..OO...",
      "............",
      "............",
    ],
  ],
  sleep: [
    [
      "............",
      "..OO....OO..",
      ".OFFFFFFFO..",
      ".OF--FF--FO.",
      "OFFFFFFFO...",
      "OFFFHHFFFO..",
      ".OFFSSSSFO..",
      "..OOOOOO....",
      "............",
      "............",
      "............",
      "............",
    ],
  ],
};

// Adult Cat Stage (16x16)
export const ADULT_CAT_FRAMES: Record<string, SpriteMatrix[]> = {
  idle: [
    [
      "...OO......OO...",
      "..OFFO....OFFO..",
      ".OFFFFO..OFFFFO.",
      ".OFFFFFFFFFFFFO.",
      "OFFEFFFFFFEFFFFO",
      "OFFEEFFFFEEFFFFO",
      "OFFEAFFFFEAFFFFO",
      "OFFFFFFHFFFFFFFO",
      ".OFFFFFFFFFFFFO.",
      "..OFFFAAAFAFFO..",
      "..OFFSSSSSSFFO..",
      "..OFFSSSSSSFFO..",
      "..OFFSSSSSSFFO.O",
      "...OFFFFFFFO..OO",
      "...OFO..OFO..OO.",
      "....OO..OO..OO..",
    ],
    [
      "...OO......OO...",
      "..OFFO....OFFO..",
      ".OFFFFO..OFFFFO.",
      ".OFFFFFFFFFFFFO.",
      "OFFEFFFFFFEFFFFO",
      "OFFEEFFFFEEFFFFO",
      "OFFEEFFFFEEFFFFO",
      "OFFFFFFHFFFFFFFO",
      ".OFFFFFFFFFFFFO.",
      "..OFFFAAAFAFFO..",
      "..OFFSSSSSSFFO..",
      "..OFFSSSSSSFFO.O",
      "..OFFSSSSSSFFOO.",
      "...OFFFFFFFO.OO.",
      "...OFO..OFO.OO..",
      "....OO..OO......",
    ],
  ],
  happy: [
    [
      "...OO......OO...",
      "..OFFO....OFFO..",
      ".OFFFFO..OFFFFO.",
      ".OFFFFFFFFFFFFO.",
      "OFF^FFFFFF^FFFFO",
      "OFF-FFFFFF-FFFFO",
      "OFFFFFFHFFFFFFFO",
      ".OFFFFHHHFFFFFO.",
      "..OFFFAAAFAFFO..",
      "..OFFSSSSSSFFO.O",
      "..OFFSSSSSSFFOO.",
      "...OFFFFFFFO.OO.",
      "...OFO..OFO.....",
      "....OO..OO......",
      "................",
      "................",
    ],
  ],
  sleep: [
    [
      "................",
      "................",
      "...OO......OO...",
      "..OFFFFFFFFFO...",
      ".OFFFFFFFFFFFO..",
      ".OF--FFFFFF--FO.",
      "OFFFFFFHFFFFFFFO",
      ".OFFFAAAFAFFFO..",
      "..OFFSSSSSSFFO..",
      "..OFFFFFFFFFFO.O",
      "...OOOOOOOOOO.OO",
      ".............OO.",
      "................",
      "................",
      "................",
      "................",
    ],
  ],
};
