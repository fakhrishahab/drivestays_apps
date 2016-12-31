import styleVar from '../styleVar';
import {
	Dimensions
} from 'react-native';

let screenWidth = Dimensions.get('window').width;

module.exports = {
	modalBackground : {
		backgroundColor : 'rgba(0,0,0,0.7)', 
		padding: 20, 
		flex: 1, 
		justifyContent : 'center'
	},
	modalContentContainer : {
		backgroundColor : '#FFF', 
		elevation : 5, 
		borderRadius : 5,
		alignItems : 'center',
		marginBottom : 10,
	},
	listItem: {
		paddingVertical : 10,
		left:0,
		right : 0,
		alignItems : 'center',
		width : screenWidth - 40,
		borderStyle : 'solid',
		borderBottomWidth : 0.5,
		borderBottomColor : styleVar.colors.greyPrimary
	},
	listItemCancel : {
		paddingVertical : 10
	}
}