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
		backgroundColor : '#FFFFFF',
		padding: 10,
		// paddingVertical : -5
	},
	headerModal : {
		flexDirection: 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		height : 60,
		elevation :5,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		paddingLeft : 10,
		paddingRight : 20,
		backgroundColor : styleVar.colors.primary
	},
	headerTitle : {
		color: '#FFF',
		fontFamily : 'gothic',
		fontSize : 16,
		textShadowColor : '#000',
		textShadowOffset : {width : 1, height: 1},
		textShadowRadius : 7
	},
	inputGroupHorizontal : {
		flex : 1,
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent : 'space-between'
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
		alignSelf : 'center',
		height : 55,
	},
	inputGroupSeparator : {
		marginLeft : 5
	},
	inputGroupButton : {
		height : 55,
		width: 35,
		// backgroundColor : styleVar.colors.greySecondary,
		alignItems : 'center',
		justifyContent : 'center'
	},
	countrySelectWrapper : {
		position : 'absolute',
		backgroundColor : styleVar.colors.white,
		// backgroundColor : 'red',
		elevation : 5,
		borderStyle : 'solid',
		borderWidth : 1,
		borderColor : styleVar.colors.greyPrimary,
		width : screenWidth - 20,
		left : 10,
		// top: 0,
		zIndex : 1,
		flex :1,
		marginTop : -95,
		paddingVertical : 5
		// bottom : -100,
	},
	countryListItem : {
		paddingHorizontal : 10,
		paddingVertical : 8
	}	
};