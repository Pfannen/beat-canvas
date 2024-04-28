import {
	DurationAttributeInfo,
	DurationAttributeInfoUpdater,
	DurationAttributeKey,
	DurationInfoUpdaterReturn,
	EndDurationInfo,
	OptionalLocationProperties,
	SlurDurationInfo,
	TBCDurationAttributeInfo,
	WedgeDurationInfo,
} from '@/types/music/measure-traversal';
import { slurIdsAreSlurred } from '../../modify-score/slur';

/* const createDurationAttributeItem = <K extends DurationAttributeKey>(
	tbcInfo: TBCDurationAttributeInfo[K],
	completedInfo?: EndDurationInfo
) => {
	const returnVal = { ...tbcInfo, ...completedInfo };
	return returnVal as TBCDurationAttributeInfo[K] & EndDurationInfo;
}; */

const updateMinMaxYPos = (
	info: { maxYPos: number; minYPos: number },
	y: number
) => {
	info.maxYPos = Math.max(info.maxYPos, y);
	info.minYPos = Math.min(info.minYPos, y);
};

const updateSlurDurationInfo: DurationAttributeInfoUpdater<'slur'> = (
	durEntry,
	slur,
	measureIndex,
	x,
	seconds,
	note
) => {
	if (!note) return { updatedEntry: durEntry };

	let updatedEntry = durEntry;
	const completedEntries: SlurDurationInfo[] = [];
	// If a slur exists
	if (slur) {
		// If the current slur is a stop slur and there's at least 1 tbc slur
		if (slur.stop && durEntry) {
			// This stop slur *should* be a match for an existing slur, so we filter durEntry
			updatedEntry = durEntry.filter((entry) => {
				updateMinMaxYPos(entry, note.y);
				// If the entry's slur id matches one in the current slur's stop array
				if (slurIdsAreSlurred(entry.slurId, slur.stop!)) {
					// We have a completed slur
					completedEntries.push({
						...entry,
						measureEndIndex: measureIndex,
						xEnd: x,
						secondsEnd: seconds,
						endNoteYPos: note.y,
					});
					// And we want to filter the current entry out of all the entries
					return false;
				}
				// Else since the current entry's slur id wasn't in the current slur's stop array, we keep it
				else return true;
			});
		}
		// If the current slur is a start slur, we need to add it to the entries
		if (slur.start) {
			if (!updatedEntry) updatedEntry = [];
			updatedEntry.push({
				maxYPos: note.y,
				minYPos: note.y,
				measureStartIndex: measureIndex,
				xStart: x,
				secondsStart: seconds,
				startNoteYPos: note.y,
				slurId: slur.start,
			});
		}
	}
	// Else since a slur doesn't exist, we need to update each tbc slur's min max ypos
	else {
		durEntry?.forEach((entry) => updateMinMaxYPos(entry, note.y));
	}

	const updates: DurationInfoUpdaterReturn<'slur'> = { updatedEntry };
	if (completedEntries.length) updates.completed = completedEntries;

	return updates;
};

const updateWedgeDurationInfo: DurationAttributeInfoUpdater<'wedge'> = (
	durEntry,
	wedge,
	measureIndex,
	x,
	seconds
) => {
	if (!wedge) return { updatedEntry: durEntry };

	let updatedEntry = durEntry;
	let completedEntry: WedgeDurationInfo | undefined = undefined;

	if (wedge.start) {
		updatedEntry = {
			measureStartIndex: measureIndex,
			xStart: x,
			secondsStart: seconds,
			crescendo: wedge.crescendo,
		};
	} else if (durEntry) {
		completedEntry = {
			...durEntry,
			measureEndIndex: measureIndex,
			xEnd: x,
			secondsEnd: seconds,
		};
		durEntry = undefined;
	}

	const updates: DurationInfoUpdaterReturn<'wedge'> = {
		updatedEntry,
	};
	if (completedEntry) updates.completed = completedEntry;

	return updates;
};

export const updateDurationStore = (
	durStore: TBCDurationAttributeInfo,
	measureIndex: number,
	x: number,
	seconds: number,
	optionals?: OptionalLocationProperties
): DurationAttributeInfo | null => {
	if (!optionals) return null;

	const { note, newAttributes } = optionals;
	const completedInfo: DurationAttributeInfo = {};

	// If we have a note, look for a slur
	// If we have a slur stop, there should be at least 1 slur in durStore
	// getSlurDurInfo
	// If we have a slur start, we need to add to durStore

	if (note) {
		const { updatedEntry, completed } = updateSlurDurationInfo(
			durStore.slur,
			note.annotations?.slur,
			measureIndex,
			x,
			seconds,
			note
		);
		durStore.slur = updatedEntry;
		if (completed) completedInfo.slur = completed;
	}

	// If we have attributes, look for a wedge
	// If we have an ending wedge, there should be 1 wedge in durStore
	// getWedgeDurInfo
	// If we have a wedge start, we need to add to durStore

	if (newAttributes && newAttributes.wedge) {
		const { updatedEntry, completed } = updateWedgeDurationInfo(
			durStore.wedge,
			newAttributes.wedge,
			measureIndex,
			x,
			seconds
		);
		durStore.wedge = updatedEntry;
		if (completed) completedInfo.wedge = completed;
	}
	if (Object.keys(completedInfo).length > 0) return completedInfo;
	else return null;
};
