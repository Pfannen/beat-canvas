import { IndexEndTime } from '@/types/music/expand-measures';

export class IndexSeconds {
	private curIdx = 0;
	private maxEndTime = 0;

	constructor(private indexEndTimes: IndexEndTime[]) {
		this.maxEndTime = this.indexEndTimes[this.indexEndTimes.length - 1].seconds;
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

		this.curIdx = i - 1;
	};

	getIndex = (seconds: number) => {
		if (seconds < 0 || seconds > this.maxEndTime) return null;

		if (this.indexEndTimes[this.curIdx].seconds < seconds)
			this.iterateUp(seconds);
		else this.iterateDown(seconds);

		return this.indexEndTimes[this.curIdx].index;
	};
}
