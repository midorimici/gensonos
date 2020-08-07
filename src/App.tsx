import React, { useState } from 'react';

import { createSound, playSound, plotGraph } from './GenSound';

import './App.css';

export default () => {
	const [hz, setHz] = useState<number>(440);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		let freq: number = Number(e.target.value);
		setHz(freq);

		// 音の生成
		let func = (t: number): number => Math.sin(2 * Math.PI * freq * t);
		const buffer = createSound(func, 10);
		// 再生
		playSound(buffer);
		// グラフの描画
		plotGraph();
	}

  return (
    <div id='App'>
			<canvas id='graph' width={256} height={256}>
				グラフを表示するには、canvasタグをサポートしたブラウザが必要です。
			</canvas>
			<input type='number' value={hz} onChange={handleChange} />
    </div>
  );
}
