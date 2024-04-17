import { useRef, useState } from 'react';

export const usePolling = <T>(msPollingRate: number, valueGetter: () => T) => {
	const [pollValue, setPollValue] = useState<T>(valueGetter);
	const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

	const startPolling = () => {
		if (intervalIdRef.current !== null) return;

		intervalIdRef.current = setInterval(() => {
			console.log('polling...');
			const value = valueGetter();
			setPollValue(value);
		}, msPollingRate);
	};

	const stopPolling = () => {
		if (intervalIdRef.current === null) return;
		clearInterval(intervalIdRef.current);
		intervalIdRef.current = null;
	};

	const updatePollValue = (value?: T) => {
		if (value !== undefined) setPollValue(value);
		else setPollValue(valueGetter());
	};

	return {
		pollValue,
		startPolling,
		stopPolling,
		updatePollValue,
	};
};
