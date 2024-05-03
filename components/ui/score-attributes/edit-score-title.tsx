import { FunctionComponent, useRef } from 'react';
import classes from './edit-score-title.module.css';
import { useMusic } from '@/components/providers/music';

interface EditScoreTitleProps {}

const EditScoreTitle: FunctionComponent<EditScoreTitleProps> = () => {
	const {
		scoreItems: { musicScore, setTitle },
	} = useMusic();
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={classes.edit_title}>
			<label htmlFor="score-title">Set Title: </label>
			<input
				type="text"
				id="score-title"
				defaultValue={musicScore.title}
				ref={inputRef}
				onBlur={(e) => {
					if (!e.target.value) inputRef.current!.value = musicScore.title;
					else setTitle(e.target.value);
				}}
			/>
		</div>
	);
};

export default EditScoreTitle;
