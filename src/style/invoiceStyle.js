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
		flex : 1,
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
	invoiceHeader : {
		backgroundColor : styleVar.colors.primary,
		left : 0,
		right : 0,
		padding: 15,
		paddingBottom : 20
	},
	invoiceDate : {
		left : 0,
		right : 0,
		padding : 15,
		paddingTop : 20,
		width : screenWidth,
		flexDirection : 'row',
		justifyContent : 'space-around'
	},
	invoiceDateContent : {
		flex : 1
	},
	itemTableHeader : {
		backgroundColor : '#e5e5e5',
		borderStyle : 'solid',
		borderBottomColor : styleVar.colors.greyDark,
		borderBottomWidth : 1,
		flexDirection : 'row',
		left : 0,
		right : 0,
		width : screenWidth,
		padding : 10
	},
	itemTableContent : {
		borderStyle : 'solid',
		borderBottomWidth : 1,
		borderBottomColor : styleVar.colors.greyDark,
		left : 0,
		right : 0
	},
	itemTableContentList : {
		borderStyle : 'solid',
		borderBottomWidth : 1,
		borderBottomColor : styleVar.colors.greyPrimary	,
		padding : 10,
		flexDirection : 'row'
	},
	itemTableContentFooter : {
		backgroundColor : styleVar.colors.greySecondary,
		flexDirection : 'row',
		left : 0,
		right : 0,
		padding: 10
	},
	btnPayment : {
		backgroundColor : styleVar.colors.secondary,
		padding : 15,
		left: 10,
		right : 10,
		marginVertical : 20,
		width : screenWidth - 20,
		alignItems : 'center'
	}
}