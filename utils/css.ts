export const concatClassNames = (
	...classNames: (string | undefined | false)[]
) => {
	return classNames
		.filter((val) => !!val)
		.join(' ')
		.trim();
};

export const reactModalStyles: ReactModal.Styles = {
	content: {
		padding: 0,
		maxWidth: 1500,
		marginInline: 'auto',
		backgroundColor: 'var(--surface-primary)',
		height: 'fit-content',
		marginBlock: 'auto',
		border: 'none',
	},
};
