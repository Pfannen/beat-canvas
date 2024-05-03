import {
	Measure,
	Note,
	TimeSignature,
} from '@/components/providers/music/types';
import {
	Clef,
	MeasureAttributesMXML,
	MusicPart,
	MusicScore,
} from '@/types/music';
import { durationToNoteType, getYPosFromNote } from '../music';
import Helper from './helpers/ImportMusicXMLHelper';
import { convertImportedDuration } from '../musicXML';

// Out of commission
const getMeasureNotesJS = (
	measureXML: Element,
	quarterNoteDivisions: number,
	clef: Clef,
	timeSignature: TimeSignature
) => {
	const noteArr: Note[] = [];

	const noteXMLArr = Helper.getNoteXMLArray(measureXML);
	if (!noteXMLArr) return null;

	let curX = 0;
	const { beatNote, beatsPerMeasure } = timeSignature;
	for (let i = 0; i < noteXMLArr.length; i++) {
		const noteXML = noteXMLArr[i];
		const noteDetails = Helper.getNoteDetails(noteXML, {});

		const { pitch, octave, duration, annotations } = noteDetails;
		if (!duration) continue;

		const trueDuration = convertImportedDuration(
			quarterNoteDivisions,
			duration,
			beatNote
		);

		if (pitch && octave) {
			const note: Note = {
				x: curX,
				y: getYPosFromNote({ pitch, octave }, clef),
				type: durationToNoteType(trueDuration, beatNote),
			};
			if (annotations && Object.keys(annotations).length > 0)
				note.annotations = annotations;
			noteArr.push(note);
		}

		curX += trueDuration;
		// TODO: Address measures specifying multiple voices
		if (curX >= beatsPerMeasure) break;
	}

	return noteArr;
};

const getMeasuresJS = (part: Element) => {
	const measuresXML = Helper.getMeasureXMLArray(part);
	if (!measuresXML) return null;

	const measures: Measure[] = [];
	const curAttr = Helper.getDefaultMeasureAttributes();
	// to be completed attributes (wedge & repeats)
	const tbcValues = { measures: {}, notes: {} };

	for (let i = 0; i < measuresXML.length; i++) {
		const measureXML = measuresXML[i];
		const { temporalAttributes, notes, staticAttributes } =
			Helper.getMeasureDetails(measureXML, i, curAttr, tbcValues);

		const measure: Measure = {
			notes,
		};

		if (temporalAttributes.length > 0) {
			measure.temporalAttributes = temporalAttributes;
		}
		if (Object.keys(staticAttributes).length > 0) {
			measure.staticAttributes = staticAttributes;
		}

		measures.push(measure);
	}

	return measures;
};

export const musicXMLToJSON = (musicXML: XMLDocument) => {
	const docEl = musicXML.documentElement;
	const tagName = docEl.tagName;

	if (tagName !== 'score-partwise') {
		console.error("can't read anything other than score-partwise rn");
		return null;
	}

	const partsJS: MusicPart[] = [];
	const partAttributes = Helper.getPartAttributesArray(docEl);
	if (!partAttributes) return null;

	const partsXML = Helper.getPartsXMLArray(docEl);
	if (!partsXML) return null;

	for (let i = 0; i < partsXML.length; i++) {
		const partXML = partsXML[i];
		const measures = getMeasuresJS(partXML);
		if (!measures) return null;

		const attributes = partAttributes[i];
		partsJS.push({ attributes, measures });
	}

	const musicScore: MusicScore = {
		title: Helper.getScoreTitle(docEl) || 'Unknown Title',
		parts: partsJS,
	};

	console.log(musicScore);

	return musicScore;
};
