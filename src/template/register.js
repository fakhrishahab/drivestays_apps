import React, {Component, PropTypes} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	Image,
	View,
	ScrollView,
	DatePickerAndroid,
	TouchableWithoutFeedback,
	AsyncStorage,
	Dimensions,
	ActivityIndicator,
	Alert,
	Platform,
	PixelRatio
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import HeaderContent from '../component/headerContent';
import AuthenticationAction from '../actions/authenticationAction';
import Routes from '../routes';
import AccessToken from '../accessToken';
import styleVar from '../styleVar';
import styles from '../style/registerStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextField from 'react-native-md-textinput';
import CONSTANT from '../constantVar';

let screenWidth = Dimensions.get('window').width;
var arrStatus = [];

class Register extends Component{	
	constructor(props) {
		super(props);

		this.state = {
			dateNow : new Date(),
			userData : {
				CustomerPictures : []
			},
			email : '',
			firstName : '',
			middleName : '',
			lastName : '',
			phone1 : '',
			phone2 : '',
			drivingLicense : '',
			expiryDate : '',
			addressLine1 : '',
			addressLine2 : '',
			addressLine3 : '',
			city : '',
			inputState : '',
			postalCode : '',
			access_token : '',
			preloadSaveInfo :false,
			avatarSource : null,
			preloadUploadInfo : false
		};

		this.email = '';
		this.firstName = '';
		this.middleName = '';
		this.lastName = '';
		this.phone1 = '';
		this.phone2 = '';
		this.drivingLicense = '';
		this.expiryDate = '';
		this.addressLine1 = '';
		this.addressLine2 = '';
		this.addressLine3 = '';
		this.city = '';
		this.inputState = '';
		this.postalCode = '';
	}

	validateForm(){
		var status;

		//firstname, phone1, addressline1, City
		if(!this.state.firstName){
			arrStatus.push('First Name');
			status = false;
			// return false;
		}else{
			status = true;
		}

		if(!this.state.phone1){
			arrStatus.push('Phone 1');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.addressLine1){
			arrStatus.push('Address Line 1');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.city){
			arrStatus.push('City');
			status = false;
			// return false
		}else{
			status = true;
		}

		return (status);
	}

	async showPicker(stateKey, options){
		try {
			var newState = {};
			const {action, year, month, day} = await DatePickerAndroid.open(options);
			if (action === DatePickerAndroid.dismissedAction) {
				// console.log(this.state.expiryDateText)
				var defaultDate = new Date(options.date)
				if(!this.state.expiryDateText){
					newState[stateKey + 'Text'] = '';
				}
				
				// newState[stateKey + 'Text'] = defaultDate.getFullYear() + '-' + parseInt(defaultDate.getMonth()+1) + '-' + defaultDate.getDate();
			} else {
				var date = new Date(year, month, day);
				// newState[stateKey + 'Text'] = date.toLocaleDateString();
				// newState[stateKey + 'Text'] = date.getFullYear() + '-'+ parseInt(date.getMonth()+1) + '-' + date.getDate();
				// newState[stateKey + 'Date'] = date;

			}

			// this.setState(newState);
			this.setState({
				expiryDateText : date.getFullYear() + '-'+ parseInt(date.getMonth()+1) + '-' + date.getDate()
			})
		} catch ({code, message}) {
			//console.warn(`Error in example '${stateKey}': `, message);
		}
    }

