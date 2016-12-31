import React , { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styleVar from '../styleVar';

class HeaderContent extends Component{
	constructor(props) {
		super(props);
	
	  	this.state = {
	  		access_token : '',
	  		user_data : {}
	  	};
	}

	handlePress(e) {
	    if (this.props.onPress) {
	      this.props.onPress(e);
	    }
	}

	handleClick(e){
		if(this.props.onClick){
			this.props.onClick(e);
		}
	}

	componentWillMount(){
		AsyncStorage.getItem("USER_DATA").then((value) => {
        	this.setState({user_data : JSON.parse(value)})
    	}).done();

		AsyncStorage.getItem("ACCESS_TOKEN").then((value) => {
        	this.setState({"access_token": value});
    	}).done();
	}


	render(){
		let headerImage = (this.state.access_token != '') ? (
			<Image source={require('image!profile')} style={styles.imageProfile}/>
		) : null;

		return(
			<View style={styles.appContainer}>
				<View style={styles.flatHeader}>
			        <Icon name="menu" size={30} color="#FFF" onPress={this.handlePress.bind(this)} />
			        <Text style={styles.headerTitle}>{this.props.title}</Text>
			        { (this.props.icon) ?
			        	<Icon name={this.props.icon} size={30} color="#FFF" onPress={this.handleClick.bind(this)} />
			        	:
			        	<Icon name='search' size={30} color={styleVar.colors.primary}/>
			        }
			        
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
	},
	headerTitle : {
		color: '#FFF',
		fontFamily : 'gothic',
		fontSize : 16,
		textShadowColor : '#000',
		textShadowOffset : {width : 1, height: 1},
		textShadowRadius : 7
	}
})


module.exports = HeaderContent;