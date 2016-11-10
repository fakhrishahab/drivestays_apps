import React, {Component, PropTypes} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	Image,
	View,
	TouchableWithoutFeedback
} from 'react-native';

import HeaderContent from '../component/headerContent';
import Routes from '../routes';
import AccessToken from '../accessToken';
import styleVar from '../styleVar';
import styles from '../style/registerStyle';

class Register extends Component{
	render(){
		return(
			<View style={styles.containerHome}>
		    	<HeaderContent onPress={() => this.toggle()}/>
		    	<View style={styles.containerContent}>
					<Text>Ini Profile</Text>
		    	</View>
		    </View>
		)
	}
}

module.exports = Register;