    _saveProcess(){
    	if(this.validateForm()){
    		this.setState({
    			preloadSaveInfo : true
    		})
    		this._doSave();
    	}else{
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

    _doSave(){
    	var data = JSON.stringify({
    			EmailAddress : this.state.userData.EmailAddress,
    			LastName : this.state.lastName,
    			FirstName : this.state.firstName,
    			MiddleName : this.state.middleName,
    			AddressLine1 : this.state.addressLine1,
    			AddressLine2 : this.state.addressLine2,
    			AddressLine3 : this.state.addressLine3,
    			PhoneNumber1 : this.state.phone1,
    			PhoneNumber2 : this.state.phone2,
    			City : this.state.city,
    			State : this.state.inputState,
    			PostalCode : this.state.postalCode,
    			LicenseNumber : this.state.drivingLicense,
    			LicenseExpiry : this.state.expiryDateText
    		})

    	// console.log(data)
    	var request = new Request(CONSTANT.API_URL+'customer/update', {
    		method : 'POST',
    		headers : {
    			'Accept': 'application/json',
    			'Content-Type' : 'application/json',
    			'Authorization' : this.state.access_token
    		},
    		body : JSON.stringify({
    			EmailAddress : this.state.userData.EmailAddress,
    			LastName : this.state.lastName,
    			FirstName : this.state.firstName,
    			MiddleName : this.state.middleName,
    			AddressLine1 : this.state.addressLine1,
    			AddressLine2 : this.state.addressLine2,
    			AddressLine3 : this.state.addressLine3,
    			PhoneNumber1 : this.state.phone1,
    			PhoneNumber2 : this.state.phone2,
    			City : this.state.city,
    			State : this.state.inputState,
    			PostalCode : this.state.postalCode,
    			LicenseNumber : this.state.drivingLicense,
    			LicenseExpiry : this.state.expiryDateText
    		})
    	})

    	fetch(request)
    		.then((response) => {
    			return response.json();
    		})
    		.then((response) => {
    			// console.log(response)
    			// this.setState({
	    		// 	preloadSaveInfo : false
	    		// })
    			AuthenticationAction.updateUser({
    				email : this.state.userData.EmailAddress,
    				access_token : this.state.access_token
    			})
    			this.props.replaceRoute(Routes.link('home'));
    		})
    		.catch((err) => {
    			this.setState({
	    			preloadSaveInfo : false
	    		})
    			// console.log(err)
    			alert("We Cannot retrieve data, check your internet connection");
    		})
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

	preloadUpload(status){
		if(status){
			return(
				<View style={styles.preloadUpload}>
					<ActivityIndicator
				        animating={true}
				        style={{height: 80, alignItems: 'center',justifyContent: 'center',padding: 8, marginTop: 10, flex: 1}}
				        color={styleVar.colors.secondary}
				        size="large"/>
				    <Text style={styles.preloadUploadText}>Uploading Image ...</Text>
				</View>
			)
		}else{
			return(
				<View>
				</View>
			)
		}
	}

	getUserData(){
		AsyncStorage.getItem("USER_DATA").then((value) => {
    		var userData = JSON.parse(value);
    		this.setState({
    			userData : userData
    		})
        	// console.log(userData)
        	this.setState({
        		userData : userData,
        		firstName : userData.FirstName,
        		lastName : (userData.LastName != null) ? userData.LastName : '',
        	})

        	this.state.firstName = JSON.parse(value).FirstName
    	}).done();
	}

    componentWillMount(){
    	this.getUserData();
    }

    componentDidMount(){
    	// console.log(this.state.userData)
    	AsyncStorage.getItem("ACCESS_TOKEN").then((value) => {
        	this.setState({"access_token": value});
    	}).done();

    	// AuthenticationAction.loadUser.completed.listen(this._doSave.bind(this));
    }

    selectPhoto(asset){
    	const options = {
    		quality : 1.0,
    		maxWidth :500,
    		maxHeight : 500,
    		storageOptions : {
    			skipBackup : true
    		}
    	};

    	ImagePicker.showImagePicker(options, (response) => {
    		// console.log('Repsonse', response)

    		if(response.didCancel){
    			console.log('User cancelled photo picker')
    		}
    		else if(response.error){
    			console.log('Image Picker Error', response.error)
    		}
    		else if(response.customButton){
    			console.log('User tapped custom button', response.customButton)
    		}
    		else{
    			var source;

    			var photo = {
					uri: response.uri,
					type: response.type,
					name: response.fileName,
				};
				// console.log(photo)
    			if(Platform.OS == 'android'){
    				source = { uri : response.uri, isStatic : true};
    			}else{
    				source = { uri : response.uri.replace('file://', ''), isStatic : true};
    			}

    			this.setState({
    				avatarSource : source,
    				preloadUploadInfo : true
    			})

    			this._doUploadPhoto(photo);
    		}
    	})
    }

    _doUploadPhoto(uri){
    	let formdata = new FormData();
    	formdata.append('ThePicture', uri)
    	// console.log(formdata);
    	var request = new Request(CONSTANT.API_URL+'customerpicture/add', {
    		method : 'POST',
    		headers : {
    			'Authorization' : this.state.access_token,
    			'Accept': 'application/json',
      			'Content-Type': 'multipart/form-data',
      			// 'Content-Language': React.NativeModules.RNI18n.locale
    		},
        	enctype: 'multipart/form-data',
	        processData: false,
	        contentType: false,
    		body : formdata
    	})

    	fetch(request)
    		.then((response) => {
    			return response.json();
    		})
    		.then((response) => {
    			console.log(response)
    			this.setState({
    				preloadUploadInfo : false
    			})

    			AuthenticationAction.updateUser({
    				email : this.state.userData.EmailAddress,
    				access_token : this.state.access_token
    			})

    			this.getUserData()
    		})
    		.catch((err) => {
    			console.log('error', err)
    			alert(err);
    		})
    }

    loadImage(){
    	if(this.state.userData.CustomerPictures.length < 1 && this.state.avatarSource === null){
    		return(
    			<Image 
					source={require('image!user_cover')} 
					resizeMode='contain'
					style={{height: 200, width : screenWidth}}/> 
			)
    	}
    	else if(this.state.userData.CustomerPictures.length >= 1 && this.state.avatarSource === null){
    		return(
    			<Image 
					source={{ uri : 'http://travellers.azurewebsites.net/'+this.state.userData.CustomerPictures[0].Path}}
					resizeMode='contain'
					style={{height: 200, width : screenWidth}}/> 
    		)
    	}
    	else {	
    		return(
    			<Image style={{height: 200, width: screenWidth}} source={this.state.avatarSource} />
    		)
    	}
    }

	render(){
		return(
			<View style={styles.containerHome}>
		    	<View style={[styles.headerModal]}>
					{
					//<Icon name='arrow-back' size={30} color={'#FFF'} onPress={() => this.backHome()}></Icon>
					}
					<Text style={styles.headerText}>User Detail</Text>
				</View>
				<ScrollView>
					{this.preloadSave(this.state.preloadSaveInfo)}

					<View style={styles.photoContainer}>
						{this.preloadUpload(this.state.preloadUploadInfo)}



						{this.loadImage()}
						
						<TouchableWithoutFeedback onPress={this.selectPhoto.bind(this)}>
							<View style={styles.uploadTrigger}>
								<Icon name="local-see" size={30} color='#FFFFFF'></Icon>
							</View>
						</TouchableWithoutFeedback>
			    	</View>

			    	

			    	<View style={styles.containerContent}>
						
						<Text style={{color: styleVar.colors.primary}}>Please Input this form below to completing your register process</Text>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
					      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'First Name'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.firstName = text}
									keyboardType={'default'}
									ref="firstName"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.firstName}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Middle Name'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.middleName = text}
									keyboardType={'default'}
									ref="middleName"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.middleName}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Last Name'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.lastName = text}
									keyboardType={'default'}
									ref="lastName"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.lastName}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Phone 1'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.phone1 = text}
									keyboardType={'numeric'}
									ref="phone1"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.phone1}
						        />
					      	</ScrollView>

