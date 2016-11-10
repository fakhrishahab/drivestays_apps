import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Navigator,
	TouchableHighlight,
	TouchableOpacity 
} from 'react-native';

import styleVar from '../styleVar';

class Button extends Component{
	render(){
		return(
			<TouchableOpacity 
				activeOpacity={0.7}
				style={styles.buttonWrapper} 
				onPress={() => this.props.onPress()}>
				<Text style={styles.buttonText}>{this.props.text}</Text>
			</TouchableOpacity >
		)
	}
}

const styles = StyleSheet.create({
	buttonWrapper : {
		flex : 1,
		justifyContent : 'center',
		backgroundColor : styleVar.colors.secondary,
		paddingVertical : 10,
		height : 40,
		marginTop : 15
	},
	buttonText : {
		fontSize : 14,
		color : '#FFF',
		alignSelf : 'center'
	}
})

export default Button;