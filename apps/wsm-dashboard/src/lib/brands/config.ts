export const BRAND_CONFIGS = {
  BOOSTER: {
    pixelId: process.env.META_PIXEL_ID_BOOSTER || process.env.META_PIXEL_ID,
    token: process.env.META_TOKEN_BOOSTER || process.env.META_ACCESS_TOKEN,
  },
  FUNNY: {
    pixelId: process.env.META_PIXEL_ID_FUNNY,
    token: process.env.META_TOKEN_FUNNY,
  },
  DINO: {
    pixelId: process.env.META_PIXEL_ID_DINO,
    token: process.env.META_TOKEN_DINO,
  },
  TLAB: {
    pixelId: process.env.META_PIXEL_ID_TLAB,
    token: process.env.META_TOKEN_TLAB,
  }
} as const;

export type BrandName = keyof typeof BRAND_CONFIGS;
