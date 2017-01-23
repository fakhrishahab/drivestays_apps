import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;

module.exports = {
	containerHome : {
		flex:1
	},
	containerContent : {
		// flex : 1,
		// backgroundColor : styleVar.colors.greySecondary,
		// backgroundColor : '#FFFFFF',
		padding : 10
	},
	inputGroupHorizontal : {
		flexDirection : 'row',
		justifyContent : 'space-between',
	},
	inputGroupLong : {
		flex : 2,
		paddingLeft : 0,
		paddingVertical : -5,
		height : 55
	},
	inputGroupMiddle : {
		flex : 1,
		paddingLeft : 0,
		paddingVertical : -5,
		height : 55,
	},
	inputGroupShort : {
		flex : 0.5,
		paddingLeft : 0,
		paddingVertical : -5,
		height : 40,
	},
}