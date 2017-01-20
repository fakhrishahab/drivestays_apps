import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	Dimensions,
	InteractionManager,
	AsyncStorage,
	TouchableWithoutFeedback,
	Switch,
	Navigator
} from 'react-native';

import styleVar from '../styleVar';
import styles from '../style/paymentStyle';
import CONSTANT from '../constantVar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextField from 'react-native-md-textinput';
import ModalSelect from '../plugin/ModalSelect';
import _ from 'underscore';
import ModalLoading from '../plugin/ModalLoading';
import ModalFeedback from '../plugin/ModalFeedback';

class Payment extends Component{
	constructor(props) {
		super(props);
	
		this.state = {
			renderPlaceholderOnly : true,
			access_token  : '',
			RequestID : this.props.data.RequestID,
			// RequestID : 77,
			user_data : '',
			paymentTypeText : '',
			paymentType : 'mastercard',
			paymentFirstName : 'Harris',
			paymentLastName : 'Nasution',
			paymentCCNumber : '5218531060920577',
			paymentCCV : '664',
			paymentCountry : 'US',
			paymentCountryText : '',
			paymentExpYear : '2019',
			paymentExpMonth : '05',
			paymentUserSwitch : false,
			paymentAddressLine1 : '11377, Woodside NY',
			paymentAddressLine2 : '',
			paymentCity : 'New York',
			paymentState : 'NY',
			paymentPostalCode : '11377',
			paymentTypeList : CONSTANT.PAYMENT_TYPE,
			showPaymentPicker : false,
			showCountryPicker : false,
			paymentCountryList : '',
			paymentCountryFilter : '',
			loading : false,
			showModalFeedback : false,
			textModalFeedback : ''
		};
	}

	validateForm(){
    	var status;

    	if(!this.state.paymentType){
    		alert('Please input Payment Type')
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentFirstName){
    		alert('Please input First Name');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentLastName){
    		alert('Please input Last Name');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentCCNumber){
    		alert('Please input Credit Card Number');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentCCV){
    		alert('Please input CCV');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentCountry){
    		alert('Please input Country');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentExpYear){
    		alert('Please input Expiration Year');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentExpMonth){
    		alert('Please input Expiration Month');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentAddressLine1){
    		alert('Please input Address Line 1');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentCity){
    		alert('Please input City');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentState){
    		alert('Please input State');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.paymentPostalCode){
    		alert('Please input Postal Code');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	return (true);
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(()=>{
			this.setState({renderPlaceholderOnly : false})
		});

		AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
			this.setState({access_token : value});
			// this._getInvoiceData();
		});

