import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;

module.exports = {
	containerHome : {
		flex: 1,
		backgroundColor : '#FFFFFF',
	},
	headerModal : {
		flexDirection: 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		height : 60,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		paddingLeft : 10,
		paddingRight : 20,
		position : 'absolute',
		zIndex : 2,
		backgroundColor : styleVar.colors.primary,
		elevation :5,
	},
	containerContent : {
		flex:1,
		bottom:0,
		marginTop:60
	},
	contentWrapper : {
		backgroundColor : '#FFF',
	},
}