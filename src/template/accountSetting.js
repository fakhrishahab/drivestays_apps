import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Image,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  InteractionManager,
  ActivityIndicator,
  ScrollView,
  AsyncStorage,
  Dimensions,
  Alert,
  Modal,
  Navigator
} from 'react-native';
import MapView from 'react-native-maps';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';
import styleVar from '../styleVar';
import TextField from 'react-native-md-textinput';

import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import AccessToken from '../accessToken';
import styles from '../style/accountSettingStyle';
import CONSTANT from '../constantVar';
import _ from 'underscore';
import moment from 'moment';
import ModalFeedback from '../plugin/ModalFeedback';
import ModalLoading from '../plugin/ModalLoading';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

var arrStatus = [];

class AccountSetting extends Component{

	constructor(props) {
		super(props);
	
	  	this.state = {
	  		access_token : '',
	  		user_data : '',
	  		renderPlaceholderOnly : true,
	  		progressAnimate : true,
	  		inputCurrentPassword : '1111111',
	  		inputNewPassword : '1234567',
	  		inputRePassword : '1234567',
	  		preloadSaveInfo : false,
	  		loading : false,
			showModalFeedback : false,
			textModalFeedback : '',
			modalStatus : '',
			textButton : ''
	  	};
	  	this.onNextPage = this.onNextPage.bind(this);
	}

	toggle() {
		this.drawer.openDrawer();
        this.setState({
          isOpen: !this.state.isOpen,
        });
    }

    onNextPage = (menu) => {
		this.props.toRoute(Routes.link(menu));
    }

	_onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

    validateForm(){
    	var status;

    	if(!this.state.inputCurrentPassword){
    		arrStatus.push('Current Password');
    		status = false;
    	}else{
    		status = true;
    	}

    	if(!this.state.inputNewPassword){
    		arrStatus.push('New Password');
    		status = false;
    	}else{
    		status = true;
    	}

    	if(!this.state.inputRePassword){
    		arrStatus.push('Retype New Password');
    		status = false;
    	}else{
    		status = true;
    	}

    	if(this.state.inputNewPassword != '' && this.state.inputRePassword != '' && this.state.inputNewPassword == this.state.inputRePassword){
    		status = true;
    	}else{
    		arrStatus.push('Your new password did not match');
    		status = false;
    	}

    	return(status);
    }

    preload(){
		return(
			<View style={styles.containerContent}>
				<ActivityIndicator
			        animating={this.state.progressAnimate}
			        style={[styles.centering, {height: 100}]}
			        size="large"
			        color={styleVar.colors.primary}
			    />
			</View>
		)
	}

	preloadSave(status){
		if(status){
			return(
				<View style={{position:'absolute', flex: 1, width: screenWidth, bottom:0, top:0, left:0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 5}}>
					<ActivityIndicator
				        animating={true}
				        style={{height: 80, alignItems: 'center',justifyContent: 'center',padding: 8, marginTop: 50, flex: 1}}
				        color={styleVar.colors.secondary}
				        size="large"/>
				</View>
			)
		}else{
			return(
				<View>
				</View>
			)
		}
	}

