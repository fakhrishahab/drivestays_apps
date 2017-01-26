import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Dimensions,
	Navigator,
	ScrollView,
	TouchableOpacity,
	Modal,
	ActivityIndicator,
	Alert
} from 'react-native';
import AuthenticationAction from '../actions/authenticationAction';
import styleVar from '../styleVar';
import TextField from 'react-native-md-textinput';
import Button from '../component/button';
import DataStore from '../stores/dataStore';
import Routes from '../routes';
import ApiRequest from '../apiRequest';
import AccessToken from '../accessToken';
import Menu from '../component/menu';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class Login extends Component{

	constructor(props) {
		super(props);

		this.state = {
			isSigned : false,
			isSignup : false,
			loadingVisible : false
		};

		this.email = 'fakhri1804@gmail.com';
		this.password = '';
		this.passwordConfirmation = '';
		this.firstName = '';
		this.lastName = '';
	}

	validateForm(){
    	var status;

    	if(!this.email){
    		alert('Please input your email')
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.password){
    		alert('Please input your password');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(this.state.isSignup && !this.firstName){
    		alert('Please input your First Name');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(this.state.isSignup && !this.lastName){
    		alert('Please input your Last Name');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.passwordConfirmation && this.state.isSignup){
    		alert('Please input password confirmation');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(this.password !== this.passwordConfirmation && this.state.isSignup){
    		alert('Your password did not match');
    		status = false;
    		return false;
    	}else{
    		status = true;
    	}

    	return (true);
    }

	componentDidMount() {
    	AuthenticationAction.loadUser.completed.listen(this.onLoadUserCompleted.bind(this));
    	AuthenticationAction.login.failed.listen(this.onLoginCompleted.bind(this));
    	// console.log('here');
    	// ApiRequest.getProperty()
    	// 	.then((data) => {
    	// 		console.log(data)
    	// 	})
    	// 	.catch((err) => console.log('error : ', err))
	}

	onLoginCompleted(data){
		if(data.Status==401){
			Alert.alert(
				'Login Failed',
				data.Message
			)
			this.setState({
				loadingVisible : false
			})
		}
		// console.log('login complete', data)
	}

	onLoadUserCompleted(user, data){
		if(data.AddressLine1){
			this.props.replaceRoute(Routes.link('home'));
		}else{
			this.props.replaceRoute(Routes.link('register'));
		}
		// if (user.onboarded) {
		// 	this.props.replaceRoute(Routes.home());
		// } else {
		// 	this.props.replaceRoute(Routes.onboarding(user));
		// }
	}

	_submitForm(){
		if(this.state.isSignup){
			this._doSignup()
		}else{
			this._doLogin();
		}
		
		// if(this.state.isSignup){

		// }else{	
		// 	this.setState({
		// 		loadingVisible : true
		// 	})
		// 	AuthenticationAction.login({
		// 		email : this.email,
		// 		password : this.password
		// 	})
		// }
	}

	_doLogin(){
		if(this.validateForm()){
			this.setState({
				loadingVisible : true
			})
			AuthenticationAction.login({
				email : this.email,
				password : this.password
			})
		}
	}

	_doSignup(){
		if(this.validateForm()){
			this.setState({
				loadingVisible : true
			})

			AuthenticationAction.signup({
				email : this.email,
				password : this.password,
				firstname : this.firstName,
				lastname : this.lastName
			})
		}
		// console.log(this.validateForm());
	}

	_signUp(){
		this.setState({
			isSignup : !this.state.isSignup
		})
	}

	_forgotPassword(){
		var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
		sceneConfig.gestures.pop.disabled = true;

    	this.props.toRoute({
			name : 'forgot',
			component : require('./forgotPassword'),
    		sceneConfig : sceneConfig
		})
	}

	render(){
		let footerContent = (!this.state.isSignup) ? (
			<Text style={styles.footerText}>Dont Have an account? <Text style={styles.footerTextAction}>Sign Up.</Text></Text>
		) : (
			<Text style={styles.footerText}>Already Signed Up? <Text style={styles.footerTextAction}>Login.</Text></Text>
		);

		let passwordConfirmation = (this.state.isSignup) ? (
			<View style={styles.inputWrapper}>
				<ScrollView style={styles.inputText}
		      		showsVerticalScrollIndicator={false}>
			        <TextField
			        	secureTextEntry={true}
						label={'Confirm Password'}
						highlightColor={styleVar.colors.secondary}
						onChangeText={(text) => this.passwordConfirmation = text}
						keyboardType={'default'}
						ref="confirmPassword"
						textColor='#FFF'
						labelColor='#FFF'
						dense={true}
						value={this.passwordConfirmation}
			        />
		      	</ScrollView>
			</View>
		) : null;

		let loadingComponent = (this.state.loadingVisible) ? (
			<View style={styles.inputWrapper}>
				<ActivityIndicator
			        animating={this.state.progressAnimate}
			        style={{height: 100, alignSelf:'center'}}
			        size="large"
			        color={styleVar.colors.primary}
			    />
			</View>
		) : null;

		let firstnameComponent = (this.state.isSignup) ? (
			<View style={styles.inputWrapper}>
				<ScrollView style={styles.inputText}
		      		showsVerticalScrollIndicator={false}>
			        <TextField
						label={'First Name'}
						highlightColor={styleVar.colors.secondary}
						onChangeText={(text) => this.firstName = text}
						keyboardType={'default'}
						ref="firstName"
						textColor='#FFF'
						labelColor='#FFF'
						dense={true}
						value={this.firstName}
			        />
		      	</ScrollView>
			</View>
		) : null;

		let lastnameComponent = (this.state.isSignup) ? (
			<View style={styles.inputWrapper}>
				<ScrollView style={styles.inputText}
		      		showsVerticalScrollIndicator={false}>
			        <TextField
						label={'Last Name'}
						highlightColor={styleVar.colors.secondary}
						onChangeText={(text) => this.lastName = text}
						keyboardType={'default'}
						ref="lastName"
						textColor='#FFF'
						labelColor='#FFF'
						dense={true}
						value={this.lastName}
			        />
		      	</ScrollView>
			</View>
		) : null;

		return(
			<View style={styles.containerHome}>
				<ScrollView
					ref="scrollView"
					keyboardShouldPersistTap={false}
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
					>

					<View style={styles.containerContent}>
						<Image source={require('image!ds_icon')} style={styles.imageLogo}/>
						<View style={styles.inputWrapper}>
							<ScrollView style={styles.inputText}
					      		showsVerticalScrollIndicator={false}>
						        <TextField
						          label={'Username/Email'}
						          highlightColor={styleVar.colors.secondary}
						          onChangeText={(text) => this.email = text}
						          keyboardType={'email-address'}
						          ref="email"
						          textColor='#FFF'
						          labelColor='#FFF'
						          dense={true}
						          value={this.email}
						        />
					      	</ScrollView>
						</View>

						{firstnameComponent}
						{lastnameComponent}

						<View style={styles.inputWrapper}>
							<ScrollView style={styles.inputText}
					      		showsVerticalScrollIndicator={false}>
						        <TextField
						        	secureTextEntry={true}
						          label={'Password'}
						          onChangeText={(text) => this.password = text}
						          highlightColor={styleVar.colors.secondary}
						          keyboardType={'default'}
						          ref="password"
						          textColor='#FFF'
						          labelColor='#FFF'
						          dense={true}
						          value={this.password}
						        />
					      	</ScrollView>
						</View>

						{passwordConfirmation}

						{loadingComponent}

						{
							(!this.state.isSignup) ? 

							<View style={styles.inputWrapper}>
								<TouchableOpacity onPress={() => this._forgotPassword()}>
									<View style={{paddingTop : 20, paddingBottom : 10, alignItems : 'flex-end'}}>
										<Text style={{color : styleVar.colors.primary}}>Forgot Password ?</Text>
									</View>
								</TouchableOpacity>
							</View>

							:

							null
						}
						

						<View style={styles.inputWrapper}>
							<Button text={(this.state.isSignup) ? 'Sign Up' : 'Log In'} onPress={ () => this._submitForm()}/>
						</View>
					</View>

					<TouchableOpacity activeOpacity={0.5} style={styles.footerWrapper} onPress={() => this._signUp()}>
						{footerContent}
					</TouchableOpacity>
				</ScrollView>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	containerHome : {
		flex : 1,
		backgroundColor :'rgba(0,0,0,0.9)'
	},
	scrollView : {
		position:'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
		flex : 1,
		overflow: 'visible',
		width : screenWidth,
		height : screenHeight,
	},
	containerContent : {
		flex : 1,
		alignItems : 'center',
		justifyContent: 'center',
		flexDirection : 'column',
		width : screenWidth,
		height : screenHeight,
	},
	imageLogo : {
		width : screenWidth * 0.6,
		height : screenWidth * 0.14,
		tintColor: '#FFF'
	},
	inputWrapper: {
		width : screenWidth * 0.8,
		marginTop : -10,
	},
	footerWrapper : {
		position : 'absolute',
		paddingVertical : 12,
		alignItems : 'center',
		bottom: 0,
		left:0,
		right:0,
		backgroundColor : 'rgba(255,255,255,0.3)',
		borderTopColor : 'rgba(255,255,255,1)',
		borderTopWidth : 1,
		height : 70
	},
	footerText : {
		color : '#FFF'
	},
	footerTextAction : {
		color : '#FFF',
		fontWeight: 'bold'
	}
})

module.exports = Login;