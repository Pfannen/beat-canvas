import { MusicPart } from '@/types/music';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';
import {
	appendElement,
	appendElements,
	assignToParent,
	createXMLElement,
} from './utils';
import { noteEC } from './note-helpers';
import { AttributesPEAMap } from '@/types/import-export/export-mxml';



const assignToMeasureParent = assignToParent.bind(null, 'measure');
const assignToDirectionParent = assignToParent.bind(null, 'direction');
const assignToAttributesParent = assignToParent.bind(null, 'attributes');
const assignToBarLineParent = assignToParent.bind(null, 'barline');

const attributesPEAMap: AttributesPEAMap = {
	clef: assignToAttributesParent,
	dynamic: assignToDirectionParent,
	keySignature: assignToAttributesParent,
	metronome: assignToDirectionParent,
	repeat: assignToBarLineParent,
	repeatEndings: assignToBarLineParent,
	timeSignature: assignToAttributesParent,
	wedge: assignToDirectionParent,
};
