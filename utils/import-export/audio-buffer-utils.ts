import {
	AudioBufferVolumePair,
	ToneBufferVolumePair,
} from '@/types/audio/volume';
import { ToneAudioBuffer } from 'tone';

export const secondsToSamples = (
	buffer: ToneAudioBuffer | AudioBuffer,
	seconds: number
) => {
	const sampleRate = buffer.sampleRate;
	return Math.floor(seconds * sampleRate);
};

export const secondsRangeToSamplesRange = (
	buffer: ToneAudioBuffer | AudioBuffer,
	[start, end]: [number, number]
) => {
	if (start < 0 || start > end) start = 0;
	if (end < start || end > buffer.duration) end = buffer.duration;

	const startSample = secondsToSamples(buffer, start);
	const endSample = secondsToSamples(buffer, end);
	return [startSample, endSample];
};

export const toneBufferToAudioBuffer = (
	buffer: ToneAudioBuffer,
	range: [number, number] = [0, buffer.duration]
) => {
	const [start, end] = secondsRangeToSamplesRange(buffer, range);
	const audioBuffer = new AudioBuffer({
		length: end - start,
		sampleRate: buffer.sampleRate,
		numberOfChannels: buffer.numberOfChannels,
	});
	for (let i = 0; i < buffer.numberOfChannels; i++) {
		audioBuffer.copyToChannel(buffer.getChannelData(i).slice(start, end), i);
	}

	return audioBuffer;
};

export const toneBuffersToAudioBuffer = async (
	buffers: ToneBufferVolumePair[]
) => {
	if (!buffers.length) return null;

	const audioBuffers: AudioBufferVolumePair[] = [];
	let maxLen = 0;
	let maxSampleRate = 0;
	let maxChannels = 0;

	for (const { buffer, volumePercentage } of buffers) {
		maxLen = Math.max(maxLen, buffer.length);
		maxSampleRate = Math.max(maxSampleRate, buffer.sampleRate);
		maxChannels = Math.max(maxChannels, buffer.numberOfChannels);

		const audioBuffer = toneBufferToAudioBuffer(buffer);
		audioBuffers.push({ buffer: audioBuffer, volumePercentage });
	}

	const offlineCtx = new OfflineAudioContext(
		maxChannels,
		maxLen,
		maxSampleRate
	);
	for (const { buffer, volumePercentage } of audioBuffers) {
		const source = new AudioBufferSourceNode(offlineCtx, { buffer });
		const gainNode = offlineCtx.createGain();
		gainNode.gain.value = volumePercentage;
		gainNode.connect(offlineCtx.destination);
		source.connect(gainNode);
		source.start();
	}

	const resBuffer = await offlineCtx.startRendering();
	console.log({ resBuffer, maxChannels, maxLen, maxSampleRate });
	return resBuffer;
};
