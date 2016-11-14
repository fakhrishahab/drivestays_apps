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
		justifyContent : 'center',
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
	headerText : {
		textAlign: 'center',
		color: '#FFF',
		fontFamily : 'gothic'
	},
	containerContent : {
		// flex:1,
		// bottom:0,
		marginTop:10,
		padding: 10
	},
	contentWrapper : {
		backgroundColor : '#FFF',
	},
	inputWrapper: {
		width : screenWidth-20,
		marginTop : -10,
	},
	inputContainer: {
		flex : 1,
		flexDirection :'row',
		alignItems : 'flex-start',
		justifyContent : 'space-between'
	},
	inputText : {
		flex : 1,
		paddingLeft : 0
	},
	btnSave : {
		backgroundColor : styleVar.colors.primary,
		width: screenWidth-20,
		marginTop: 10,
		padding: 15,
		borderRadius : 3
	},
	btnSaveCaption : {
		color : styleVar.colors.white,
		textShadowRadius: 5,
		textShadowOffset : {width : 1, height : 1},
		textShadowColor : '#000000',
		textAlign: 'center',
		fontSize: 16,
	},
	photoContainer : {
		marginTop:60,
		width : screenWidth,
		height : 200,
		backgroundColor : styleVar.colors.greySecondary,
		justifyContent: 'center',
		alignItems : 'center'
	},
	uploadTrigger : {
		position : 'absolute',
		width : 50,
		height : 50,
		right : 20,
		bottom : 20,
		backgroundColor : styleVar.colors.secondary,
		borderRadius : 25,
		elevation : 5,
		zIndex : 4,
		justifyContent : 'center',
		alignItems : 'center'
	},
	preloadUpload : {
		position : 'absolute',
		left : 0,
		bottom: 0,
		right: 0,
		top: 0,
		zIndex : 10,
		justifyContent : 'center',
		alignItems : 'center',
		backgroundColor : '#999999'
	},
	preloadUploadText : {
		bottom : 60,
		color : '#FFFFFF'
	}
}