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

// 周波数変更
export const changeVol = (vol: number): void => {
	gain.gain.value = vol;
}

// 片対数目盛のための計算
const changeScale = (value: number, len: number): number => {
	let rtn: number = Math.log10((value / len) * sampleRate / 2);
	if (rtn === -Infinity) return 0;
	return rtn;
};

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
		ctx.fillStyle = '#333333';
		ctx.fillRect(0, height - 16, width, 1);
		// グリッド
		for (let i = 10, j = 10; (i < 10*j || (j = 10**2, i < 10*j) || (j = 10**3, i <= 10*j)); i += j) {
			if (i === j) {
				ctx.fillStyle = '#333333';
			} else {
				ctx.fillStyle = '#aaaaaa';
			}
			let x: number = width*Math.log10(i)/Math.log10(24000);
			ctx.fillRect(x, 0, 1, height - 16);
			if (i === j || i === 5*j) {
				let text: string = i < 1000 ? i + 'Hz' : i/1000 + 'kHz'
				ctx.fillText(text, x - 8, height - 4);
			}
		}
		// 現在変更中の音の周波数の線
		ctx.fillStyle = '#aa0000';
		ctx.fillRect(width*Math.log10(freq)/Math.log10(24000), 0, 1, height- 16);

		// 周波数グラフ描画
		const data: Uint8Array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(data);

		ctx.strokeStyle = '#faaa33';

		ctx.beginPath();

		for (let i = 0, len = data.length; i < len; i++) {
			let x: number = width * changeScale(i, len) / changeScale(len, len);
			let y: number = (height - 16)*(1 - (data[i]/255));
			if (!i) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}

		ctx.stroke();
	}

	timer = setInterval(drawGraph, 100);
}
