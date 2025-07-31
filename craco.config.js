require('react-scripts/config/env');

const colorPalette = process.env.REACT_APP_COLOR_PALETTE || 'default'

module.exports = {
	style: {
		sass: {
			loaderOptions: {
				prependData: [
					`@import "~antd/dist/antd.css";`,
					`@import "assets/scss/variables/_${colorPalette}-palette.scss";`,
				].join('')
			}
		}
	}
}