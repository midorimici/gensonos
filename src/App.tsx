import React from 'react';

import Info from './components/Info'

import './App.scss';
import logo from './logo.svg';

export default () => {
  return (
		<>
			<img id='logo' src={logo} alt='logo' height={45} />
			<div id='App'>
				<section id='canvas-wrapper'>
					<canvas id='graph'>
						グラフを表示するには、canvasタグをサポートしたブラウザが必要です。
					</canvas>
				</section>
				<Info />
			</div>
		</>
  );
}
