import React , { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  AsyncStorage,
  TouchableWithoutFeedback,
  Navigator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styleVar from '../styleVar';
import CONSTANT from '../constantVar';
import Routes from '../routes';

const propTypes = {
	  toRoute: PropTypes.func.isRequired,
	  toBack : PropTypes.func.isRequired
	}

class Header extends Component{
	constructor(props) {
		super(props);
	
	  	this.state = {
	  		access_token : '',
	  		notifMessage : false
	  	};
	}

	handlePress(e) {
	    if (this.props.onPress) {
	      this.props.onPress(e);
	    }
	}

	componentDidMount(){
	}

	componentWillMount(){
		AsyncStorage.getItem("ACCESS_TOKEN").then((value) => {
        	this.setState({
        		access_token : value
        	});


			this._loadNotification();
    	}).done();
	}

	_loadNotification(){
		console.log('this.state.access_token')
		var request = new Request(CONSTANT.API_URL+'messagethreads/notification?offset=0&limit=10', {
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			}	
		})

		fetch(request)
			.then((response) => {
				return response.json()
			})
			.then((response) => {
				if(response.Data.Total >= 1){
					this.setState({
						notifMessage : true
					})
				}
				console.log(response)
			})
			.catch((err) => {
				console.log('error', err)
			})
	}

	_viewNotif(e){
		if(this.props.onClick){
			this.props.onClick(e)
		}
		// this.props.replaceRoute(Routes.link('message'));
		// var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
	 //    	sceneConfig.gestures.pop.disabled = true;

		// this.props.toRoute({
		// 	name : 'message',
		// 	component : require('./template/message'),
  //   		sceneConfig : sceneConfig
		// })
	}

	_viewMessage(e){
		if(this.props.onTeken){
			this.props.onTeken(e)
		}
	}

	notificationBullet(status){
		if(status){
			return(
				<View style={styles.notificationBullet}></View>
			)
		}else{
			return(null)
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
		        <View style={{flexDirection:'row'}}>
		        	<Icon name="mail-outline" size={25} color="#fff" onPress={() => this._viewMessage(this)} style={{marginRight:20}}/>
		        	<Icon name="notifications-none" size={25} color="#fff" onPress={() => this._viewNotif(this)}/>
		        	{this.notificationBullet(this.state.notifMessage)}
		        </View>
		        
		    </LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	notificationBullet : {
		position : 'absolute',
		width : 10,
		height : 10,
		top : 0,
		right : 0,
		backgroundColor : styleVar.colors.secondary,
		borderRadius : 5
	},	
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