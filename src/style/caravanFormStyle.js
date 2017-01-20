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
		paddingHorizontal: 10,
		paddingVertical : -5
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
	inputText : {
		flex : 1,
		paddingLeft : 0,
		paddingVertical : -10
	},
	inputSwitchWrapper : {
		flex : 1,
		flexDirection : 'row',
		justifyContent : 'space-between',
		paddingVertical : 20
	},
	inputSwitch : {
		flex:1,
		alignItems : 'flex-start',
		justifyContent : 'space-around',
		alignItems : 'center',
	},
	uploadContainer : {
		backgroundColor : styleVar.colors.greySecondary,
		left : 0,
		right : 0,
		marginBottom : 15,
	},
	uploadContainerTitle : {
		padding: 10,
		borderStyle : 'solid',
		borderBottomWidth : 0.3,
		borderBottomColor : styleVar.colors.greyDark
	},
	uploadContainerContent : {
		padding : 10,
		flexDirection : 'row',
		alignItems : 'flex-start',
	    justifyContent: 'space-between',
		flexWrap:'wrap'
	},
	uploadTrigger : {
		width : screenWidth / 2 - 25,
		height : screenWidth / 2 - 25,
		borderStyle : 'dashed',
		borderWidth : 1,
		borderColor : styleVar.colors.greyDark,
		alignItems : 'center',
		justifyContent : 'center'
	},
	uploadedImageWrapper : {
		height : screenWidth / 2 - 25,
		width : screenWidth / 2 - 25,
		marginBottom : 10
	},
	uploadedImage : {
		flex:1,
	},
	buttonSave : {
		left:0,
		right : 0,
		padding : 15,
		borderRadius : 5,
		marginBottom : 15,
		alignItems : 'center',
		backgroundColor : styleVar.colors.primary
	},
	imageButtonWrapper : {
		bottom: 0,
		left : 0,
		right : 0,
		flexDirection : 'row',
		backgroundColor : 'rgba(0,0,0,0.6)',
		position:'absolute',
		justifyContent : 'space-around',
	},
	imageButton : {
		margin :5,
		alignSelf : 'center',
		justifyContent :'center'
	}
}