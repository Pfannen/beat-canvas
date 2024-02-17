export const createAppend = (
	root: XMLDocument,
	parent: Element,
	childName: string
) => {
	const child = root.createElement(childName);
	parent.appendChild(child);
	return child;
};
