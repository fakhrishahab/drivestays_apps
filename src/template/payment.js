import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	Dimensions,
	InteractionManager,
	AsyncStorage,
	TouchableWithoutFeedback
} from 'react-native';

import styleVar from '../styleVar';
import styles from '../style/paymentStyle';
import CONSTANT from '../constantVar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextField from 'react-native-md-textinput';
import ModalSelect from '../plugin/ModalSelect';
import _ from 'underscore';

class Payment extends Component{
	constructor(props) {
		super(props);
	
		this.state = {
			renderPlaceholderOnly : true,
			access_token  : '',
			paymentTypeText : '',
			paymentType : '',
			paymentFirstName : '',
			paymentLastName : '',
			paymentCCNumber : '',
			paymentCCV : '',
			paymentCountry : '',
			paymentCountryText : '',
			paymentExpYear : '',
			paymentExpMonth : '',
			paymentAddressLine1 : '',
			paymentAddressLine2 : '',
			paymentCity : '',
			paymentState : '',
			paymentPostalCode : '',
			paymentTypeList : CONSTANT.PAYMENT_TYPE,
			showPaymentPicker : false,
			showCountryPicker : false,
			paymentCountryList : '',
			paymentCountryFilter : ''
		};
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(()=>{
			this.setState({renderPlaceholderOnly : false})
		})

		AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
			this.setState({access_token : value});

			// this._getInvoiceData();
		})

		
		// console.log('RequestID', this.state.RequestID)
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
				console.log('sukses country list')
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
			paymentType : data.Name,
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
				paymentCountryFilter : _.first(this.state.paymentCountryList, 5)
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
						            label={'YY'}
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
									maxLength={2}
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
					
					
				</ScrollView>
			</View>
		)
	}
}

module.exports = Payment;
