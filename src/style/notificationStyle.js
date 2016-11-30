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
		backgroundColor : styleVar.colors.greySecondary
	},
	listWrapper : {
		width : screenWidth,
		padding : 10,
		flex : 1,
		flexDirection : 'row',
		borderBottomWidth : 1,
		borderBottomColor : styleVar.colors.greySecondary,
		borderStyle : 'solid',
		alignItems : 'center'
	},
	listDesc : {
		flexDirection : 'column',
		paddingHorizontal : 10,
		justifyContent : 'center'
	},
	textFrom : {
		color : styleVar.colors.primary
	},
	textMessage : {
		fontStyle : 'italic',
		color : styleVar.colors.greyDark
	},
	centering: {
	    alignItems: 'center',
	    justifyContent: 'center',
	    padding: 8,
	},
	loadingContentWrapper : {
		height : 80,
		alignItems : 'center',
		justifyContent : 'center',
		left:0,
		right:0
	},
	notifImage : {
		height : 30, 
		width : 30, 
		borderRadius : 15
	}
}