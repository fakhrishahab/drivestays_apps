import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;

module.exports = {
	containerHome : {
		flex: 1,
		zIndex : 0,
	},
	containerContent : {
		flex : 1,
		backgroundColor : '#CCC'
	},
	scrollbarWrapper : {
		backgroundColor : styleVar.colors.greySecondary,
	},
	scrollbarView : {
		backgroundColor : '#efefef'
	},
	requestItemWrapper : {
		left:0,
		right : 0,
		backgroundColor : '#FFF',
		elevation : 2,
		marginBottom : 10,
		padding : 10
	},
	requestItemName : {
		marginBottom : 10
	},
	requestItemSiteWrapper : {
		borderBottomWidth : 0.5,
		borderBottomColor : styleVar.colors.greyPrimary,
		borderTopWidth : 0.5,
		borderTopColor : styleVar.colors.greyPrimary,
		borderStyle : 'solid',
		flex:1,
		paddingVertical : 10,
		flexDirection : 'row'
	},
	requestItemDescWrapper : {
		paddingLeft : 10,
		flexWrap : 'wrap',
	},
	itemDescTitle : {
		color : styleVar.colors.primary,
		fontWeight : 'bold',
	},
	requestItemActionButton : {
		// flex: 1,
		flexDirection : 'row',
		alignItems : 'flex-start',
		justifyContent : 'space-around',
		marginTop : 10,
	},
	requestButton : {
		padding: 10,
		flexWrap : "wrap",
		borderRadius : 3
	},
	buttonPrimary : {
		backgroundColor : styleVar.colors.primaryDark
	},
	buttonSecondary : {
		backgroundColor : styleVar.colors.secondary
	}
}