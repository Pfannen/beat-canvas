import { Measure, Note } from '@/components/providers/music/types';

const getSlurIds = (start: boolean, note: Note) => {
	if (!note.annotations || !note.annotations.slur) return null;
	const { slur } = note.annotations;

	let slurIds: Set<number>;
	if (start) {
		if (!slur.start) return null;
		else slurIds = new Set([slur.start]);
	} else {
		if (!slur.stop) return null;
		else slurIds = new Set([...slur.stop]);
	}

	return slurIds;
};
const getMatchedId = (ids1: Set<number> | null, ids2: Set<number> | null) => {
	if (ids1 && ids2) {
		for (const id of ids1) {
			if (ids2.has(id)) return id;
		}
	}

	return null;
};

export type SlurMatch = {
	matchedId: number;
	note1Start: boolean;
};

export const getSlurMatch = (note1: Note, note2: Note): SlurMatch | null => {
	// Get the start slur ids for note 1 and stop slur ids for note 2
	const note1StartIds = getSlurIds(true, note1);
	const note2StopIds = getSlurIds(false, note2);

	// If there's a match, return the matched id and if note 1 started the slur
	let matchedId = getMatchedId(note1StartIds, note2StopIds);
	if (matchedId !== null) return { matchedId, note1Start: true };

	// If we make it here, the notes weren't slurred
	const note1StopIds = getSlurIds(false, note1);
	const note2StartIds = getSlurIds(true, note2);

	// If there's a match, return the matched id and if note 1 started the slur
	matchedId = getMatchedId(note1StopIds, note2StartIds);
	if (matchedId !== null) return { matchedId, note1Start: false };

	// There was no match, so null is returned
	return null;
};

export const notesAreSlurred = (note1: Note, note2: Note) => {
	return !!getSlurMatch(note1, note2);
};

// #region Not currently used - not sure if methods are correct

const getSourceNote = (
	noteIndex: number,
	measureIndex: number,
	measures: Measure[]
) => {
	if (measureIndex < 0 || measureIndex >= measures.length) return null;

	const { notes } = measures[measureIndex];
	if (noteIndex < 0 || noteIndex >= notes.length) return null;

	const sourceNote = notes[noteIndex];
	return sourceNote;
};

const getMatchedSlurIds = (
	start: boolean,
	note: Note,
	sourceSlurIds: Set<number>
) => {
	const targetSlurIds = getSlurIds(start, note);
	if (!targetSlurIds) return null;

	const matchedSlurIds = new Set<number>();
	for (const id of sourceSlurIds) {
		if (targetSlurIds.has(id)) matchedSlurIds.add(id);
	}

	return matchedSlurIds;
};

const getNoteIndexStart = (
	curMeasureIndex: number,
	startMeasureIndex: number,
	startNoteIndex: number,
	notesLen: number,
	start: boolean
) => {
	if (curMeasureIndex !== startMeasureIndex) return start ? 0 : notesLen - 1;
	else return startNoteIndex;
};

export type MatchedSlurredNote = {
	note: Note;
} & ({ start: number[] } | { stop: number[] });

export const findAttachedNotesOfSlur = (
	sourceNoteIndex: number,
	sourceMeasureIndex: number,
	measures: Measure[],
	start = true
) => {
	const sourceNote = getSourceNote(
		sourceNoteIndex,
		sourceMeasureIndex,
		measures
	);
	if (!sourceNote || !sourceNote.annotations) return null;

	const sourceSlurIds = getSlurIds(start, sourceNote);
	if (!sourceSlurIds) return null;

	const add = start ? 1 : -1;
	const matchedNotes: MatchedSlurredNote[] = [];

	for (
		let mIdx = sourceMeasureIndex;
		mIdx >= 0 && mIdx < measures.length;
		mIdx += add
	) {
		const { notes } = measures[mIdx];
		const nIdxStart = getNoteIndexStart(
			mIdx,
			sourceMeasureIndex,
			sourceNoteIndex,
			notes.length,
			start
		);
		for (let nIdx = nIdxStart; nIdx >= 0 && nIdx < notes.length; nIdx += add) {
			const note = notes[nIdx];
			const matchedIds = getMatchedSlurIds(!start, note, sourceSlurIds);
			if (matchedIds) {
				if (start) {
					matchedNotes.push({ note, stop: [...matchedIds] });
				} else {
					matchedNotes.push({ note, start: [...matchedIds] });
				}
			}
		}
	}

	return matchedNotes;
};

// #endregion
