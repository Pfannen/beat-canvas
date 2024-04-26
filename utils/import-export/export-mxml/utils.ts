import { ParentElementStore } from '@/types/import-export/export-mxml';

export const createXMLElement = (name: string) => {
	return document.createElement(name) as Element;
};

export const appendElement = (parent: Element, child: Element) => {
	parent.appendChild(child);
};

export const appendElements = (
	parent: Element,
	children: (Element | undefined | null)[]
) => {
	children.forEach((el) => {
		if (el) appendElement(parent, el);
	});
};

export const addParentElement = <K extends keyof ParentElementStore>(
	parentStore: ParentElementStore,
	parent: K
) => {
	if (!parentStore[parent])
		parentStore[parent] = document.createElement(parent as string);
};

export const assignToParent = <T extends ParentElementStore, K extends keyof T>(
	parent: K,
	parentStore: T,
	elements: Element[]
) => {
	addParentElement(parentStore, parent as string);
	appendElements(parentStore[parent]!, elements);
};

export const createMusicXMLDocument = () => {
	const header =
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise><score-partwise></score-partwise>';
	const root = new DOMParser().parseFromString(header, 'application/xml');

	const scoreXML = root.querySelector('score-partwise')!;
	scoreXML.setAttribute('version', '4.0');

	/* const workXML = createAppend(root, scoreXML, 'work');
	const workTitleXML = createAppend(root, workXML, 'work-title');
	workTitleXML.textContent = scoreTitle; */

	return [root, scoreXML] as [Document, Element];
};

export const createDirectionTypeEl = () => createXMLElement('direction-type');
