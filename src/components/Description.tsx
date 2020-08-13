import React from 'react';

export default () => {
	return (
		<section id='description'>
			<details>
				<summary>設定項目の説明</summary>
				<dl>
					<dt><b>周波数</b></dt>
					<dd>設定する基本周波数です。</dd>
					<dt><b>音量</b></dt>
					<dd>全体的な音量です。</dd>
					<dt><b>追加対象</b></dt>
					<dd>
						<dl>
							<dt><b>単音</b></dt>
							<dd>指定した周波数の音をひとつだけ発生させます。</dd>
							<dt><b>倍音</b></dt>
							<dd>指定した周波数を基本周波数とした10kHz未満の倍音を発生させます。</dd>
							<dt><b>A I U E O</b></dt>
							<dd>指定した周波数を基本周波数とした10kHz未満の倍音を母音フォルマントに合わせて発生させます。</dd>
							<dt><b>フォルマント指定</b></dt>
							<dd>指定した周波数を基本周波数とした10kHz未満の倍音を指定したフォルマントに合わせて発生させます。</dd>
						</dl>
					</dd>
				</dl>
			</details>
			<details>
				<summary>ショートカットキー</summary>
				<dl>
					<p>ショートカットキーは、ボタンやリストがある領域を選択した状態で動作します。</p>
					<dt><b>m</b></dt>
					<dd>全体のミュート/ミュート解除</dd>
					<dt><b>f</b></dt>
					<dd>周波数変更</dd>
					<dt><b>v</b></dt>
					<dd>音量変更</dd>
					<dt><b>s</b></dt>
					<dd>追加対象変更</dd>
					<dt><b>! (shift + 1)</b></dt>
					<dd>F1変更</dd>
					<dt><b>" (shift + 2)</b></dt>
					<dd>F2変更</dd>
					<dt><b>a</b></dt>
					<dd>リストに追加</dd>
					<dt><b>D (shift + d)</b></dt>
					<dd>リスト全削除</dd>
					<dt><b>M (shift + m)</b></dt>
					<dd>リスト全ミュート</dd>
					<dt><b>(number)d</b></dt>
					<dd>(number)番目の音を削除</dd>
					<dt><b>(number)m</b></dt>
					<dd>(number)番目の音をミュート</dd>
					<dt><b>Esc</b></dt>
					<dd>入力・選択状態を解除</dd>
				</dl>
			</details>
		</section>
	);
}
