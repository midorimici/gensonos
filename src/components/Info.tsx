import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

import {
	createSounds,
	plotGraph,
	stopSound,
	changeFreq,
	changeVol,
} from '../GenSound';

export default () => {
	const [hz, setHz] = useState<number>(440);
	const [vol, setVol] = useState<number>(500);
	const [mode, setMode] = useState<string>('mono');
	const [f1, setF1] = useState<number>(1000);
	const [f2, setF2] = useState<number>(1500);
	const [isMute, setIsMute] = useState<boolean>(true);

	const [sounds, setSounds] = useState<{freq: number, vol: number, on: boolean}[]>([]);

	let width = useRef<number>(256);
	let height = useRef<number>(256);
	let canvas = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		canvas.current = document.getElementById('graph') as HTMLCanvasElement;
		const wrapper: HTMLElement = document.getElementById('canvas-wrapper')!;

		width.current = wrapper.clientWidth;
		height.current = wrapper.clientHeight;

		canvas.current.width = width.current;
		canvas.current.height = height.current;
		// グラフの描画
		plotGraph(canvas.current, width.current, height.current, hz);
	}, []);

	const playSounds = (freq: number, vol: number, f1: number, f2: number,
		sounds_: {freq: number, vol: number, on: boolean}[]=sounds
	): void => {
		for (const sound of sounds_) {
			if (sound.on) {
				createSounds(sound.freq, sound.vol/1000, 'mono');
			}
		}
		createSounds(freq, vol/1000, mode, f1, f2);
	}

	// ミュート
	const handleToggle = (): void => {
		setIsMute(!isMute);
		if (!isMute) {
			stopSound();
		} else {
			playSounds(hz, vol, f1, f2);
		}
	}

	// 周波数変更
	const handleFreqChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		let freq: number = Number(e.target.value);
		setHz(freq);
		if (mode === 'mono') {
			changeFreq(freq);
		} else {
			if (!isMute) {
				stopSound();
				playSounds(freq, vol, f1, f2);
			}
		}
		// グラフの描画
		plotGraph(canvas.current!, width.current, height.current, freq);
	}

	// 音量変更
	const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		let vol: number = Number(e.target.value);
		setVol(vol);
		if (mode === 'mono') {
			changeVol(vol/1000);
		} else {
			if (!isMute) {
				stopSound();
				playSounds(hz, vol, f1, f2);
			}
		}
	}

	// 追加対象変更
	const handleSelect = (): void => {
		let sel: HTMLSelectElement = document.getElementById('mode-select') as HTMLSelectElement;
		let newMode: string = (sel.children[sel.selectedIndex] as HTMLOptionElement).value;
		setMode(newMode);
		if (newMode === 'mono' || newMode === 'overtone') {
			(document.getElementById('add-btn') as HTMLButtonElement)!.disabled = false;
		} else {
			if (newMode === 'a') {
				setF1(800);
				setF2(1200);
				// setF3(2800);
				// setF4(3500);
			} else if (newMode === 'i') {
				setF1(400);
				setF2(2500);
				// setF3(2900);
				// fisetF4(3500);
			} else if (newMode === 'u') {
				setF1(300);
				setF2(1400);
				// setF3(2500);
				// setF4(3500);
			} else if (newMode === 'e') {
				setF1(500);
				setF2(2000);
				// setF3(2800);
				// setF4(3500);
			} else if (newMode === 'o') {
				setF1(500);
				setF2(800);
				// setF3(2700);
				// setF4(3500);
			}
			(document.getElementById('add-btn') as HTMLButtonElement)!.disabled = true;
		}
	}

	// F1 F2 変更
	const handleFormantChange = (e: React.ChangeEvent<HTMLInputElement>, formant: 1 | 2): void => {
		let val: number = Number(e.target.value);
		if (formant === 1) {
			setF1(val);
			if (!isMute) {
				stopSound();
				playSounds(hz, vol, val, f2);
			}
		} else {
			setF2(val);
			if (!isMute) {
				stopSound();
				playSounds(hz, vol, f1, val);
			}
		}
	}

	// リストに追加
	const handleAdd = (): void => {
		if (~sounds.map(e => e.freq).indexOf(hz)) return;
		if (mode === 'mono') {
			setSounds([...sounds, {freq: hz, vol, on: true}]);
		} else if (mode === 'overtone') {
			let appendSounds: {freq: number, vol: number, on: boolean}[] = [];
			for (let fq = hz; fq < 10000; fq += hz) {
				appendSounds.push({freq: fq, vol, on: true});
			}
			setSounds([...sounds, ...appendSounds]);
		}
		if (!isMute) {
			createSounds(hz, vol/1000, mode);
		}
	}

	// リストから削除
	const handleDelete = (index: number): void => {
		let newSounds: {freq: number, vol: number, on: boolean}[] = sounds.slice();
		newSounds.splice(index, 1);
		setSounds(newSounds);
		if (!isMute) {
			stopSound();
			playSounds(hz, vol, f1, f2, newSounds);
		}
	}

	// リスト全削除
	const handleDeleteAll = (): void => {
		setSounds([]);
		if (!isMute) {
			stopSound();
			createSounds(hz, vol/1000, mode, f1, f2);
		}
	}

	// ミュート
	const handleMute = (index: number) => {
		let newSounds: {freq: number, vol: number, on: boolean}[] = sounds.slice();
		newSounds[index].on = false;
		setSounds(newSounds);
		if (!isMute) {
			stopSound();
			playSounds(hz, vol, f1, f2, newSounds);
		}
	}

	// ミュート解除
	const handleUnmute = (index: number) => {
		let newSounds: {freq: number, vol: number, on: boolean}[] = sounds.slice();
		newSounds[index].on = true;
		setSounds(newSounds);
		if (!isMute) {
			stopSound();
			playSounds(hz, vol, f1, f2, newSounds);
		}
	}

	// リスト全ミュート
	const muteAll = (): void => {
		let newSounds: {freq: number, vol: number, on: boolean}[] = sounds.slice();
		for (let sound of newSounds) {
			sound.on = false;
		}
		setSounds(newSounds);
		if (!isMute) {
			stopSound();
			playSounds(hz, vol, f1, f2, newSounds);
		}
	}

	// リスト全ミュート解除
	const unmuteAll = (): void => {
		let newSounds: {freq: number, vol: number, on: boolean}[] = sounds.slice();
		for (let sound of newSounds) {
			sound.on = true;
			if (!isMute) {
				createSounds(sound.freq, sound.vol/1000, 'mono');
			}
		}
		setSounds(newSounds);
	}

	// キー操作
	const handleKey = (e: React.KeyboardEvent): void => {
		switch (e.key) {
			case 'm':
				handleToggle();
				break;
			case 'a':
				handleAdd();
				break;
		}
	}

	return (
		<section id='text' onKeyPress={(e: React.KeyboardEvent) => handleKey(e)} tabIndex={0}>
			<button id='mute-btn' onClick={handleToggle}>
				{isMute ? 'unmute' : 'mute'}
			</button>
			<div id='edit'>
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
						<option value='custom'>フォルマント指定</option>
					</select>
				</div>
				{mode === 'custom' &&
					<>
						<div className='inputbox'>
							F1
							<input type='number' value={f1} min={0} max={f2} onChange={
									(e: React.ChangeEvent<HTMLInputElement>) => handleFormantChange(e, 1)}/>
							Hz
						</div>
						<div className='inputbox'>
							F2
							<input type='number' value={f2} min={f1} onChange={
									(e: React.ChangeEvent<HTMLInputElement>) => handleFormantChange(e, 2)}/>
							Hz
						</div>
					</>
				}
			</div>
			<button id='add-btn' onClick={handleAdd}>
				Add >>
			</button>
			<div id='sound-list'>
				{sounds.length ?
					<>
						<button id='delall-btn' onClick={handleDeleteAll}>全削除</button>
						{sounds.some(
							(e: {freq: number, vol: number, on: boolean}) => e.on) ?
								<button id='muteall-btn' onClick={muteAll}>リストを全てミュート</button> :
								<button id='muteall-btn' onClick={unmuteAll}>リストを全てミュート解除</button>
							}
					</>
					: ''}
				<ul>
					{sounds.map((e: {freq: number, vol: number, on: boolean}, i: number) => (
						<li key={i}>
							周波数:{e.freq}, 音量:{e.vol}
							<FontAwesomeIcon icon={faTrash} className='del-btn' onClick={() => handleDelete(i)} />
							<FontAwesomeIcon
								icon={e.on ? faVolumeMute : faVolumeUp}
								className='mute-btn'
								onClick={() => e.on ? handleMute(i) : handleUnmute(i)}
							/>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
