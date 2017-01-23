import React, {Component, PropTypes} from 'react';
import {
	View,
	Image,
	StyleSheet,
	Dimensions,
	Navigator,
	AsyncStorage
} from 'react-native';

import Home from './home';
import Login from './login';
import Register from './register';
import Notification from './accountSetting';
import DataStore from '../stores/dataStore';
import AccessToken from '../accessToken';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

var { width , height } = Dimensions.get('window');

class Splash extends Component{

	componentDidMount(){

		// AccessToken.getAccessToken();

		// setTimeout(() => {
		// 	this.props.toRoute({
		// 		name : 'Home',
		// 		component : Profile,
		// 		sceneConfig : Navigator.SceneConfigs.FadeAndroid
		// 	})	
		// }, 1000)
	// console.log('test')
		AccessToken.get()
			.then((data)=> {
				if(data){

					setTimeout(() => {
								this.props.toRoute({
									name : 'Home',
									// component : Home,
									component : Notification,
									sceneConfig : Navigator.SceneConfigs.FadeAndroid
								})	
							}, 1000)

					// AsyncStorage.getItem('USER_DATA').then((value) => {
					// 	// console.log(value)
					// 	var address = JSON.parse(value).AddressLine1
					// 	if(address==null || address==''){
					// 		console.log('belum isi form')
					// 		setTimeout(() => {
					// 			this.props.toRoute({
					// 				name : 'Home',
					// 				// component : Home,
					// 				component : Register,
					// 				sceneConfig : Navigator.SceneConfigs.FadeAndroid
					// 			})	
					// 		}, 1000)
					// 	}else{
					// 		setTimeout(() => {
					// 			this.props.toRoute({
					// 				name : 'Home',
					// 				component : Home,
					// 				// component : Register,
					// 				sceneConfig : Navigator.SceneConfigs.FadeAndroid
					// 			})	
					// 		}, 1000)
					// 	}
					// })
					
				}
			})
			.catch((err) => {
				setTimeout(() => {
					this.props.toRoute({
						name : 'Home',
						component : Login,
						// component : Register,
						sceneConfig : Navigator.SceneConfigs.FadeAndroid
					})	
				}, 1000)
			})
	}

	render(){
		return(
			<View style={styles.containerHomes}>
				<Image source={require('image!ds_icon')} style={styles.imageCenter}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	containerHomes : {
		flex : 1,
		left: 0,
		right : 0,
		top: 0,
		bottom : 0,
		alignItems : 'center',
		justifyContent : 'center'
	},
	imageCenter : {
		width : (width - 40),
		resizeMode: 'contain'
	}

})

Splash.PropTypes = PropTypes;

module.exports = Splash;