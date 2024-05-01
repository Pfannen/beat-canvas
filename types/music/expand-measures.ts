// Points from cumulative measure index to its true measure index
export type CumulativeMeasureMapping = {
	[key in number]: number;
};

// The true measure index is the array index, which stores the cummulative
// measure indices it's associated with
export type TrueMeasureMapping = number[][];

export type IndexEndTime = {
	index: number;
	seconds: number;
};
