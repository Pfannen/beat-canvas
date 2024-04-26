import { MeasureAttributes } from '../music';
import { NoteAnnotations } from '../music/note-annotations';

// NOTE: Every time 'element' is referenced, it's referencing the 'Element' class / interface used to construct
// XML and HTML elements

// Creates the MXML element for item
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

// An object that points from a parent element's name to the parent element
// Example: A measure XML element has 'attributes' and 'direction' elements that parent measure attributes
// { attributes: attributesEl, direction: directionEl } would be the parent element map for measure attributes
// NOTE: Optional keys are used so a blank object can be constructed initially and can be populated when they are needed
export type ParentElementStore<T extends string = string> = {
	[key in T]?: Element;
};

// A function that receives a parent store and the elements to append to the correct one(s)
export type ParentElementAssigner<T extends ParentElementStore> = (
	parentStore: T,
	elements: Element[]
) => void;

// Maps the keys of an object (T) to their parent element assigners
export type ParentElementAssignerMap<T, U extends ParentElementStore> = {
	[key in keyof T]: ParentElementAssigner<U>;
};

export type AnnotationPEC<K extends keyof NoteAnnotations> =
	PropertyElementCreator<Required<NoteAnnotations>, K>;

export type AnnotationsParentElementName =
	| 'notations'
	| 'articulations'
	| 'note';

export type AnnotationsParentStore =
	ParentElementStore<AnnotationsParentElementName>;

export type AnnotationPEA = ParentElementAssigner<AnnotationsParentStore>;

export type AnnotationsPEAMap = ParentElementAssignerMap<
	Required<NoteAnnotations>,
	AnnotationsParentStore
>;

export type AttributePEC<K extends keyof MeasureAttributes> =
	PropertyElementCreator<MeasureAttributes, K>;

export type AttributesParentElementName =
	| 'attributes'
	| 'direction'
	| 'barline'
	| 'measure';

export type AttributesParentStore =
	ParentElementStore<AttributesParentElementName>;

export type AttributePEA = ParentElementAssigner<AttributesParentStore>;

export type AttributesPEAMap = ParentElementAssignerMap<
	Required<MeasureAttributes>,
	AttributesParentStore
>;
