import Ajv, { ValidateFunction } from 'ajv';
import MusicScoreSchema from './music-score';
import { MusicScore } from '@/types/music';

const ajv = new Ajv();

let scoreValidator: ValidateFunction<MusicScore>;

export const validateMusicScore = (score: any) => {
	if (!scoreValidator)
		scoreValidator = ajv.compile<MusicScore>(MusicScoreSchema);

	const isMusicScore = scoreValidator(score);
	if (!isMusicScore) console.log({ errors: scoreValidator.errors, score });
	return isMusicScore;
};
