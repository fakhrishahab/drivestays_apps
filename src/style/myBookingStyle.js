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
	containerModal : {
		position:'absolute',
		flex:1, 
		flexDirection : 'row',
		backgroundColor : 'rgba(0,0,0,0.7)', 
		alignItems :'center', 
		justifyContent:'center', 
		left:0, 
		right:0, 
		top :0, 
		bottom:0, 
		padding : 20,
		zIndex : 4
	},
	containerLoading : {
		flex:1, 
		backgroundColor : '#FFF', 
		borderRadius : 5, 
		alignItems : 'center', 
		padding: 10,
		elevation : 8
	}
}