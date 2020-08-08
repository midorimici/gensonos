const context: AudioContext = new AudioContext();
let analyser: AnalyserNode = context.createAnalyser();
analyser.smoothingTimeConstant = 0.9;

// サンプリングレート
let sampleRate: number = context.sampleRate;

// サウンド生成
export const createSound = (
		func: (t: number) => number,
		duration: number
): AudioBuffer => {
	// 時間刻み
	let dt: number = 1 / sampleRate;
	// AudioBuffer 作成
	let buffer: AudioBuffer = context.createBuffer(1, sampleRate * duration, sampleRate);
	// バッファのデータ配列
	let data: Float32Array = buffer.getChannelData(0);
	
	for (let i = 0; i < data.length; i++) {
		data[i] = func(dt * i);
	}

	return buffer;
}

// サウンド再生
export const playSound = (buffer: AudioBuffer): void => {
	// source
	const source: AudioBufferSourceNode = context.createBufferSource();
	// バッファを設定
	source.buffer = buffer;

	// analyser に接続
	source.connect(analyser);
	
	// 出力先に接続
	analyser.connect(context.destination);
	
	// 再生
	source.start(0);
}

const changeScale = (value: number, len: number): number => {
	let rtn: number = Math.log10((value / len) * sampleRate / 2);
	if (rtn === -Infinity) return 0;
	return rtn;
};

export const plotGraph = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
	const drawGraph = (): void => {
		// 背景
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = '#999999';
		ctx.strokeRect(0, 0, width, height);
		for (let i = 10, j = 10; (i < 10*j || (j = 10**2, i < 10*j) || (j = 10**3, i <= 10*j)); i += j) {
			if (i === j) {
				ctx.fillStyle = '#333333';
			} else {
				ctx.fillStyle = '#aaaaaa';
			}
			ctx.fillRect(width*Math.log10(i)/Math.log10(24000), 0, 1, height);
		}

		// 周波数グラフ描画
		const data: Uint8Array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(data);

		ctx.strokeStyle = '#faaa33';

		ctx.beginPath();

		for (let i = 0, len = data.length; i < len; i++) {
			let x: number = width * changeScale(i, len) / changeScale(len, len);
			let y: number = height*(1 - (data[i]/255));
			if (!i) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}

		ctx.stroke();
	}

	setInterval(drawGraph, 100)
}
