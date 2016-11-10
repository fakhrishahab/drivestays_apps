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
	containerContent : {
		flex:1,
		bottom:0,
		marginTop:60
	},
	contentWrapper : {
		backgroundColor : '#FFF',
	},
	mapWrapper : {
		padding : 20
	},
	map : {
		left : 0,
		right : 0,
		height : 300,
		top: 0,
		bottom : 0
	},
	calloutContent : {
		position:'absolute',
		top: 40,
		left : 40,
		right : 40,
		elevation : 1,
		borderRadius : 3,
		padding : 7,
		backgroundColor : '#FFFF',
		flex:1,
		flexDirection : 'row',
		justifyContent : 'center',
	},
	scrollbarWrapper : {
		backgroundColor : styleVar.colors.greySecondary,
		borderTopWidth : 0.5,
		borderTopColor : styleVar.colors.greyDark
	},
	scrollbarView : {
	},
	propertyImage : {
		left : 0,
		right: 0,
		top: 0,
		width : screenWidth,
		height : 200,
		resizeMode : 'cover',
	},
	scrollView : {
		flex : 1,
		left : 0,
		right: 0,
		top:0,
		bottom:0
	},
	siteAddress : {
		color : styleVar.colors.primary,
		marginTop: 20,
		marginLeft: 20,
		paddingLeft : 20,
		paddingRight : 20,
		paddingTop : 20,
		paddingBottom : 5,
	},
	siteLocation : {
		flex : 1,
		flexDirection :'row',
		paddingHorizontal : 20,
		marginBottom : 20
	},
	siteLocationTitle : {
		color:styleVar.colors.greyDark, 
		fontFamily: 'gothic',
		lineHeight : 5
	},
	borderTB : {
		borderBottomColor : styleVar.colors.greyDark,
		borderBottomWidth : 0.3,
		borderTopColor : styleVar.colors.greyDark,
		borderTopWidth : 0.3,
	},
	hostedWrapper : {
		padding : 20
	},
	hostedImage : {
		height : 40,
		width : 40,
		paddingHorizontal : 20,
	},
	headTotalPrice : {
		textShadowColor : '#000000',
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 5,
		fontSize: 16
	},
	titleSection: {
		margin: 10,
		color: styleVar.colors.greyDark,
		fontFamily : 'gothic-bold',
		fontWeight : 'bold'
	},
	detailBox : {
		backgroundColor : styleVar.colors.greySecondary,
		marginHorizontal : 10,
		marginTop: 10
	},
	detailBoxHeader : {
		borderBottomColor : styleVar.colors.greyDark,
		borderBottomWidth : 0.5,
		borderStyle : 'solid',
	},
	amenitiesWrapper : {
		alignItems : 'center',
		justifyContent : 'space-between',
		flexDirection : 'column',
		paddingHorizontal : 10,
		paddingTop: 10,
		justifyContent:  'space-between',
	},
	amenitiesIcon : {
		width : 30,
		height : 30,
		tintColor : styleVar.colors.greyDark
	},
	amenitiesCount : {
		color : '#000',
		fontFamily : 'gothic',
		fontSize : 25
	},
	amenitiesItem : {
		left:0,
		right: 0,
		padding: 10,
		width: screenWidth-40,
		flex: 1,
		flexDirection: 'row',
		borderColor: styleVar.colors.greySecondary,
		borderStyle: 'solid',
		// backgroundColor: '#FFFFFF',
		borderWidth: 1,
		elevation :1,
		marginBottom: 10,
		justifyContent:  'space-between'
	},
	bookingDetailItem : {
		alignItems : 'center',
		flex: 1,
		flexDirection : 'row',
		justifyContent : 'space-between',
		margin : 10,
		paddingBottom : 10,
		borderBottomWidth : 1,
		borderBottomColor : styleVar.colors.greyPrimary,
		borderStyle : 'solid'
	},
	bookingDetailItemsTitle : {
		flex : 3,
	},
	bookingDetailItemsRate : {
		flex : 1,
		textAlign : 'right',
		color : styleVar.colors.secondary,
	},
	bookingTotal : {
		height : 50,
		left : 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex:0.2,
		right : 0,
		padding: 20,
	},
	bookingTotalTitle : {
		fontFamily : 'gothic-bold',
		fontWeight : 'bold',
		color : styleVar.colors.black,
		fontSize : 18,
	},
	btnBook : {
		backgroundColor : styleVar.colors.primary,
		width: screenWidth-20,
		margin: 10,
		padding: 15,
		borderRadius : 3
	},
	btnBookCaption : {
		color : styleVar.colors.white,
		textShadowRadius: 5,
		textShadowOffset : {width : 1, height : 1},
		textShadowColor : '#000000',
		textAlign: 'center',
		fontSize: 16,
	},
	infoWrapper : {
		flexDirection : 'row',
		justifyContent : 'space-between',
		paddingVertical : 10,
		borderBottomWidth : 0.3,
		borderBottomColor : styleVar.colors.greyDark
	},
	infoItem : {
		fontFamily : 'gothic',
		fontSize : 14
	},
	infoDetail : {
		fontFamily : 'gothic',
		color : styleVar.colors.greySecondary
	},
	siteDescWrapper : {
		flex : 1,
		flexWrap : 'wrap'
	},
	dateWrapper : {
		backgroundColor : '#CCC',
		padding : 20
	},
	dateRow : {
		flex : 1,
		flexDirection : 'row',
		left : 0,
		right : 0
	},
	imageDate : {
		height : 30,
		width : 30,
		marginRight : 20,
		alignSelf : 'center'
	},
	separator : {
		marginVertical : 10,
		height : 0.5,
		backgroundColor : styleVar.colors.greyDark
	},
	buttonCenter : {
		alignSelf : 'center',
		borderWidth : 1,
		flexDirection : 'row',
		borderColor : styleVar.colors.greyDark,
		alignItems : 'center',
		height : 40,
		paddingHorizontal : 10,
		marginTop : 20
	},
	buttonImage : {
		width : 20,
		height : 20,
		marginRight : 10
	},
	searchForm : {
		backgroundColor : styleVar.colors.greySecondary,
		flex : 1,
		padding : 20,
		left : 0,
		right : 0,
		top : 0,
		flexDirection :'row',
		alignItems : 'flex-start',
		justifyContent : 'space-around'
	},
	inputStyle : {
		fontFamily : 'gothic',
		padding: 0,
		fontSize : 18
	},
	carouselItem : {
		width: screenWidth,
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: 'transparent',
	}
}