import React from 'react';

import Info from './components/Info'

import './App.scss';

export default () => {
  return (
    <div id='App'>
			<section id='canvas-wrapper'>
				<canvas id='graph'>
					グラフを表示するには、canvasタグをサポートしたブラウザが必要です。
				</canvas>
			</section>
			<Info />
    </div>
  );
}
