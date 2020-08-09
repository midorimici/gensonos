const context: AudioContext = new AudioContext();
let osc: OscillatorNode = context.createOscillator();
let oscillators: OscillatorNode[] = [];
let gain: GainNode = context.createGain();
let analyser: AnalyserNode = context.createAnalyser();
analyser.smoothingTimeConstant = 0.9;

// サンプリングレート
let sampleRate: number = context.sampleRate;

// サウンド生成
export const createSound = (freq: number, vol: number) => {
	// OscillatorNode 初期化
	osc = context.createOscillator();
	// OscillatorNode リストに追加
	oscillators.push(osc);
	// GainNode 初期化
	gain = context.createGain();	

	// 接続
	osc.connect(gain);
	gain.connect(analyser);
	analyser.connect(context.destination);

	// 周波数設定
	osc.frequency.value = freq;
	// 音量設定
	gain.gain.value = vol;

	// 再生
	osc.start(0);
}

// 停止
export const stopSound = (): void => {
	for (let oscillator of oscillators) {
		oscillator.stop(0);
	}
}

// 周波数変更
export const changeFreq = (freq: number): void => {
	osc.frequency.value = freq;
}

// 音量変更
export const changeVol = (vol: number): void => {
	gain.gain.value = vol;
}

// oscillator 消去
export const deleteOsc = (index: number): void => {
	let target: OscillatorNode = oscillators[index];
	if (target) {
		target.stop(0);
		oscillators.splice(index, 1);
	}
}



// 片対数目盛のための計算
const changeScale = (value: number, len: number): number => {
	let rtn: number = Math.log10((value / len) * sampleRate / 2);
	if (rtn === -Infinity) return 0;
	return rtn;
};

// 範囲
analyser.maxDecibels = 0;
const range: number = analyser.maxDecibels - analyser.minDecibels;

// timeout
let timer: any = 0;

export const plotGraph = (ctx: CanvasRenderingContext2D, width: number, height: number, freq: number): void => {
	clearInterval(timer);
	
	const drawGraph = (): void => {
		// 背景
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);
		// 枠線
		ctx.strokeStyle = '#999999';
		ctx.strokeRect(0, 0, width, height);
		// 横軸グリッド
		for (let i = 10, j = 10; (i < 10*j || (j = 10**2, i < 10*j) || (j = 10**3, i <= 10*j)); i += j) {
			if (i === j) {
				ctx.fillStyle = '#333333';
			} else {
				ctx.fillStyle = '#aaaaaa';
			}
			let x: number = width*Math.log10(i)/Math.log10(24000);
			ctx.fillRect(x, 16, 1, height - 16);
			if (i === j || i === 5*j) {
				let text: string = i < 1000 ? i + 'Hz' : i/1000 + 'kHz'
				ctx.fillText(text, x - 8, 12);
			}
		}
		// 縦軸グリッド
		for (let i = analyser.minDecibels; i <= analyser.maxDecibels; i += 20) {
			let y: number = 16 + height*(analyser.maxDecibels - i)/range;
			ctx.fillRect(0, y, width, 1);
			ctx.fillText(i + 'dB', 4, y - 4);
		}

		// 現在変更中の音の周波数の線
		ctx.fillStyle = '#aa0000';
		ctx.fillRect(width*Math.log10(freq)/Math.log10(24000), 16, 1, height - 16);

		// 周波数グラフ描画
		// データ取得
		const data: Float32Array = new Float32Array(analyser.frequencyBinCount);
		analyser.getFloatFrequencyData(data);

		ctx.strokeStyle = '#faaa33';

		ctx.beginPath();

		for (let i = 0, len = data.length; i < len; i++) {
			let x: number = width * changeScale(i, len) / changeScale(len, len);
			let y: number = 16 + (height - 16)*(analyser.maxDecibels - data[i])/range;
			if (!i) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}

		ctx.stroke();
	}

	timer = setInterval(drawGraph, 80);
}
