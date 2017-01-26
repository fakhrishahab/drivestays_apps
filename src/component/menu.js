import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ListView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableHighlight
} from 'react-native';
import styleVar from '../styleVar';
import DataStore from '../stores/dataStore';
import AccessToken from '../accessToken';
import CONSTANT from '../constantVar';

let listMenu = [
	commonMenu = [
		{id : 0, title : 'Home', target : 'home', icon : require('image!icon_02')},
		// {id : 1, title : 'About Us', target : 'aboutUs', icon : require('image!icon_02')},
		// {id : 2, title : 'Terms & Agreement', target : 'termsAgreement', icon : require('image!icon_02')}
	],
	userMenu = [
		{id : 3, title : 'My Profile', target : 'myProfile', icon : require('image!icon_04')},
        {id : 4, title : 'My Caravan', target : 'myCaravan', icon : require('image!icon_11')},
        {id : 5, title : 'My Site', target : 'mySite', icon : require('image!icon_13')},
        {id : 6, title : 'My Booking', target : 'myBooking', icon : require('image!icon_34')},
        {id : 7, title : 'Stay Request', target : 'stayRequest', icon : require('image!icon_34')},
        // {id : 8, title : 'Account Payment', target : 'accountPayment', icon : require('image!icon_12')},
	],
	settingMenu = [
        {id : 9, title : 'Account Setting', target : 'accountSetting', icon : require('image!icon_03')},
        // {id : 10, title : 'Configuration', target : 'configuration', icon : require('image!icon_03')},
        // {id : 10, title : 'Log Out', target : 'logout', icon : require('image!icon_05')},
	]
];

class Menu extends Component{
	static propTypes = {
		nextPage : React.PropTypes.func.isRequired,
		logout : React.PropTypes.func.isRequired
	}

	constructor(props) {
	    super(props);
	    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	    this.state = {
	      dataSource: ds.cloneWithRows([
	      	{id : 0, title : 'Home', target : 'home'},
	      	{id : 1, title : 'My Profile', target : 'myProfile'},
	        {id : 2, title : 'My Caravan', target : 'myCaravan'},
	        {id : 3, title : 'My Site', target : 'mySite'},
	        {id : 4, title : 'My Booking', target : 'myBooking'},
	        {id : 5, title : 'Stay Request', target : 'stayRequest'},
	        {id : 6, title : 'Account Setting', target : 'accountSetting'},
	        {id : 7, title : 'Account Payment', target : 'accountPayment'},
	        {id : 8, title : 'Configuration', target : 'configuration'},
	        {id : 9, title : 'Splash Screen', target : 'splash'}
	      ])
	    };

	    this.userData = {};
	    this.userImage = '';
	}

	componentWillMount(){
		AccessToken.getUser()
			.then((data) => {
				this.userData = JSON.parse(data)
				let path = (this.userData.CustomerPictures.length >= 1) ? this.userData.CustomerPictures[0].Path : 'Assets/images/user-upload.png';
				// console.log(this.userData)
				this.setState({userImage : CONSTANT.API_URL+path});
			})
	}

	_renderMenuItem(){
		return listMenu.map((name, key) => {
			return(
				<View key={key} style={styles.menuWrapperGroup}>
					{this._renderMenuList(name)}
				</View>
			)
		})
	}

	_renderMenuList(data){
		return data.map((name, key) => {
			let icon = <Image source={name.icon}/>;
			return(
				<TouchableHighlight 
					underlayColor={styleVar.colors.greySecondary} 
					key={key}
					onPress={() => this.props.nextPage(name.target)}>
					<View style={styles.menuGroupItem}>
						<Image source={name.icon} style={styles.menuItemImage}/>
						<Text style={styles.menuItemName}>{name.title}</Text>
					</View>
				</TouchableHighlight>
			)
		})
	}

	render(){
		// console.log('image' , this.state.userImage)
		
		return(
			<View style={styles.menuWrapper}>
				<ScrollView>
					<View style={styles.listMenuWrapper}>
						<View style={styles.menuProfile}>
							<Image source={{uri : this.state.userImage}} style={styles.menuProfileImage}/>
							<Text style={styles.menuProfileName}>{this.userData.FirstName}</Text>
							<Text style={styles.menuProfileEmail}>{this.userData.EmailAddress}</Text>
						</View>
						<View style={styles.listMenuWrapper}>
							{this._renderMenuItem()}

							<TouchableHighlight
					        	onPress={() => this.props.logout()}
					        	>
					        	<View style={styles.menuGroupItem}>
									<Image source={require('image!icon_05')} style={styles.menuItemImage}/>
					        		<Text style={styles.menuItemName}>Log Out</Text>
					        	</View>
			        		</TouchableHighlight>
						</View>
				    </View>
			    </ScrollView>
			</View>
		)
	}
};


const styles = StyleSheet.create({
	menuWrapper : {
		flex: 1,
		flexDirection : 'column',
		alignItems : 'stretch',
		backgroundColor : '#ffffff'
	},
	menuProfile : {
		backgroundColor : styleVar.colors.primary,
		height : 80,
		left : 0,
		right:0,
		flexDirection : 'column',
		justifyContent : 'space-between',
		padding : 15
	},
	listMenuWrapper : {
		flex: 1,
	},
	menuWrapperGroup : {
		left:0,
		right : 0,
		borderBottomColor : styleVar.colors.greyPrimary,
		borderBottomWidth : 1,
		paddingVertical : 10
	},
	menuGroupItem : {
		left:0,
		right:0,
		flex : 1,
		flexDirection : 'row',
		justifyContent : 'flex-start',
		alignItems : 'center',
		height : 40,
		padding : 10
	},
	menuItemImage : {
		height : 25,
		width : 25,
		tintColor : styleVar.colors.greyDark,
		marginRight : 20
	},
	menuProfileName : {
		textShadowColor : '#000',
		color : '#FFF',
		fontFamily : 'gothic',
		fontSize : 18,
		textShadowOffset : {
			width : 1,
			height : 1
		},
		textShadowRadius : 5
	},
	menuProfileEmail : {
		textShadowColor : '#000',
		color : '#FFF',
		fontFamily : 'gothic',
		fontSize : 12,
		textShadowOffset : {
			width : 1,
			height : 1
		},
		textShadowRadius : 5,
		marginTop : -22
	},
	menuItemName : {
		fontFamily : 'gothic'
	}
})

module.exports = Menu;