import { IndexEndTime } from '@/types/music/expand-measures';

export class IndexSeconds {
	private curIdx = 0;
	private maxEndTime = 0;
	private len = 0;

	constructor(private indexEndTimes: IndexEndTime[]) {
		this.len = this.indexEndTimes.length;
		if (this.len === 0) return;
		this.maxEndTime = this.indexEndTimes[this.len - 1].seconds;
		console.log({ indexEndTimes });
	}

	private iterateDown = (seconds: number) => {
		let i = this.curIdx;
		for (i; i >= 0; i--) {
			const { seconds: idxSeconds } = this.indexEndTimes[i];
			if (idxSeconds < seconds) {
				break;
			}
		}

		this.curIdx = i + 1;
	};

	private iterateUp = (seconds: number) => {
		let i = this.curIdx;
		for (i; i < this.indexEndTimes.length; i++) {
			const { seconds: idxSeconds } = this.indexEndTimes[i];
			if (idxSeconds > seconds) {
				break;
			}
		}

		this.curIdx = i;
	};

	getIndex = (seconds: number) => {
		if (seconds < 0 || seconds > this.maxEndTime || this.len === 0) return null;

		if (this.curIdx >= this.len) this.curIdx--;
		if (this.indexEndTimes[this.curIdx].seconds < seconds)
			this.iterateUp(seconds);
		else this.iterateDown(seconds);

		if (this.curIdx >= this.indexEndTimes.length) {
			this.curIdx--;
			return null;
		}
		return this.indexEndTimes[this.curIdx].index;
	};
}
