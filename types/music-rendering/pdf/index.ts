export type PageDimensions = { width: number; height: number };

export type InlineDirection<T> = { left: T; right: T };

export type BlockDirection<T> = { top: T; bottom: T };

export type Margins<T = number> = InlineDirection<T> & BlockDirection<T>;
