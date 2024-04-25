import { MeasureAttributes } from '../music';
import { NoteAnnotations } from '../music/note-annotations';

export type ElementCreator<T> = (item: T) => Element[];

// Creates the MusicXML element that corresponds to K of T
// Example: PropertyElementCreator<MeasureAttributes, 'wedge'> would give the wedge MusicXML element for the given wedge
export type PropertyElementCreator<T, K extends keyof T> = (
	scoreItem: T[K]
) => Element[];

// Maps an object's (T) keys to PropertyElementCreators that are meant to process the key
// Example: { dotted: PropertyElementCreator<NoteAnnotations, 'dotted'> } will return the MusicXML element for the given dotted annotations
export type PropertyElementCreatorMap<T> = {
	[key in keyof T]: PropertyElementCreator<T, key>;
};

export type AnnotationPEC<K extends keyof NoteAnnotations> =
	PropertyElementCreator<NoteAnnotations, K>;

export type AttributePEC<K extends keyof MeasureAttributes> =
	PropertyElementCreator<MeasureAttributes, K>;
