import React , { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Header extends Component{
	handlePress(e) {
	    if (this.props.onPress) {
	      this.props.onPress(e);
	    }
	}


	render(){
		return(
			<LinearGradient 
		        locations={[0,0.7,1]}
		        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']} 
		        style={styles.linearGradient}
		      >
		        <Icon name="menu" size={25} color="#fff" onPress={this.handlePress.bind(this)} />
		        <Icon name="notifications-none" size={25} color="#fff" onPress={this.handlePress.bind(this)} />
		    </LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	linearGradient : {
     	flex: 1,
		flexDirection: 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		position: 'absolute',
		height : 80,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		paddingLeft : 20,
		paddingRight : 20
	},
	imageProfile : {
		width : 40,
		height : 40,
		right: 0
	}
})


module.exports = Header;