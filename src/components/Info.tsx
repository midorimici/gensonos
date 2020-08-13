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

let keyPreNumber: number = 0;

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
	const handleFreqChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		let freq: number = Number(event.target.value);
		if (freq < 0) freq = 0;
		if (freq > 24000) freq = 24000;
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
	const handleVolChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		let vol: number = Number(event.target.value);
		if (vol < 0) vol = 0;
		if (vol > 1000) vol = 1000;
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
			} else if (newMode === 'event') {
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
	const handleFormantChange = (event: React.ChangeEvent<HTMLInputElement>, formant: 1 | 2): void => {
		let val: number = Number(event.target.value);
		if (val < 0) val = 0;
		if (val > 24000) val = 24000;
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
		} else {
			return;
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
		if (newSounds[index]) {
			newSounds[index].on = false;
		}
		setSounds(newSounds);
		if (!isMute) {
			stopSound();
			playSounds(hz, vol, f1, f2, newSounds);
		}
	}

	// ミュート解除
	const handleUnmute = (index: number) => {
		let newSounds: {freq: number, vol: number, on: boolean}[] = sounds.slice();
		if (newSounds[index]) {
			newSounds[index].on = true;
		}
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
	const handleKey = (event: React.KeyboardEvent): void => {
		if (event.key === 'Esc' || event.key === 'Escape') {
			document.getElementById('text')!.focus();
		} else if (document.getElementById('text') === document.activeElement) {
			if (~'1234567890'.indexOf(event.key)) {
				keyPreNumber = 10*keyPreNumber + Number(event.key);
				return;
			}
			if (keyPreNumber) {
				// リスト個別指定削除
				if (event.key === 'd') {
					handleDelete(keyPreNumber - 1);
				}
				// リスト個別指定ミュート/解除
				if (event.key === 'm') {
					if (sounds[keyPreNumber - 1]?.on) {
						handleMute(keyPreNumber - 1);
					} else {
						handleUnmute(keyPreNumber - 1);
					}
				}
			}
			switch (event.key) {
				// ミュート/ミュート解除
				case 't':
					handleToggle();
					break;
				// リストに追加
				case 'a':
					handleAdd();
					break;
				// 周波数変更
				case 'f':
					document.getElementById('freq-input')!.focus();
					break;
				// 音量変更
				case 'v':
					document.getElementById('vol-input')!.focus();
					break;
				// 追加対象変更
				case 's':
					document.getElementById('mode-select')!.focus();
					break;
				// F1
				case '!':
					if (mode === 'custom') {
						document.getElementById('f1-input')!.focus();
					}
					break;
				// F2
				case '"':
					if (mode === 'custom') {
						document.getElementById('f2-input')!.focus();
					}
					break;
				// リスト全削除
				case 'D':
					handleDeleteAll();
					break;
				// リスト全ミュート/解除
				case 'M':
					if (sounds.some((event: {freq: number, vol: number, on: boolean}) => event.on)) {
						muteAll();
					} else {
						unmuteAll();
					}
					break;
			}

			keyPreNumber = 0;
			
			event.preventDefault();
		}
	}

	return (
		<section id='text' onKeyDown={(e: React.KeyboardEvent) => handleKey(e)} tabIndex={0}>
			<button id='mute-btn' onClick={handleToggle} title='ミュート/ミュート解除(t)'>
				{isMute ? 'unmute' : 'mute'}
			</button>
			<div id='edit'>
				<div className='inputbox' title='周波数(f)'>
					周波数
					<input id='freq-input' type='number' value={hz} min={0} max={24000} onChange={handleFreqChange} />
					Hz
				</div>
				<div className='inputbox' title='音量(v)'>
					音量
					<input id='vol-input' type='number' value={vol} min={0} max={1000} onChange={handleVolChange} />
					/1000
				</div>
				<div className='inputbox' title='追加対象(s)'>
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
						<div className='inputbox' title='F1(!)'>
							F1
							<input id='f1-input' type='number' value={f1} min={0} max={f2} onChange={
									(e: React.ChangeEvent<HTMLInputElement>) => handleFormantChange(e, 1)}/>
							Hz
						</div>
						<div className='inputbox' title='F2(")'>
							F2
							<input id='f2-input' type='number' value={f2} min={f1} max={24000} onChange={
									(e: React.ChangeEvent<HTMLInputElement>) => handleFormantChange(e, 2)}/>
							Hz
						</div>
					</>
				}
			</div>
			<button id='add-btn' onClick={handleAdd} title='リストに追加(a)'>
				Add >>
			</button>
			<div id='sound-list'>
				{sounds.length ?
					<>
						<button id='delall-btn' onClick={handleDeleteAll} title='全削除(D)'>全削除</button>
						{sounds.some(
							(e: {freq: number, vol: number, on: boolean}) => e.on) ?
								<button id='muteall-btn' onClick={muteAll} title='全てミュート(M)'>リストを全てミュート</button> :
								<button id='muteall-btn' onClick={unmuteAll} title='全てミュート解除(M)'>リストを全てミュート解除</button>
							}
					</>
					: ''}
				<ol title='削除(d) ミュート/ミュート解除(m)'>
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
				</ol>
			</div>
		</section>
	);
}
