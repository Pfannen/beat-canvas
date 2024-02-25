export const createAppend = (
	root: XMLDocument,
	parent: Element,
	childName: string
) => {
	const child = root.createElement(childName);
	parent.appendChild(child);
	return child;
};

export const validateElements = (
	elements: (Element | null)[],
	checkTextContent = false
) => {
	for (const element of elements) {
		if (!element) return false;
		if (checkTextContent && !element.textContent) return false;
	}

	return true;
};

export const getElements = (
	parent: Element,
	elementName: string,
	triggerError = true
) => {
	const elements = parent.getElementsByTagName(elementName);
	if (elements.length === 0) {
		if (triggerError) console.error(`couldn't get elements for ${elementName}`);
		return null;
	} else return elements;
};

export const getSingleElement = (
	parent: Element,
	query: string,
	textContentChek = false
) => {
	const element = parent.querySelector(query);
	if (!element || (textContentChek && !element.textContent)) return null;

	return element;
};

export const verifyTagName = (element: Element, expectedTagName: string) => {
	return element.tagName === expectedTagName;
};
