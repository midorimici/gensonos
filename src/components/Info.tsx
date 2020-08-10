import React, { useState, useEffect, useRef } from 'react';

import {
	createSounds,
	plotGraph,
	stopSound,
	changeFreq,
	changeVol,
	deleteOsc,
	deleteAllOsc,
} from '../GenSound';

export default () => {
	const [hz, setHz] = useState<number>(440);
	const [vol, setVol] = useState<number>(500);
	const [mode, setMode] = useState<string>('mono');
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

	const handleToggle = (): void => {
		setIsMute(!isMute);
		if (!isMute) {
			stopSound();
		} else {
			for (const sound of sounds) {
				createSounds(sound.freq, sound.vol/1000, 'mono');
			}
			createSounds(hz, vol/1000, mode);
		}
	}

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
		changeVol(vol/1000);
	}

	const handleSelect = (): void => {
		let sel: HTMLSelectElement = document.getElementById('mode-select') as HTMLSelectElement;
		setMode((sel.children[sel.selectedIndex] as HTMLOptionElement).value);
	}

	const handleAdd = (): void => {
		if (~sounds.map(e => e.freq).indexOf(hz)) return;
		if (mode === 'mono') {
			setSounds([...sounds, {freq: hz, vol}]);
		} else if (mode === 'overtone') {
			let appendSounds: {freq: number, vol: number}[] = [];
			for (let fq = hz; fq < 10000; fq += hz) {
				appendSounds.push({freq: fq, vol});
			}
			setSounds([...sounds, ...appendSounds]);
		}
		if (!isMute) {
			createSounds(hz, vol/1000, mode);
		}
	}

	const handleDelete = (index: number): void => {
		let newSounds: {freq: number, vol: number}[] = sounds.slice();
		newSounds.splice(index, 1);
		setSounds(newSounds);
		deleteOsc(index);
	}

	const handleDeleteAll = () => {
		setSounds([]);
		deleteAllOsc();
	}

	return (
		<section id='text'>
			<div id='edit'>
				<button id='mute-btn' onClick={handleToggle}>
					{isMute ? 'unmute' : 'mute'}
				</button>
				<div className='inputbox'>
					周波数
					<input type='number' value={hz} min={0} onChange={handleFreqChange} />
					Hz
				</div>
				<div className='inputbox'>
					音量
					<input type='number' value={vol} min={0} max={1000} onChange={handleVolChange} />
					/1000
				</div>
				<div className='inputbox'>
					追加対象
					<select id='mode-select' onChange={handleSelect}>
						<option value='mono'>単音</option>
						<option value='overtone'>倍音</option>
						<option value='a'>A</option>
						<option value='i'>I</option>
						<option value='u'>U</option>
						<option value='e'>E</option>
						<option value='o'>O</option>
					</select>
				</div>
				<button id='add-btn' onClick={handleAdd}>
					Add >>
				</button>
			</div>
			<div id='sound-list'>
				{sounds.length ? <button id='delall-btn' onClick={handleDeleteAll}>全削除</button> : ''}
				<ul>
					{sounds.map((e: {freq: number, vol: number}, i: number) => (
						<li key={i}>
							周波数:{e.freq}, 音量:{e.vol}
							<button className='del-btn' onClick={() => handleDelete(i)}>削除</button>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
