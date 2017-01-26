import React, { Component, PropTypes } from 'react';
import {
	View,
	Text,
	InteractionManager,
	Dimensions,
	ScrollView,
	TouchableHighlight
} from 'react-native';

import styles from '../style/forgotPasswordStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styleVar from '../styleVar';
import TextField from 'react-native-md-textinput';
import CONSTANT from '../constantVar';
import ModalFeedback from '../plugin/ModalFeedback';
import ModalLoading from '../plugin/ModalLoading';

let arrStatus = [];
class ForgotPassword extends Component{

	constructor(props) {
		super(props);
	
		this.state = {
			email : '',
			loading : false,
			showModalFeedback : false,
			textModalFeedback : '',
			modalStatus : ''
		};
	}

	componentWillMount(){

	}

	goBack(){
		this.props.toBack();
	}

	_doClickButton(){
		this.setState({
			loading : false,
			showModalFeedback : false
		})
	}

	validateForm(){
		var status;

		if(!this.state.email){
			alert('Please input email');
			status = false;
			return false;
		}else{
			status = true;
		}

		return status;
	}

	resetPassword(){
		this.refs.email.blur();
		if(this.validateForm()){
			this._doResetPassword();
		}
	}

	_doResetPassword(){
		this.setState({
			loading : true
		});

		var request = new Request(CONSTANT.API_URL+'credentials/checkemail?email='+this.state.email, {
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json'
			}
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				console.log(response);
				this.setState({
					loading : false,
					showModalFeedback : true,
				});

				if(response.Status == 200){
					this.setState({
						textModalFeedback : 'Your password has been reset, please kindly check your email',
						modalStatus : 'success'
					});
				}else{
					this.setState({
						textModalFeedback : response.Message,
						modalStatus : 'error'
					});
				}
				
			})
			.catch((err) => {
				console.log('error', err);
				this.setState({
					loading : false,
					textModalFeedback : err.Message,
					showModalFeedback : true,
					modalStatus : 'error'
				});
			})
	}

	render(){
		return(
			<View style={styles.containerHome}>
				<View style={styles.flatHeader}>
			        <Icon name="arrow-back" size={30} color={styleVar.colors.greyDark} onPress={ () => this.goBack()} />
			        <Text style={styles.headerTitle}>Forgot Password</Text>
			    </View>

			    <ModalLoading viewModal={this.state.loading}/>
				<ModalFeedback 
					viewModal={this.state.showModalFeedback}
					textModal={this.state.textModalFeedback}
					modalStatus={this.state.modalStatus}
					textButton="Close"
					doClickButton={() => this._doClickButton()}/>

			    <View style={styles.containerContent}>
			    	<View style={styles.formForgotWrapper}>
			    		<Text style={[styleVar.fontGothic, {alignSelf : 'center'}]}>Please input your email below</Text>

			    		<ScrollView style={styles.inputText}
				      		showsVerticalScrollIndicator={false}>
					        <TextField
								label={'Email'}
								highlightColor={styleVar.colors.primary}
								onChangeText={(value) => this.setState({ email : value})}
								keyboardType={'default'}
								ref="email"
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								value={this.state.email}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}
					        />
				      	</ScrollView>

				      	<TouchableHighlight onPress={() => this.resetPassword()}>
				      		<View style={styles.buttonPrimary}>
				      			<Text style={[styleVar.fontGothic, {color : styleVar.colors.white}]}>Reset Password</Text>
				      		</View>
				      	</TouchableHighlight>
			    	</View>
			    	
			    </View>
			</View>
		)
	}
};

module.exports = ForgotPassword;