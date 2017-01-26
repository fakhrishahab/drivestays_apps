import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

module.exports = {
	containerHome : {
		flex:1
	},
	containerContent : {
		flex : 1,
		// flexDirection : 'column',
		justifyContent : 'center',
		alignItems : 'center',
		bottom: 0,
		top: 0,
		backgroundColor : styleVar.colors.greySecondary,
		// backgroundColor : '#FFFFFF',
		padding : 10
	},
	flatHeader : {
		flexDirection: 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		height : 60,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		paddingLeft : 20,
		paddingRight : 20,
		borderBottomWidth : 0.3,
		borderStyle : 'solid',
		borderBottomColor : styleVar.colors.greyDark,
	},
	headerTitle : {
		color: styleVar.colors.greyDark,
		fontFamily : 'gothic',
		fontSize : 16,
		// textShadowColor : '#000',
		// textShadowOffset : {width : 1, height: 1},
		// textShadowRadius : 7
	},
	formForgotWrapper : {
		// flex : 1,
		width : screenWidth - 20,
		left : 0,
		right : 0,
		// backgroundColor : 'red'
	},
	buttonPrimary : {
		backgroundColor : styleVar.colors.primary,
		flex : 1,
		height : 50,
		marginTop : 10,
		alignItems : 'center',
		justifyContent : 'center'
	}
}