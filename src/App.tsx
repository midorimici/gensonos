import React, { useState, useEffect, useRef } from 'react';

import { createSound, playSound, plotGraph } from './GenSound';

import './App.css';

export default () => {
	const [hz, setHz] = useState<number>(440);

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
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		let freq: number = Number(e.target.value);
		setHz(freq);

		// 音の生成
		let func = (t: number): number => Math.sin(2 * Math.PI * freq * t);
		const buffer = createSound(func, 10);
		// 再生
		playSound(buffer);
		// グラフの描画
		plotGraph(ctx.current!, width.current, height.current);
	}

  return (
    <div id='App'>
			<div id='canvas-wrapper'>
				<canvas id='graph'>
					グラフを表示するには、canvasタグをサポートしたブラウザが必要です。
				</canvas>
			</div>
			<input type='number' value={hz} onChange={handleChange} />
    </div>
  );
}
