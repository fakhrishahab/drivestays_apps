import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

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
	userInfoWrapper : {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userInfoName : {
		color: '#FFFFFF',
		fontSize : 16,
		marginRight: 15,
		textShadowRadius : 5,
		textShadowOffset : {width : 1, height: 1},
		textShadowColor : '#000'
	},
	userInfoImage : {
		height : 40, 
		width: 40,
		borderRadius : 20
	},
	userInfoImageNull : {
		tintColor : '#FFF',
		height : 50, 
		width:50,
	},
	scrollMessage : {
		backgroundColor : styleVar.colors.greyPrimary,
		height : screenHeight - 145,
		top : 60,
		paddingHorizontal : 15,
		marginBottom : 30,
		flexDirection : 'column'
	},
	inputContainer : {
		bottom: 0,
		left:0,
		right : 0,
		position:'absolute',
		padding : 10,
		elevation : 10,
		backgroundColor : '#FFF',
		borderStyle : 'solid',
		borderTopWidth : 1,
		flex:1,
		flexDirection : 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		borderTopColor : styleVar.colors.greySecondary
	},
	messageTextInput : {
		backgroundColor : styleVar.colors.greySecondary,
		height : 40,
		flex:1,
		marginRight : 15
	},
	bubbleRight : {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginBottom : 5,

	},
	bubbleLeft : {
		flexDirection: 'row',
		marginBottom :5
	},
	bubbleCenter : {
		flexDirection: 'row',
		marginBottom :5,
		flex:1,
		backgroundColor : styleVar.colors.greySecondary,
		borderStyle : 'dashed',
		borderWidth : 1,
		borderColor : styleVar.colors.secondary
	},
	messageBubbleRight : {
		backgroundColor : '#FFF',
		elevation : 2,
		borderRadius : 3,
		padding : 5,
		maxWidth : screenWidth - 70,
		backgroundColor : '#fcbc7e'
		// flex: 1,
		// flexDirection : 'column',
		// flexWrap: 'wrap',
		// flex:1
	},
	messageBubbleLeft : {
		backgroundColor : '#FFF',
		elevation : 2,
		borderRadius : 3,
		padding : 5,
		maxWidth : screenWidth - 70
		// flex: 1,
		// flexDirection : 'column',
		// flexWrap: 'wrap',
		// flex:1
	},
	messageSystem : {
		flex:1,
		justifyContent : 'center',
		alignItems : 'center',
		padding : 10
	},
	messageContent : {
		fontFamily : 'gothic',
		color : '#000',
		flexWrap : 'wrap'
	},
	messageDate : {
		fontFamily : 'gothic',
		fontStyle : 'italic',
		fontSize : 12
	},
	right : {
		textAlign : 'right'
	}
}