import React, { Component, PropTypes } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
	TextInput,
	Modal,
	ScrollView,
	DatePickerAndroid,
	TouchableWithoutFeedback,
	Navigator,
} from 'react-native';
import MapView from 'react-native-maps';
import styleVar from '../styleVar';


class Homes extends Component{
	render(){
		return(
			<View style={styles.containerHome}>
				<MapView
					ref="map"
					style={[styles.map]}
				>
				</MapView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	containerHome : {
		flex: 1,
		backgroundColor : '#FFF'
	},
	map : {
		flex : 1,
		bottom : 0,
		zIndex : 1,
		position: 'relative'
	},
	searchForm : {
		backgroundColor : 'rgba(0,0,0,0.8)',
		paddingRight : 20,
		paddingLeft : 20,
		paddingBottom : 20,
		flex : 1,
		position : 'absolute',
		alignItems : 'center',
		justifyContent : 'center',
		bottom: 20,
		left :0,
		right: 0,
		marginLeft : 20,
		marginRight : 20,
		marginBottom : 20,
		borderRadius : 5
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
	inputButton : {
		flex : 1,
		alignItems : 'center',
		justifyContent : 'center',
		height : 40,
		backgroundColor : styleVar.colors.secondary,
		marginTop : 10
	},
	inputButtonText : {
		fontSize : 14,
		color : '#FFF',
		fontFamily : 'gothic'
	}
})

module.exports = Homes;