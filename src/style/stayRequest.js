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
	requestItemWrapperNull : {
		left:0,
		right : 0,
		alignItems : 'center',
		padding : 10
	},
	requestItemName : {
		marginBottom : 10
	},
	requestItemSiteWrapper : {
		borderTopWidth : 0.5,
		borderTopColor : styleVar.colors.greyPrimary,
		borderStyle : 'solid',
		flex:1,
		paddingVertical : 10,
		flexDirection : 'row'
	},
	requestItemDescWrapper : {
		paddingLeft : 10,
		flex:1,
		flexWrap : 'wrap',
	},
	itemDescTitle : {
		color : styleVar.colors.primary,
		fontWeight : 'bold',
		flexWrap : 'wrap',
	},
	requestItemActionButton : {
		// flex: 1,
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent : 'space-between',
		marginTop : 10,
	},
	requestButton : {
		padding: 10,
		borderRadius : 3,
		alignSelf : 'flex-start'
	},
	buttonPrimary : {
		backgroundColor : styleVar.colors.primaryDark
	},
	buttonSecondary : {
		backgroundColor : styleVar.colors.secondary
	},
	detailInfoWrapper : {
		flexDirection : 'row',
		borderBottomWidth : 0.5,
		borderBottomColor : styleVar.colors.greyPrimary,
		borderStyle : 'solid',
		paddingBottom : 10
	},
	detailInfoButton : {
		// flex: 0.5,
		backgroundColor : styleVar.colors.greySecondary,
		borderWidth : 1,
		borderStyle : 'solid',
		borderColor : styleVar.colors.greyPrimary,
		padding : 5,
		flexDirection : 'row',
		justifyContent : 'space-between',
		marginRight : 10
	}
}