					      	<ScrollView style={[styles.inputText, {paddingLeft : 10}]}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Phone 2'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.phone2 = text}
									keyboardType={'numeric'}
									ref="phone2"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.phone2}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Driving License'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.drivingLicense = text}
									keyboardType={'default'}
									ref="drivingLicense"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.drivingLicense}
						        />
					      	</ScrollView>

					      	<ScrollView style={[styles.inputText, {paddingLeft : 10}]}
					      		showsVerticalScrollIndicator={false}>
						        <TextField
						          label={'Expiry Date'}
						          highlightColor={styleVar.colors.secondary}
						          keyboardType={'default'}
						          ref="expiryDate"
						          textColor={styleVar.colors.secondary}
						          labelColor={styleVar.colors.greyDark}
						          dense={true}
						          onFocus={this.showPicker.bind(this, 'expiryDate', {
						          	date: this.state.dateNow
						          })}
						          blurOnSubmit={true}
						          labelStyle={{fontFamily : 'gothic'}}
						          inputStyle={{fontFamily : 'gothic', paddingLeft: 0}}
						          
						          value={this.state.expiryDateText}
						          editable={false}/>
						        <Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Address Line 1'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.addressLine1 = text}
									keyboardType={'default'}
									ref="addressLine1"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.addressLine1}
									multiline={true}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Address Line 2'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.addressLine2 = text}
									keyboardType={'default'}
									ref="addressLine2"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.addressLine2}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Address Line 3'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.addressLine3 = text}
									keyboardType={'default'}
									ref="addressLine3"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.addressLine3}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'City'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.city = text}
									keyboardType={'default'}
									ref="city"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.city}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'State'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.inputState = text}
									keyboardType={'default'}
									ref="inputState"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.inputState}
						        />
					      	</ScrollView>
						</View>

						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
						      		showsVerticalScrollIndicator={false}>
						        <TextField
									label={'Postal Code'}
									highlightColor={styleVar.colors.secondary}
									onChangeText={(text) => this.state.postalCode = text}
									keyboardType={'numeric'}
									ref="postalCode"
									textColor={styleVar.colors.secondary}
									labelColor={styleVar.colors.greyDark}
									dense={true}
									value={this.state.postalCode}
						        />
					      	</ScrollView>
						</View>

						<TouchableWithoutFeedback onPress={() => this._saveProcess()}>
							<View  style={styles.btnSave}>
							<Text style={styles.btnSaveCaption}>Continue</Text>
							</View>
						</TouchableWithoutFeedback>
			    	</View>
			    </ScrollView>
		    </View>
		)
	}
}

module.exports = Register;
