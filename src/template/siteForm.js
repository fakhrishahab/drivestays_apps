import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	StyleSheet,
  	TextInput,
  	ScrollView,
  	InteractionManager,
  	AsyncStorage,
  	ActivityIndicator,
  	Modal,
  	Switch,
	DatePickerAndroid,
  	TouchableWithoutFeedback,
	Platform,
	PixelRatio,
	Keyboard,
	Image,
	Alert,
	Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import styleVar from '../styleVar';
import styles from '../style/siteFormStyle';
import TextField from 'react-native-md-textinput';
import CONSTANT from '../constantVar';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';
import moment from 'moment';
import _ from 'underscore';
import ModalSearchAddress from '../component/modalSearchAddress';
 
var vehicleTypeDataArr = [], 
	vehiclePictures = [],
	arrStatus = [];

let screenWidth = Dimensions.get('window').width;

class SiteForm extends Component{
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		dateNow : new Date(),
	  		renderPlaceholderOnly : true,
	  		preloadSaveInfo : false,
	  		vehicleID : (this.props.data) ? this.props.data.vehicleID : null,
	  		// vehicleID : 126,
	  		access_token : '',
	  		showSave : true,
	  		textInputValue : '',
	  		showPickerVehicle : false,
	  		vehicleTypeData : [],
	  		vehicleTypeText : '',
	  		vehicleTypeID : '',
	  		vehicleInputBrand : '',
	  		vehicleInputYear : '',
	  		vehicleInputWidth : '',
	  		vehicleInputHeight : '',
	  		vehicleInputLength : '',
	  		vehicleInputKitchen : false,
	  		vehicleInputShower : false,
	  		vehicleInputToilet : false,
	  		vehicleInputLicense : '',
	  		vehicleInputLicenseExp :'',
	  		// vehicleTypeText : 'Car',
	  		// vehicleTypeID : '1',
	  		// vehicleInputBrand : 'Toyota',
	  		// vehicleInputYear : '2010',
	  		// vehicleInputWidth : '100',
	  		// vehicleInputHeight : '200',
	  		// vehicleInputLength : '300',
	  		// vehicleInputKitchen : false,
	  		// vehicleInputShower : false,
	  		// vehicleInputToilet : false,
	  		// vehicleInputLicense : 'DD 123',
	  		// vehicleInputLicenseExp :'2016-09-10',
	  		siteInputAddress1 : '',
	  		siteInputAddress2 : '',
	  		siteInputAddress3 : '',
	  		siteInputCity : '',
	  		siteInputState : '',
	  		siteInputPostalCode : '',
	  		siteInputLatitude : '0',
	  		siteInputLongitude : '0',
	  		siteInputHeight : '',
	  		siteInputWidth : '',
	  		siteInputLength : '',
	  		siteInputAccess : false,
	  		siteInputSecurity : false,
	  		siteInputPower : false,
	  		siteInputDefaultRate : '',
	  		avatarSource : '',
    		preloadUploadInfo : false,
    		vehiclePictures : [],
    		showUploadContainer : false
	  	};
	}

	validateForm(){
		var status;

		//firstname, phone1, addressline1, City
		if(!this.state.siteInputAddress1){
			arrStatus.push('Address Line 1');
			status = false;
			// return false;
		}else{
			status = true;
		}

		if(!this.state.siteInputCity){
			arrStatus.push('City');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputState){
			arrStatus.push('State');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputPostalCode){
			arrStatus.push('Postal Code');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputLatitude){
			arrStatus.push('Latitude');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputLongitude){
			arrStatus.push('Longitude');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputHeight){
			arrStatus.push('Height');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputWidth){
			arrStatus.push('Width');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputLength){
			arrStatus.push('Length');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.siteInputDefaultRate){
			arrStatus.push('Default Rate');
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
				var defaultDate = new Date(options.date)
				if(!this.state.expiryDateText){
					newState[stateKey+'Text'] = '';
				}
			} else {
				var date = new Date(year, month, day);
				// newState[stateKey] = date.getFullYear() + '-'+ parseInt(date.getMonth()+1) + '-' + date.getDate()
			}

			// this.setState(newState);
			this.setState({
				vehicleInputLicenseExp : date.getFullYear() + '-'+ parseInt(date.getMonth()+1) + '-' + date.getDate()
			})
			// dismissKeyboard();
			// this.refs.expiry.blur();
		} catch ({code, message}) {
			console.warn(`Error in example '${stateKey}': `, message);
		}
    }

	placeChanged(details){
		this.setState({
			placeAddress : details.formatted_address,
			placeGeometry : details.geometry
		})
	}

	iconDone(){
		if(this.state.showSave){
			return(
				<Icon name='done' size={30} color="#FFF" onPress={() => this.props.onPlaceChange(this.state)}/>
			)
		}
	}

	backSite(){
		this.props.toBack();
	}

	componentWillMount(){
		InteractionManager.runAfterInteractions(()=>{
    		this.setState({renderPlaceholderOnly : false})
    	})

    	AsyncStorage.getItem("ACCESS_TOKEN").then((value) => {
        	this.setState({"access_token": value});
        	// console.log(this.state.vehicleID)

        	this._getVehicleType();

        	if(this.state.vehicleID){
        		this._getVehicleData()
        	}
    	})
	}

	_getVehicleData(){
		var request = new Request(CONSTANT.API_URL+'vehicle/get/'+this.state.vehicleID, {
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			}
		})

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				console.log(response.Data)
				this.setState({
					vehicleTypeText : response.Data.VehicleType,
					vehicleTypeID : response.Data.VehicleTypeID,
					vehicleInputBrand : response.Data.Make,
					vehicleInputYear : response.Data.Year.toString(),
					vehicleInputWidth : response.Data.Width.toString(),
					vehicleInputHeight : response.Data.Height.toString(),
					vehicleInputLength : response.Data.Length.toString(),
					vehicleInputKitchen : response.Data.Kitchen,
					vehicleInputShower : response.Data.Shower,
					vehicleInputToilet : response.Data.Toilet,
					vehicleInputLicense : response.Data.License,
					vehicleInputLicenseExp : moment(response.Data.LicenseExpiry).format('YYYY-MM-DD'),
					vehiclePictures : response.Data.VehiclePictures
				})

				vehiclePictures = response.Data.VehiclePictures
			})
			.catch((err) => {
				console.log('cannot retrieve vehicle data')
			})
	}

	_getVehicleType(){
		var request = new Request(CONSTANT.API_URL+'vehicleTypes/get', {
			method : 'GET',
			headers : {
				'Authorization' : this.state.access_token
			}
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				response.Data.map((key) => {
					vehicleTypeDataArr.push(key)
				})

				this.setState({
					vehicleTypeData : vehicleTypeDataArr
				})
			})
			.catch((err) => {
				// console.log(err);
				alert('Cannot get vehicle type data, check your internet connection');
			})
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

	uploadPicture(){
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

    			// console.log(response)

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

    			this._doUploadPicture(photo);
    		}
    	})
	}

	_doUploadPicture(uri){
		let formdata = new FormData();

		formdata.append('Memo', '');
		formdata.append('VehicleID', this.state.vehicleID);
		formdata.append('ThePicture', uri);

		var request = new Request(CONSTANT.API_URL+'Vehiclepicture/add', {
			method : 'POST',
			headers : {
				'Authorization' : this.state.access_token,
				'Accept' : 'application/json',
				'Content-Type' : 'multipart/form-data'
			},
			enctype : 'multipart/form-data',
			processData : false,
			contentType : false,
			body : formdata
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				var dataPicture = {
					ID: response.Data[0],
					Path: response.Data[1],
					Memo: "",
					Profile: false,
					VehicleID: this.state.vehicleID
    			}

    			vehiclePictures.push(dataPicture)

    			this.setState({
    				vehiclePictures : vehiclePictures,
    				preloadUploadInfo : false
    			})
			})
			.catch((err) => {
				console.log(err);
				alert('Failed Upload Picture, check your internet connection');
			})
	}

	_renderVehiclePictures(){
		return(				
			this.state.vehiclePictures.map((key) => {
				return (
					<View key={key.ID} style={styles.uploadedImageWrapper}>
						<Image source={{uri : CONSTANT.WEB_URL+key.Path}} style={styles.uploadedImage} />
						<View style={styles.imageButtonWrapper}>
							<Icon name="star" size={25} color={(key.Profile == true) ? styleVar.colors.secondary : '#FFF'} onPress={ ()=> this.setDefaultPicture(key.ID)} style={styles.imageButton}/>
							<Icon name="delete" size={25} color="#FFF" onPress={ ()=> this.deleteVehiclePicture(key.ID)} style={styles.imageButton}/>
						</View>
					</View>
				)
			})
		)
	}

	setDefaultPicture(id){

	}

	deleteVehiclePicture(id){
		var index = _.findLastIndex(vehiclePictures, {ID : id})

		vehiclePictures.splice(index, 1);

		this.setState({
			vehiclePictures : vehiclePictures
		})
	}

	uploadContainer(){
		if(this.state.showUploadContainer || this.state.vehicleID){
			return(
				<View style={styles.uploadContainer}>
					{this.preloadSave(this.state.preloadUploadInfo)}
			    	<View style={styles.uploadContainerTitle}>
			    		<Text>Upload Vehicle Picture</Text>
			    	</View>
			    	<View style={styles.uploadContainerContent}>
			    		{
			    			this._renderVehiclePictures()
			    		}
			    		
			    		<TouchableWithoutFeedback onPress={this.uploadPicture.bind(this)}>
			    			<View style={styles.uploadTrigger}>
			    				<Icon name='add-a-photo' size={50} color={styleVar.colors.greyDark}/>
			    			</View>
			    		</TouchableWithoutFeedback>
			    	</View>
			    </View>	
			)
		}else{
			return null
		}
	}

	_saveProcess(){

		this.setState({
			preloadSaveInfo : true
		})

		if(this.validateForm()){
			// console.log('ok go')

			// this.setState({
			// 	showUploadContainer : true
			// })

			if(this.state.vehicleID == null){
				this._doAddVehicle();
			}else{
				this._doUpdateVehicle();
			}
			
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

	_doAddVehicle(){
		var request = new Request(CONSTANT.API_URL+'vehicle/save', {
			method : 'POST',
			headers : {
				'Authorization' : this.state.access_token,
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
				VehicleTypeID : this.state.vehicleTypeID,
				Make : this.state.vehicleInputBrand,
				Year : this.state.vehicleInputYear,
				Width : this.state.vehicleInputWidth,
				Height : this.state.vehicleInputHeight,
				Length : this.state.vehicleInputLength,
				Shower : this.state.vehicleInputShower,
				Toilet : this.state.vehicleInputToilet,
				Kitchen : this.state.vehicleInputKitchen,
				License : this.state.vehicleInputLicense,
				LicenseExpiry : this.state.vehicleInputLicenseExp,
				Memo : ''
			})
		});

		fetch(request)
			.then((response) => {
				return response.json()
			})
			.then((response) => {
				this.setState({
					vehicleID : response.Data,
					preloadSaveInfo : false,
					showUploadContainer : true
				})
			})
			.catch((err) => {
				this.setState({
					preloadSaveInfo : false
				})
				alert('Add Data vehicle Error, check your input data or internet connection');
			})

	}

	_doUpdateVehicle(){

		var request = new Request(CONSTANT.API_URL+'vehicle/update', {
			method : 'POST',
			headers : {
    			'Accept': 'application/json',
				'Authorization' : this.state.access_token,
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
				ID : this.state.vehicleID,
				VehicleTypeID : this.state.vehicleTypeID,
				Make : this.state.vehicleInputBrand,
				Year : this.state.vehicleInputYear,
				Width : this.state.vehicleInputWidth,
				Height : this.state.vehicleInputHeight,
				Length : this.state.vehicleInputLength,
				Shower : this.state.vehicleInputShower,
				Kitchen : this.state.vehicleInputKitchen,
				Toilet : this.state.vehicleInputToilet,
				License : this.state.vehicleInputLicense,
				LicenseExpiry : this.state.vehicleInputLicenseExp,
				Memo : ''
			})
		});

		fetch(request)
			.then((response) => {
				return response.json()
			})
			.then((response) => {
				this.setState({
					preloadSaveInfo : false,
				})
			})
			.catch((err) => {
				this.setState({
					preloadSaveInfo : false
				})
				alert('Update Data site Error, check your input data or internet connection');
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

	onMapPress(e){
		// console.log(e.nativeEvent.coordinate.latitude)
		// console.log(e)
		// this.state.siteInputLatitude = latitude;
		// this.state.siteInputLatitude.setValue(latitude)
		this.setState({			
			siteInputLatitude : e.nativeEvent.coordinate.latitude.toString(),
			siteInputLongitude : e.nativeEvent.coordinate.longitude.toString()
		})

		var request = new Request('https://maps.googleapis.com/maps/api/geocode/json?latlng='+e.nativeEvent.coordinate.latitude.toString()+','+e.nativeEvent.coordinate.longitude.toString()+'&key=AIzaSyCyAzhSGNjz0VMDgLM1mJNajs7owgIa0Uk', {
			method : 'GET'
		})

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				var dataAddress = response.results[0];
				var componentForm = []
				// console.log(dataAddress.address_components)
				for (var i = 0; i < dataAddress.address_components.length; i++) {
					// console.log(response.results[1].address_components)
			        var addressType = dataAddress.address_components[i].types[0];
			        if (dataAddress.address_components[i]) {
			        		// console.log(dataAddress.address_components[i]['long_name'])
			        		// console.log(addressType)
			        		var val = dataAddress.address_components[i]['long_name'];
			        		componentForm[addressType] = val;
			        		console.log(componentForm)
			        		this.setState({
			        			siteInputAddress1 : componentForm['route'] + ', '+ componentForm['street_number'],
			        			siteInputCity : componentForm['administrative_area_level_2'],
			        			siteInputState : componentForm['country'],
			        			siteInputPostalCode : componentForm['postal_code']
			        		})
			        // //     var val = response.results.address_components[i]['long_name'];
			        // //     // componentForm[addressType] = val;
			        // //     console.log(val)
			        }
			    }
			})
			.catch((err) => {
				console.log('error')
			})
	}

	setMapMarker(){
		return(
			<MapView.Marker 
				ref='markerMap'
				coordinate={{
					latitude: parseFloat(this.state.siteInputLatitude), 
					longitude: parseFloat(this.state.siteInputLongitude), 
					latitudeDelta: 0, 
					longitudeDelta: 0
				}} 
				image={require('image!map_marker')}
				calloutOffset={{ x: -8, y: 28 }}
        		calloutAnchor={{ x: 0.5, y: 0.4 }}/>
		)
	}

	render(){
		if (this.state.renderPlaceholderOnly) {
	    	return this.preload();
	    }
		return(
			<View style={styles.containerHome}>
				<View style={[styles.headerModal]}>
					<Icon name='close' size={30} color="#FFF" onPress={ () => this.backSite() }></Icon>
					<Text style={styles.headerTitle}>Add Site</Text>
					<Icon name='done' size={30} color="#FFF" onPress={() => this.saveDataSite()}/>
				</View>

				<ScrollView>
					{this.preloadSave(this.state.preloadSaveInfo)}

					<View style={styles.containerContent}>

					    <ScrollView style={styles.inputText}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Address Line 1'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'default'}
								dense={false}
								ref="brand"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputAddress1 = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputAddress1}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Address Line 2'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="year"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputAddress2 = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputAddress2}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Address Line 3'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="width"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputAddress3 = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputAddress3}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'City'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="width"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputCity = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputCity}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'State'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="width"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputState = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputState}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Postal Code'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="width"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputPostalCode = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputPostalCode}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Latitude'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="width"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputLatitude = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputLatitude}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Longitude'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="width"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputLongitude = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputLongitude}/>
					    </ScrollView>

					    <View style={styles.viewportMaps}>
					    	<MapView
								ref="maps"
								style={[styles.map]}
								followUserLocation = {false}
								showsUserLocation = {false}
								onPress={this.onMapPress.bind(this)}
								region={this.state.mapRegion}
							>
								{
									this.setMapMarker()
								}
							</MapView>
					    </View>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Length'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="length"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputLength = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputLength}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Width'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="length"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputWidth = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputWidth}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Height'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="height"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputHeight = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputHeight}/>
					    </ScrollView>


					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Default Rate (US $)'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="height"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.siteInputDefaultRate = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.siteInputDefaultRate}/>
					    </ScrollView>

				    	<View style={styles.inputSwitch}>
					    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary, fontSize : 16, textAlign : 'left'}}>Access To Property ({(this.state.siteInputAccess) ? 'Lock' : 'No Lock'})</Text>
						    <Switch
								onValueChange={(value) => {this.setState({siteInputAccess: value})}}
								style={{marginVertical: 10}}
								value={this.state.siteInputAccess} />
					    </View>

					    <View style={styles.inputSwitch}>
					    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary, fontSize : 16}}>Security ({(this.state.siteInputSecurity) ? 'Yes' : 'No'})</Text>
						    <Switch
							onValueChange={(value) => {this.setState({siteInputSecurity: value})}}
							style={{marginVertical: 10}}
							value={this.state.siteInputSecurity} />
					    </View>

					    <View style={styles.inputSwitch}>
					    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary, fontSize : 16,}}>Powered ({(this.state.siteInputPower) ? 'Yes' : 'No'})</Text>
						    <Switch
							onValueChange={(value) => {this.setState({siteInputPower: value})}}
							style={{marginVertical: 10}}
							value={this.state.siteInputPower} />
					    </View>

					    {this.uploadContainer()}				    
					    
					    <TouchableWithoutFeedback onPress={() => {this._saveProcess()}}>
					    	<View style={styles.buttonSave}>
					    		<Text style={{fontFamily : 'gothic', color : '#FFF', fontSize : 16}}>{ (this.state.vehicleID) ? 'Update' : 'Save'}</Text>
					    	</View>
					    </TouchableWithoutFeedback>
					    
					</View>
				</ScrollView>
				
			</View>
		)
	}
}

module.exports = SiteForm;