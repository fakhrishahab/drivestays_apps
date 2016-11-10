import React , { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styleVar from '../styleVar';

class HeaderContent extends Component{
	handlePress(e) {
	    if (this.props.onPress) {
	      this.props.onPress(e);
	    }
	}


	render(){
		return(
			<View style={styles.appContainer}>
				<View style={styles.flatHeader}>
			        <Icon name="menu" size={30} color="#FFF" onPress={this.handlePress.bind(this)} />
			        <Image source={require('image!profile')} style={styles.imageProfile}/>          
			    </View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	appContainer : {
		
	},
	flatHeader : {
		flexDirection: 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		height : 60,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		paddingLeft : 20,
		paddingRight : 20,
		borderBottomWidth : 1,
		borderStyle : 'solid',
		borderBottomColor : '#CCC',
		backgroundColor : styleVar.colors.primary
	},
	imageProfile : {
		width : 40,
		height : 40,
		right: 0
	}
})


module.exports = HeaderContent;