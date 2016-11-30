import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;

module.exports = {
	containerHome : {
		flex: 1,
		zIndex : 0,
		backgroundColor : '#FFFFFF'
	},
	containerContent : {
		flex : 1,
		backgroundColor : '#CCC'
	}
}