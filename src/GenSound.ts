const context: AudioContext = new AudioContext();
let analyser: AnalyserNode = context.createAnalyser();
analyser.smoothingTimeConstant = 0.9;

// サウンド生成
export const createSound = (
		func: (t: number) => number,
		duration: number
): AudioBuffer => {
	// サンプリングレート
	let sampleRate: number = context.sampleRate;
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

export const plotGraph = (): void => {
	const ctx: CanvasRenderingContext2D = (document.getElementById('graph') as HTMLCanvasElement).getContext('2d')!;

	const drawGraph = (): void => {
		// 背景
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, 256, 256);
		ctx.strokeStyle = '#999999';
		ctx.strokeRect(0, 0, 256, 256);

		// グラフ
		const data: Uint8Array = new Uint8Array(256);
		
		// 周波数グラフ描画
		analyser.getByteFrequencyData(data);
		for (let i = 0; i < 256; i++) {
			ctx.fillStyle = '#faaa33';
			ctx.fillRect(i, 256 - data[i], 1, data[i])
		}
	}

	setInterval(drawGraph, 100)
}
