import { MusicScore } from '../music';

export type FileScoreRetriever = (file: File) => Promise<MusicScore | null>;
