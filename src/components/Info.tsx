import React, { useState, useEffect, useRef } from 'react';

import { createSound, plotGraph, stopSound, changeFreq, changeVol, deleteOsc } from '../GenSound';

export default () => {
	const [hz, setHz] = useState<number>(440);
	const [vol, setVol] = useState<number>(50);
	const [isMute, setIsMute] = useState<boolean>(true);

	const [sounds, setSounds] = useState<{freq: number, vol: number}[]>([]);

	let width = useRef<number>(256);
	let height = useRef<number>(256);
	let ctx = useRef<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		const canvas: HTMLCanvasElement = document.getElementById('graph') as HTMLCanvasElement;
		const wrapper: HTMLElement = document.getElementById('canvas-wrapper')!;

		width.current = wrapper.clientWidth;
		height.current = wrapper.clientHeight;

		canvas.width = width.current;
		canvas.height = height.current;

		ctx.current = canvas.getContext('2d')!;		
		//
		// グラフの描画
		plotGraph(ctx.current, width.current, height.current, hz);
	}, []);

	const handleFreqChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		let freq: number = Number(e.target.value);
		setHz(freq);
		changeFreq(freq);
		// グラフの描画
		plotGraph(ctx.current!, width.current, height.current, freq);
	}

	const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		let vol: number = Number(e.target.value);
		setVol(vol);
		changeVol(vol/100);
	}

	const handleToggle = (): void => {
		setIsMute(!isMute);
		if (!isMute) {
			stopSound();
		} else {
			for (const sound of sounds) {
				createSound(sound.freq, sound.vol/100);
			}
			createSound(hz, vol/100);
		}
	}

	const handleAdd = (): void => {
		if (~sounds.map(e => e.freq).indexOf(hz)) return;
		setSounds([...sounds, {freq: hz, vol}]);
		if (!isMute) {
			createSound(hz, vol/100);
		}
	}

	const handleDelete = (index: number) => {
		let newSounds: {freq: number, vol: number}[] = sounds.slice();
		newSounds.splice(index, 1);
		setSounds(newSounds);
		deleteOsc(index);
	}

	return (
		<section id='text'>
			<div id='edit'>
				<div className='inputbox'>
					周波数
					<input type='number' value={hz} min={0} onChange={handleFreqChange} />
				</div>
				<div className='inputbox'>
					音量
					<input type='number' value={vol} min={0} max={100} onChange={handleVolChange} />
				</div>
				<button id='mute-btn' onClick={handleToggle}>
					{isMute ? 'unmute' : 'mute'}
				</button>
				<button id='add-btn' onClick={handleAdd}>
					Add >>
				</button>
			</div>
			<div id='sound-list'>
				<ul>
					{sounds.map((e: {freq: number, vol: number}, i: number) => (
						<li key={i}>
							周波数:{e.freq}, 音量:{e.vol}
							<button className='del-btn' onClick={() => handleDelete(i)}>削除</button>
							<button className='mod-btn'>編集</button>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