		AsyncStorage.getItem('USER_DATA').then((value) => {
			this.setState({user_data : JSON.parse(value)})
		});
	}

	componentWillMount(){
		this._getCountryCodes();
	}

	_getCountryCodes(){
		var request = new Request(CONSTANT.API_URL+'md/countrycodes', {
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
				// console.log(response.Data)
				var str = response.Data.replace(/Name/g, 'Description');
				this.setState({
					paymentCountryList : JSON.parse(str)
				});
			})
			.catch((err) => {
				console.log('error country list', err);
			})
	}

	initialLoad(status){
		if(status){
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
	}

	openCreditCardSelect(){
		this.setState({
			showPaymentPicker : true
		})
	}

	choosePaymentType(data){
		this.setState({
			paymentTypeText : data.Description,
			paymentType : data.NAME,
			showPaymentPicker : false
		})
	}

	paymentCountryTyping(value){
		this.setState({
			paymentCountryText : value
		});	

		if(value != ''){
			var getCountry =  _.filter(this.state.paymentCountryList, function(obj) {
			    // `~` with `indexOf` means "contains"
			    // `toLowerCase` to discard case of question string
			    return ~obj.Description.toLowerCase().indexOf(value.toLowerCase());
			});

			this.setState({
				showCountryPicker : true,
				paymentCountryFilter : _.first(getCountry, 5)
			});	

		}else{
			this.setState({
				showCountryPicker : false,
				paymentCountryFilter : _.first(this.state.paymentCountryList, 5),
				paymentCountry : ''
			});	
		}

	}

	renderCountryPicker(status){
		if(status){
			return(
				<View style={styles.countrySelectWrapper}>
					<ScrollView>
						{
							this.state.paymentCountryFilter.map((key, index) => {
								return(
									<TouchableWithoutFeedback key={index} onPress={() => this.chooseCountry(key)}>
										<View style={styles.countryListItem}><Text style={styleVar.size.h4}>{key.Description}</Text></View>
									</TouchableWithoutFeedback>
								)
							})
						}
					</ScrollView>
		        </View>
			)
		}else{
			return <View></View>
		}
	}

	chooseCountry(data){
		this.setState({
			paymentCountryText : data.Description,
			paymentCountry : data.Code,
			showCountryPicker : false
		})
	}

	openCountrySelect(){
		this.setState({
			showCountryPicker : true
		})
	}

	setUserData(value){
		this.setState({
			paymentUserSwitch: value
		})

		if(value){
			this.setState({
				paymentAddressLine1 : this.state.user_data.AddressLine1,
				paymentAddressLine2 : this.state.user_data.AddressLine2,
				paymentCity : this.state.user_data.City,
				paymentState : this.state.user_data.State,
				paymentPostalCode : this.state.user_data.PostalCode
			})
		}else{
			this.setState({
				paymentAddressLine1 : '',
				paymentAddressLine2 : '',
				paymentCity : '',
				paymentState : '',
				paymentPostalCode : ''
			})
		}
	}

	_savePayment(){
		this.setState({
			loading : true
		});
		// console.log(this.validateForm());
		var dataPayment = {
			RequestID : this.state.RequestID,
			city : this.state.paymentCity,
			country_code : this.state.paymentCountry,
			cvv2 : this.state.paymentCCV,
			expire_month : this.state.paymentExpMonth,
			expire_year : this.state.paymentExpYear,
			first_name : this.state.paymentFirstName,
			last_name : this.state.paymentLastName,
			line1 : this.state.paymentAddressLine1,
			line2 : this.state.paymentAddressLine2,
			number : this.state.paymentCCNumber,
			postal_code : this.state.paymentPostalCode,
			state : this.state.paymentState,
			type : this.state.paymentType
		};

		console.log(dataPayment);

		var request = new Request(CONSTANT.API_URL+'paypal/paywithcredit', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify(dataPayment)
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				console.log(response)
				if(response.Status == 200){
					this.setState({
						loading : false,
						textModalFeedback : 'Paypal Payment Successfull by refference number : '+response.Data.id+', We will redirecting you to booking list page',
						showModalFeedback : true,
					});
				}else{
					let error = new Error(response.Message);
					error.response = response;
					throw error;
				}
				
			})
			.catch((err) => {
				this.setState({
					loading : false
				});
				alert(err);
			})		
	}

	_doClickButton(){
		this.setState({
			showModalFeedback : false
		});

		var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
		sceneConfig.gestures.pop.disabled = true;

    	this.props.toRoute({
			name : 'booking',
			component : require('./myBooking'),
			data : {
				initialTab : 3
			},
    		sceneConfig : sceneConfig
		})
	}

	backSite(){
		this.props.toBack();
	}

	render(){
		if (this.state.renderPlaceholderOnly) {
	    	return this.initialLoad(true);
	    }

		return(
			<View style={styles.containerHome}>
				<View style={[styles.headerModal]}>
					<Icon name='arrow-back' size={30} color="#FFF" onPress={ () => this.backSite() }></Icon>
					<Text style={styles.headerTitle}>Payment Info</Text>
					<View style={{width : 30}}/>
				</View>

				<ModalSelect 
					viewModal={this.state.showPaymentPicker}
					data={this.state.paymentTypeList}
					onDataChoose={(data) => this.choosePaymentType(data)}/>

				<ModalLoading viewModal={this.state.loading}/>
				<ModalFeedback 
					viewModal={this.state.showModalFeedback}
					textModal={this.state.textModalFeedback}
					doClickButton={() => this._doClickButton()}/>

				{this.initialLoad(this.state.renderPlaceholderOnly)}

				<ScrollView style={{backgroundColor : styleVar.colors.greySecondary}}>

					<View style={styles.containerContent}>
						<Text style={[styleVar.size.h3, {color : styleVar.colors.black}]}>Credit Card</Text>
						<Text style={[styleVar.size.h4]}>Select Credit Card</Text>

						<ScrollView style={styles.inputGroupLong}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Credit Card'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								value={this.state.paymentTypeText}
								onFocus={() => this.openCreditCardSelect()}
								blurOnSubmit={true}
								autoGrow={false}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>

					        <Icon name="arrow-drop-down" size={30} color={styleVar.colors.primary} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>

			      		<ScrollView style={[styles.inputGroupLong]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'First Name'}
					            ref="firstName"
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'default'}
								value={this.state.paymentFirstName}
								onChangeText={(value) => this.setState({paymentFirstName : value})}
								blurOnSubmit={true}
								autoGrow={false}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>

			      		<ScrollView style={[styles.inputGroupLong]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Last Name'}
					            ref="lastName"
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'default'}
								value={this.state.paymentLastName}
								onChangeText={(value) => this.setState({paymentLastName : value})}
								blurOnSubmit={true}
								autoGrow={false}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>

			      		<View style={[styles.inputGroupLong, styles.inputGroupHorizontal]}>
			      			<ScrollView style={[styles.inputGroupMiddle]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'Credit Card Number'}
						            ref="ccNumber"
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'numeric'}
									value={this.state.paymentCCNumber}
									onChangeText={(value) => this.setState({paymentCCNumber : value})}
									blurOnSubmit={true}
									autoGrow={false}
									maxLength={16}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>

				      		<ScrollView style={[styles.inputGroupShort, {marginLeft : 10}]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'CCV'}
						            ref="ccv"
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'numeric'}
									maxLength={3}
									value={this.state.paymentCCV}
									onChangeText={(value) => this.setState({paymentCCV : value})}
									blurOnSubmit={true}
									autoGrow={false}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>
			      		</View>

			      		<ScrollView style={[styles.inputGroupLong, {position : 'relative'}]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Country'}
					            ref="country"
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								value={this.state.paymentCountryText}
								onChangeText={(value) => this.paymentCountryTyping(value)}
								blurOnSubmit={true}
								autoGrow={false}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>

					        <Icon name="arrow-drop-down" size={30} color={styleVar.colors.primary} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>

			      		<Text style={[styleVar.size.h4, {color : styleVar.colors.primary, marginTop : 10}]}>Expiration Date</Text>
			      		<View style={[styles.inputGroupLong, styles.inputGroupHorizontal]}>
			      			<ScrollView style={[styles.inputGroupShort]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'YYYY'}
						            ref="CCexpiredYear"
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'numeric'}
									value={this.state.paymentExpYear}
									onChangeText={(value) => this.setState({paymentExpYear : value})}
									blurOnSubmit={true}
									autoGrow={false}
									maxLength={4}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>

				      		<ScrollView style={[styles.inputGroupShort, {marginLeft : 10}]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'MM'}
						            ref="CCexpiredMonth"
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'numeric'}
									value={this.state.paymentExpMonth}
									onChangeText={(value) => this.setState({paymentExpMonth : value})}
									blurOnSubmit={true}
									autoGrow={false}
									maxLength={2}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>
				      		<View style={styles.inputGroupShort}>
				      		</View>
			      		</View>
					</View>

					{
						this.renderCountryPicker(this.state.showCountryPicker)
					}

					<View style={[styles.containerContent, {marginTop : 10}]}>
						<Text style={[styleVar.size.h3, {color : styleVar.colors.black, marginTop : 10}]}>Billing Information</Text>
						<Text style={[styleVar.size.h4]}>Fill with your paypal account detail</Text>

						<View style={[styles.inputGroupLong, styles.inputGroupHorizontal, {justifyContent : 'flex-start'}]}>
							<Switch
							onValueChange={(value) => { this.setUserData(value) }}
							style={{marginVertical: 10}}
							value={this.state.paymentUserSwitch} />
							<Text style={[styleVar.fontGothic]}>Use user information</Text>
						</View>
						<ScrollView style={[styles.inputGroupLong]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
					        <TextField
					            label={'Address Line 1'}
					            ref="address1"
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'default'}
								value={this.state.paymentAddressLine1}
								onChangeText={(value) => this.setState({paymentAddressLine1 : value})}
								blurOnSubmit={true}
								autoGrow={false}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>

			      		<ScrollView style={[styles.inputGroupLong]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
					        <TextField
					            label={'Address Line 2'}
					            ref="address2"
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'default'}
								value={this.state.paymentAddressLine2}
								onChangeText={(value) => this.setState({paymentAddressLine2 : value})}
								blurOnSubmit={true}
								autoGrow={false}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>

			      		<View style={[styles.inputGroupLong, styles.inputGroupHorizontal]}>
			      			<ScrollView style={[styles.inputGroupShort]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'City'}
						            ref="city"
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'default'}
									value={this.state.paymentCity}
									onChangeText={(value) => this.setState({paymentCity : value})}
									blurOnSubmit={true}
									autoGrow={false}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>

				      		<ScrollView style={[styles.inputGroupShort, {marginLeft : 10}]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'State'}
						            ref="state"
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'numeric'}
									value={this.state.paymentState}
									onChangeText={(value) => this.setState({paymentState : value})}
									blurOnSubmit={true}
									autoGrow={false}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>
			      		</View>

			      		<View style={[styles.inputGroupLong, styles.inputGroupHorizontal]}>
			      			<ScrollView style={[styles.inputGroupShort]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'Postal Code'}
						            ref="postalCode"
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'numeric'}
									value={this.state.paymentPostalCode}
									onChangeText={(value) => this.setState({paymentPostalCode : value})}
									blurOnSubmit={true}
									autoGrow={false}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>

				      		<View style={styles.inputGroupShort}>
				      		</View>
			      		</View>
					</View>

					<View style={{paddingHorizontal : 10}}>
						<TouchableWithoutFeedback onPress={() => {this._savePayment()}}>
					    	<View style={styles.buttonSave}>
					    		<Text style={{fontFamily : 'gothic', color : '#FFF', fontSize : 16}}>Review & Continue</Text>
					    	</View>
					    </TouchableWithoutFeedback>
					</View>
					
				</ScrollView>
			</View>
		)
	}
}

module.exports = Payment;