    componentDidMount(){
    	InteractionManager.runAfterInteractions(()=>{
			this.setState({
				renderPlaceholderOnly : false
			});
		});	

		AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
			this.setState({
				access_token : value
			});
		});

		AsyncStorage.getItem('USER_DATA').then((value) => {
			this.setState({
				user_data : JSON.parse(value)
			})
		})
    }

    _doClickButton(){
    	this.setState({
    		showModalFeedback : false
    	})
    }

    _saveAccount(){
    	if(this.validateForm()){
    		this._doSaveAccount();
    	}else{
    		console.log('failed to save')
    		var status = arrStatus.join(', ');
    		this.setState({
    			preloadSaveInfo : false
    		})
    		Alert.alert(
    			'Please Fill required fields below',
    			status
    		)
    		arrStatus = [];
    	}
    }

    _doSaveAccount(){
    	this.setState({
    		loading : true
    	});

    	var request = new Request(CONSTANT.API_URL+'customer/updatepassword', {
    		method : 'POST',
    		headers : {
    			'Content-Type' : 'application/json',
    			'Authorization' : this.state.access_token
    		},
    		body : JSON.stringify({
    			OldPassword : this.state.inputCurrentPassword,
    			NewPassword : this.state.inputNewPassword
    		})
    	});

    	fetch(request)
    		.then((response) => {
    			return response.json();
    		})
    		.then((response) => {
    			// console.log(response);
    			this.setState({
    				loading : false
    			});
    			if(response.Status != 200){
    				this.setState({
	    				loading : false,
	    				textModalFeedback : response.Message,
						showModalFeedback : true,
						modalStatus : 'error',
						textButton : 'Close'
	    			})
    			}else{
    				this.setState({
	    				loading : false,
	    				textModalFeedback : 'Your Password has successfully changed',
						showModalFeedback : true,
						modalStatus : 'success',
						textButton : 'Close'
	    			})
    			}
    		})
    		.catch((err) => {
    			console.log('error', err);
    			
    		})
    }

	render(){
    	const menu = <Menu nextPage={this.onNextPage} logout={this._onLogout}/>;

    	if (this.state.renderPlaceholderOnly) {
	    	return this.preload();
	    }

		return(
			<DrawerLayout
		      drawerWidth={300}
		      ref={(drawer) => { return this.drawer = drawer  }}
		      drawerPosition={DrawerLayout.positions.Left}
		      renderNavigationView={() => menu}>
				<View style={styles.containerHome}>
			    	<HeaderContent onPress={() => this.toggle()} title="Account Setting"/>
			    	<ModalLoading viewModal={this.state.loading}/>
			    	<ModalFeedback 
						viewModal={this.state.showModalFeedback}
						textModal={this.state.textModalFeedback}
						modalStatus={this.state.modalStatus}
						textButton={this.state.textButton}
						doClickButton={() => this._doClickButton()}/>

			    	<View style={styles.containerContent}>
			    		{this.preloadSave(this.state.preloadSaveInfo)}

						<View style={styles.inputGroupHorizontal}>
							<Text style={[styleVar.fontGothic, {color : styleVar.colors.primary}]}>Email Address</Text>
						</View>
						<View style={styles.inputGroupHorizontal}>
							<Text style={[styleVar.fontGothic, {marginVertical : 5}]}>{this.state.user_data.EmailAddress}</Text>
			    		</View>

			    		<View style={styles.inputGroupHorizontal}>
							<ScrollView style={styles.inputGroupLong}
					      		showsVerticalScrollIndicator={false}
					      		scrollEnabled={false}>
						        <TextField
						            label={'Current Password'}
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									value={this.state.inputCurrentPassword}
									blurOnSubmit={true}
									secureTextEntry={true}
									onChangeText={(value) => this.setState({inputCurrentPassword : value})}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>
			    		</View>

			    		<View style={styles.inputGroupHorizontal}>
							<ScrollView style={styles.inputGroupLong}
					      		showsVerticalScrollIndicator={false}
					      		scrollEnabled={false}>
						        <TextField
						            label={'New Password'}
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									value={this.state.inputNewPassword}
									blurOnSubmit={true}
									secureTextEntry={true}
									onChangeText={(value) => this.setState({inputNewPassword : value})}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>
			    		</View>

			    		<View style={styles.inputGroupHorizontal}>
							<ScrollView style={styles.inputGroupLong}
					      		showsVerticalScrollIndicator={false}
					      		scrollEnabled={false}>
						        <TextField
						            label={'Retype New Password'}
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									value={this.state.inputRePassword}
									blurOnSubmit={true}
									secureTextEntry={true}
									onChangeText={(value) => this.setState({inputRePassword : value})}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>
			    		</View>

			      		<TouchableWithoutFeedback onPress={() => {this._saveAccount()}}>
			      			<View style={[styles.inputGroupMiddle, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.secondary, marginTop : 10}]}>
		      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Save</Text>
			      			</View>
			      		</TouchableWithoutFeedback>
			    	</View>
			    </View>
			</DrawerLayout>
		)
	}
}

// const styles = StyleSheet.create({
// 	containerHome : {
// 		flex: 1,
// 		zIndex : 0,
// 		backgroundColor : '#FFFFFF'
// 	},
// 	containerContent : {
// 		flex : 1,
// 		backgroundColor : '#CCC'
// 	}
// })

module.exports = AccountSetting;