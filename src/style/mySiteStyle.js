import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;

module.exports = {
	containerHome : {
		flex: 1,
		zIndex : 0,
		// backgroundColor : '#FFFFFF'
	},
	containerContent : {
		flex : 1,
		// backgroundColor : styleVar.colors.greySecondary,
		// backgroundColor : '#FFFFFF',
		padding: 10
	},
	requestItemWrapper : {
		left:0,
		right : 0,
		backgroundColor : '#FFF',
		elevation : 2,
		marginBottom : 10,
		// borderStyle : 'solid',
		// borderWidth : 1,
		// borderColor : 'red',
		height : 180
	},
	requestImage : {
		height : 180,
		width : screenWidth
	},
	requestDescWrapper : {
		position:'absolute',
		bottom : 0,
		left:0 ,
		right :0,
		backgroundColor : 'rgba(0,0,0,0.5)',
		padding: 10,
		flex: 1,
		flexDirection : 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		width : screenWidth
	},
	requestDescText : {
		flex : 1
	},
	requestDescBrand : {
		color : styleVar.colors.secondary,
		fontFamily : 'gothic',
		fontWeight : 'bold',
		fontSize : 16
	},
	requestDescYear : {
		color : '#FFF',
		fontFamily : 'gothic',
		fontWeight : 'bold',
		fontSize : 16
	},
	iconWrapper : {
		flexDirection : 'row',
	}
}