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
	Dimensions,
	Navigator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import ScrollTabView,{DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import styleVar from '../styleVar';
import styles from '../style/siteFormStyle';
import TextField from 'react-native-md-textinput';
import CONSTANT from '../constantVar';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';
import moment from 'moment';
import _ from 'underscore';
import ModalSearchAddress from '../component/modalSearchAddress';
import ModalSelect from '../plugin/ModalSelect';
 
var arrStatus = [],
	amenityTypeDataArr = [];

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
var index = 1;
let amenityFormArr = [];
let closureFormArr = [];
let rateFormArr = [];
let pictureFormArr = [];

class SiteForm extends Component{
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		dateNow : new Date(),
	  		renderPlaceholderOnly : true,
	  		preloadSaveInfo : false,
	  		preloadSaveAmenities : false,
	  		preloadSaveClosure : false,
	  		preloadSaveRate : false,
	  		preloadSavePictures : false,
	  		siteID : (this.props.data.siteID) ? this.props.data.siteID : null,
	  		// vehicleID : 126,
	  		// siteID : 330,
	  		access_token : '',
	  		showSave : true,
	  		textInputValue : '',
	  		siteInputAddress1 : '',
	  		siteInputAddress2 : '',
	  		siteInputAddress3 : '',
	  		siteInputCity : '',
	  		siteInputState : '',
	  		siteInputPostalCode : '',
	  		siteInputLatitude : (this.props.data.latitude) ? this.props.data.latitude.toString() : '',
	  		siteInputLongitude : (this.props.data.longitude) ? this.props.data.longitude.toString() : '',
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

    		propertyPictures : [],
    		propertyAmenities : [],
    		propertyClosures : [],
    		propertyRates : [],
    		showUploadContainer : false,
    		modalVisible : false,
    		region : {
    			latitude : 0,
    			longitude : 0,
				latitudeDelta: 10,
				longitudeDelta: 10,
    		},
    		siteInputAmenityTypeID : '',
    		siteInputAmenityType : '',
    		siteInputAmenityRate : '',
    		amenityFormArr : amenityFormArr,
    		showAmenityForm : false,
    		showPickerAmenityType : false,
    		amenityTypeData : [],
    		indexEditAmenity : null,
    		showClosureForm : false,
    		closureFormArr : closureFormArr,
    		rateFormArr : rateFormArr,
    		showRateForm : false,
    		rateTypeData : [],
    		showPickerRateType : false,
    		siteInputRateTypeID : '',
    		siteInputRateType : '',
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

	closeModal(){
    	this.setState({
    		modalVisible : false
    	})
    }

    onPlaceChange(details){
    	// console.log(details)

    	this.mapDetailsAddress(details.placeDetails)

    	this.setState({
    		modalVisible : false,
    		siteInputAddress1 : details.placeAddress,
    		siteInputLatitude : details.placeGeometry.location.lat.toString(),
    		siteInputLongitude : details.placeGeometry.location.lng.toString(),
    		region : {
    			latitude : details.placeGeometry.location.lat,
    			longitude : details.placeGeometry.location.lng,
				latitudeDelta: 0.092,
				longitudeDelta: 0.042,
    		}
    		// geometry : details.placeGeometry
    	})

    }

    setModalVisible(visible){
    	this.setState({
    		modalVisible : true
    	})
    }

    async showDatePickerRate(stateKey, options){
    	try{
    		var newState = {};
    		const {action, year, month, day} = await DatePickerAndroid.open(options);

    		if(action == DatePickerAndroid.dismissedAction){

    			if(options.type == 'update'){
					this.refs.EffectiveFromRateUpdate.blur();
					this.refs.EffectiveToRateUpdate.blur();
				}else{
					this.refs.EffectiveFromRate.blur();
					this.refs.EffectiveToRate.blur();
				}

    		}else{

    			var date = new Date(year, month, day);
    			newState[stateKey] = moment(date).format('YYYY-MM-DD')

				if(stateKey == 'siteInputRateFrom'){

					this.setState({
						minDateRate : date
					});

				}else{

					this.setState({
						maxDateRate : date
					});

				}

				if(options.type){

					if(stateKey == 'siteInputRateFromUpdate'){
						this.state.rateFormArr[options.index].FromDate = date;
						this.refs.EffectiveFromRateUpdate.blur();
					}else{
						this.state.rateFormArr[options.index].ToDate = date
						// this.refs.EffectiveToDateUpdate.blur();
					}

					// this.refs.EffectiveFromRateUpdate.blur()
					// this.refs.EffectiveToDateUpdate.blur()

				}else{
					this.refs.EffectiveFromRate.blur();
					this.refs.EffectiveToRate.blur();
				}


    		}

    		this.setState(newState);

    	}catch ({code, message}) {
			console.warn(`Error in example '${stateKey}': `, message);
		}
    }

	async showDatePickerClosure(stateKey, options){
		try {
			var newState = {};
			const {action, year, month, day} = await DatePickerAndroid.open(options);
			if (action === DatePickerAndroid.dismissedAction) {
				var defaultDate = new Date(options.date)
				if(options.type == 'update'){
					this.refs.EffectiveFromUpdate.blur();
					this.refs.EffectiveToUpdate.blur();
				}else{
					this.refs.EffectiveFrom.blur();
					this.refs.EffectiveTo.blur();
				}
				
			} else {
				var date = new Date(year, month, day);
				newState[stateKey] = moment(date).format('YYYY-MM-DD')

				if(stateKey == 'siteInputClosureFrom'){
					this.setState({
						minDate : date
					})

					
				}else{
					this.setState({
						maxDate : date
					})

					
				}

				if(options.type){
					if(stateKey == 'siteInputClosureFromUpdate'){
						this.state.closureFormArr[options.index].FromDate = date
					}else{
						this.state.closureFormArr[options.index].ToDate = date
					}

					this.refs.EffectiveFromUpdate.blur()
					this.refs.EffectiveToUpdate.blur()

				}else{
					this.refs.EffectiveFrom.blur();
					this.refs.EffectiveTo.blur();
				}

				
			}

			this.setState(newState);
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

        	this._getAmenityType();
        	this._getRateType();

        	if(this.state.siteID){
        		this._getSiteData(this.state.siteID)
        	}else{
        		amenityFormArr = [];
        		closureFormArr = [];
        		rateFormArr = [];
        		this.setState({
        			amenityFormArr : [],
        			closureFormArr : [],
        			rateFormArr : []
        		});
        	}
    	});

    	if(this.state.siteID){
    		this.setState({
	    		region : {
	    			latitude : (this.state.siteInputLatitude) ? parseFloat(this.state.siteInputLatitude) : 0,
	    			longitude : (this.state.siteInputLongitude) ? parseFloat(this.state.siteInputLongitude) : 0,
					latitudeDelta: 0.092,
					longitudeDelta: 0.042,
	    		}
	    	})
    	}    	
	}

	_getAmenityType(){
		var request = new Request(CONSTANT.API_URL+'amenitytypes/get', {
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			}
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				amenityTypeDataArr = [];
				response.Data.map((key) => {
					amenityTypeDataArr.push(key)	
				})

				this.setState({
					amenityTypeData : amenityTypeDataArr
				})
				
			})
			.catch((err) => {
				console.log('error', err)
			})
	}

	componentDidMount(){
		if(!this.state.siteID){
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// console.log(position.coords);
					this.setState({
						siteInputLatitude : position.coords.latitude.toString(),
						siteInputLongitude : position.coords.longitude.toString(),
						region : {
							latitude : position.coords.latitude,
							longitude : position.coords.longitude,
							latitudeDelta : 0.092,
							longitudeDelta : 0.042,
						}
					})
				},
				(error) => console.log(error),
				{enableHighAccuracy: true, timeout : 20000, maximumAge : 1000}
			);
		}

		this.watchID = navigator.geolocation.watchPosition(
			(position) => {
			    var lastPosition = JSON.stringify(position);
			    // console.log(lastPosition)
			    // this.setState({lastPosition});
			});
		
	}

	_getSiteData(ID){
		var request = new Request(CONSTANT.API_URL+'property/get/'+ID, {
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
					siteInputAddress1 : response.Data.AddressLine1,
					siteInputAddress2 : (response.Data.AddressLine2) ? response.Data.AddressLine2 : '',
					siteInputAddress3 : (response.Data.AddressLine3) ? response.Data.AddressLine3 : '',
					siteInputCity : response.Data.City,
					siteInputState : response.Data.State,
					siteInputPostalCode : response.Data.PostalCode.toString(),
					siteInputLatitude : response.Data.Latitude.toString(),
					siteInputLongitude : response.Data.Longitude.toString(),
					siteInputWidth : (response.Data.Width) ? response.Data.Width.toString() : '',
					siteInputHeight : (response.Data.Height) ? response.Data.Height.toString() : '', 
					siteInputLength : (response.Data.Length) ? response.Data.Length.toString() : '',
					siteInputPower : response.Data.Powered,
					siteInputSecurity : response.Data.Security,
					siteInputAccess : response.Data.AccessToProperty,
					siteInputDefaultRate : response.Data.DefaultRate.toString(),
					propertyRates : response.Data.PropertyRates,
					propertyClosures : response.Data.PropertyClosures,
					propertyPictures : response.Data.PropertyPictures,
					propertyAmenities : response.Data.PropertyAmenities,
					amenityFormArr : response.Data.PropertyAmenities,
					closureFormArr : response.Data.PropertyClosures,
					rateFormArr : response.Data.PropertyRates,
					region : {
		    			latitude : response.Data.Latitude,
		    			longitude : response.Data.Longitude,
						latitudeDelta: 0.092,
						longitudeDelta: 0.042,
		    		}
				})

				amenityFormArr = response.Data.PropertyAmenities;
				closureFormArr = response.Data.PropertyClosures;
				rateFormArr = response.Data.PropertyRates;

				// renderClosure();
				// console.log(amenityFormArr)
				// console.log(this.state.propertyAmenities)
				
				// this.setMapMarker();
				// vehiclePictures = response.Data.VehiclePictures
			})
			.catch((err) => {
				console.log('error',err)
				Alert('cannot retrieve site data')
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

	

	_saveProcess(){

		if(this.validateForm()){
			// console.log('ok go')

			this.setState({
				preloadSaveInfo : true
			})

			if(this.state.siteID == null){
				this._doAddSite();
			}else{
				this._doUpdateSite();
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

	_doAddSite(){

		var request = new Request(CONSTANT.API_URL+'property/save', {
			method : 'POST',
			headers : {
				'Authorization' : this.state.access_token,
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
				AddressLine1 : this.state.siteInputAddress1,
				AddressLine2 : this.state.siteInputAddress2,
				AddressLine3 : this.state.siteInputAddress3,
				City : this.state.siteInputCity,
				State : this.state.siteInputState,
				PostalCode : this.state.siteInputPostalCode,
				Latitude : parseFloat(this.state.siteInputLatitude),
				Longitude : parseFloat(this.state.siteInputLongitude),
				Width : parseInt(this.state.siteInputWidth),
				Height : parseInt(this.state.siteInputHeight),
				Length : parseInt(this.state.siteInputLength),
				Powered : this.state.siteInputPower,
				Security : this.state.siteInputSecurity,
				AccessToProperty : this.state.siteInputAccess,
				DefaultRate : parseInt(this.state.siteInputDefaultRate),
			})
		});

		fetch(request)
			.then((response) => {
				return response.json()
			})
			.then((response) => {
				// console.log(response.Data)
				this.setState({
					preloadSaveInfo : false
				})

				// this.backSite();
			})
			.catch((err) => {
				this.setState({
					preloadSaveInfo : false
				})
				alert('Add Data Site Error, check your input data or internet connection');
			})

	}

	_doUpdateSite(){

		var request = new Request(CONSTANT.API_URL+'property/update', {
			method : 'POST',
			headers : {
    			'Accept': 'application/json',
				'Authorization' : this.state.access_token,
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
				AddressLine1 : this.state.siteInputAddress1,
				AddressLine2 : this.state.siteInputAddress2,
				AddressLine3 : this.state.siteInputAddress3,
				City : this.state.siteInputCity,
				State : this.state.siteInputState,
				PostalCode : this.state.siteInputPostalCode,
				Latitude : parseFloat(this.state.siteInputLatitude),
				Longitude : parseFloat(this.state.siteInputLongitude),
				Width : parseInt(this.state.siteInputWidth),
				Height : parseInt(this.state.siteInputHeight),
				Length : parseInt(this.state.siteInputLength),
				Powered : this.state.siteInputPower,
				Security : this.state.siteInputSecurity,
				AccessToProperty : this.state.siteInputAccess,
				DefaultRate : parseInt(this.state.siteInputDefaultRate),
				ID : this.state.siteID
			})
		});

		fetch(request)
			.then((response) => {
				return response.json()
			})
			.then((response) => {
				// console.log(response)
				this.setState({
					preloadSaveInfo : false,
				})

				this.backSite();
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
				<View style={{position:'absolute', flex: 1, width: screenWidth, bottom:0, top:0, left:0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 5, elevation : 10}}>
					<ActivityIndicator
				        animating={true}
				        style={{height: 80,padding: 8, marginTop: 50}}
				        color={styleVar.colors.secondary}
				        size="large"/>
				</View>
			)
		}else{
			return(
				<View style={{backgroundColor : 'red', position:'absolute'}}>
				</View>
			)
		}
	}

	onMapPress(e){
		// console.log(e.nativeEvent)
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

				this.mapDetailsAddress(dataAddress)
				
			})
			.catch((err) => {
				console.log('error')
			})
	}

	mapDetailsAddress(dataAddress){
		var componentForm = []

		for (var i = 0; i < dataAddress.address_components.length; i++) {
	        var addressType = dataAddress.address_components[i].types[0];
	        if (dataAddress.address_components[i]) {

	        		var val = dataAddress.address_components[i]['long_name'];
	        		componentForm[addressType] = val;

	        		this.setState({
	        			siteInputAddress1 : componentForm['route'] + ', '+ (componentForm['street_number']) ? componentForm['street_number'] : '',
	        			siteInputCity : componentForm['administrative_area_level_1'],
	        			siteInputState : componentForm['country'],
	        			siteInputPostalCode : componentForm['postal_code']
	        		})
	        }
	    }
	}

	setMapMarker(){
		if(this.state.siteInputLatitude != '' && this.state.siteInputLongitude != ''){

			return(
				<MapView.Marker 
					ref='markerMap'
					coordinate={{
						latitude: parseFloat(this.state.siteInputLatitude), 
						longitude: parseFloat(this.state.siteInputLongitude), 
						// latitude: -6.2773382, 
						// longitude: 106.83129819999999
					}} 
					image={require('image!map_marker')}
					calloutOffset={{ x: -8, y: 28 }}
	        		calloutAnchor={{ x: 0.5, y: 0.4 }}/>
			)	
		}else{
			return null
		}
		
	}

	renderSiteInfo(){
		return(
			<View style={styles.containerContent}>

			    <ScrollView style={styles.inputText}
	      		showsVerticalScrollIndicator={false}
	      		scrollEnabled={true}>
			        <TextField
						label={'Address Line 1'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'default'}
						dense={true}
						ref="addressline1"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={false}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputAddress1 = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputAddress1}
						onFocus={() => this.setModalVisible(true)}/>
			    </ScrollView>

			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'Address Line 2'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="year"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputAddress2 = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputAddress2}/>
			    </ScrollView>

			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'Address Line 3'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="width"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputAddress3 = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputAddress3}/>
			    </ScrollView>

			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'City'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="width"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputCity = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputCity}/>
			    </ScrollView>

			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'State'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="width"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputState = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputState}/>
			    </ScrollView>

			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'Postal Code'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="width"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputPostalCode = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputPostalCode}/>
			    </ScrollView>

			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'Latitude'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="width"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputLatitude = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputLatitude}/>
			    </ScrollView>

			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'Longitude'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="width"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputLongitude = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputLongitude}/>
			    </ScrollView>

			    <View style={styles.viewportMaps}>
			    	<MapView
			    		region={this.state.region}
						ref="maps"
						style={[styles.map]}
						followUserLocation = {false}
						showsUserLocation = {false}
						onPress={this.onMapPress.bind(this)}
					>
						{
							this.setMapMarker()
						}
					</MapView>
			    </View>

			    <View style={{flexDirection : 'row', justifyContent : 'space-between', height : 55}}>
			    	<ScrollView style={styles.inputText}
				    showsVerticalScrollIndicator={false}
		      		scrollEnabled={false}>
				        <TextField
							label={'Length'}
							highlightColor={styleVar.colors.secondary}
							keyboardType={'numeric'}
							dense={true}
							ref="length"
				          	textColor={styleVar.colors.black}
							labelColor={styleVar.colors.primary}
							editable={true}
							blurOnSubmit={true}
							onChangeText={(text) => this.state.siteInputLength = text}
							labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
							inputStyle={{fontFamily : 'gothic'}}
							value={this.state.siteInputLength}/>
				    </ScrollView>

				    <ScrollView style={styles.inputText}
				    showsVerticalScrollIndicator={false}
		      		scrollEnabled={false}>
				        <TextField
							label={'Width'}
							highlightColor={styleVar.colors.secondary}
							keyboardType={'numeric'}
							dense={true}
							ref="length"
				          	textColor={styleVar.colors.black}
							labelColor={styleVar.colors.primary}
							editable={true}
							blurOnSubmit={true}
							onChangeText={(text) => this.state.siteInputWidth = text}
							labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
							inputStyle={{fontFamily : 'gothic'}}
							value={this.state.siteInputWidth}/>
				    </ScrollView>

				    <ScrollView style={styles.inputText}
				    showsVerticalScrollIndicator={false}
		      		scrollEnabled={false}>
				        <TextField
							label={'Height'}
							highlightColor={styleVar.colors.secondary}
							keyboardType={'numeric'}
							dense={true}
							ref="height"
				          	textColor={styleVar.colors.black}
							labelColor={styleVar.colors.primary}
							editable={true}
							blurOnSubmit={true}
							onChangeText={(text) => this.state.siteInputHeight = text}
							labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
							inputStyle={{fontFamily : 'gothic'}}
							value={this.state.siteInputHeight}/>
				    </ScrollView>

			    </View>

			    
			    <ScrollView style={styles.inputText}
			    showsVerticalScrollIndicator={false}
	      		scrollEnabled={false}>
			        <TextField
						label={'Default Rate (US $)'}
						highlightColor={styleVar.colors.secondary}
						keyboardType={'numeric'}
						dense={true}
						ref="height"
			          	textColor={styleVar.colors.black}
						labelColor={styleVar.colors.primary}
						editable={true}
						blurOnSubmit={true}
						onChangeText={(text) => this.state.siteInputDefaultRate = text}
						labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
						inputStyle={{fontFamily : 'gothic'}}
						value={this.state.siteInputDefaultRate}/>
			    </ScrollView>

		    	<View style={styles.inputSwitch}>
			    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary, textAlign : 'left'}}>Access To Property ({(this.state.siteInputAccess) ? 'Lock' : 'No Lock'})</Text>
				    <Switch
						onValueChange={(value) => {this.setState({siteInputAccess: value})}}
						style={{marginVertical: 10}}
						value={this.state.siteInputAccess} />
			    </View>

			    <View style={styles.inputSwitch}>
			    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary}}>Security ({(this.state.siteInputSecurity) ? 'Yes' : 'No'})</Text>
				    <Switch
					onValueChange={(value) => {this.setState({siteInputSecurity: value})}}
					style={{marginVertical: 10}}
					value={this.state.siteInputSecurity} />
			    </View>

			    <View style={styles.inputSwitch}>
			    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary}}>Powered ({(this.state.siteInputPower) ? 'Yes' : 'No'})</Text>
				    <Switch
					onValueChange={(value) => {this.setState({siteInputPower: value})}}
					style={{marginVertical: 10}}
					value={this.state.siteInputPower} />
			    </View>

			    {
			    //	this.uploadContainer()
			    }				    
			    
			    <TouchableWithoutFeedback onPress={() => {this._saveProcess()}}>
			    	<View style={styles.buttonSave}>
			    		<Text style={{fontFamily : 'gothic', color : '#FFF', fontSize : 16}}>{ (this.state.vehicleID) ? 'Update' : 'Save'}</Text>
			    	</View>
			    </TouchableWithoutFeedback>
			    
			</View>
		)
	}

	renderAmenities(){
		// console.log(this.state.amenityFormArr)
		return(
			this.state.amenityFormArr.map( (data, index) => {
				// console.log('rate',data.Rate.toString())
				return(
					<View style={styles.inputGroupHorizontal} key={index}>
						<ScrollView style={styles.inputGroupLong}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Amenity Type'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								value={data.Memo}
								onFocus={() => this.openAmenityTypeSelect(index)}
								blurOnSubmit={true}
								onChangeText={() => this.refs.Rate.focus()}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>

					        <Icon name="arrow-drop-down" size={30} color={styleVar.colors.primary} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>

			      		<ScrollView style={[styles.inputGroupMiddle, {marginLeft : 10}]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Rate / Day'}
					            ref="Rate"
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'numeric'}
								value={data.Rate.toString()}
								onChangeText={(value) => this.state.amenityFormArr[index].Rate = value}
								blurOnSubmit={true}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>

			      		<View style={[styles.inputGroupMiddle, styles.inputGroupHorizontal, {justifyContent : 'flex-end', alignItems : 'center'}]}>
			      			<TouchableWithoutFeedback onPress={() => this._updateAmenity(index)}>
			      				<View style={styles.inputGroupButton}>
			      					<Icon name="archive" size={25} color={styleVar.colors.greyDark} style={{}}></Icon>
			      				</View>
			      			</TouchableWithoutFeedback>

			      			<TouchableWithoutFeedback onPress={() => this._deleteAmenity(index)}>
			      				<View style={[styles.inputGroupButton, {marginLeft : 5}]}>
			      					<Icon name="delete" size={25} color={styleVar.colors.greyDark} style={{}}></Icon>
			      				</View>
			      			</TouchableWithoutFeedback>
			      		</View>
					</View>
				)
			})
		)
	}

	_updateAmenity(index){
		this.setState({
			preloadSaveAmenities : true
		})

		var data = JSON.stringify({
			ID : this.state.amenityFormArr[index].ID,
			Rate : parseInt(this.state.amenityFormArr[index].Rate),
			Memo : this.state.amenityFormArr[index].Memo,
			AmenityTypeID : this.state.amenityFormArr[index].AmenityTypeID,
			PropertyID : this.state.siteID
		})

		var request = new Request(CONSTANT.API_URL+'propertyamenity/update', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : data
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response)
				this.setState({
					preloadSaveAmenities : false,
					indexEditAmenity : null
				})
			})
			.catch((err) => {
				this.setState({
					preloadSaveAmenities : false
				})
				alert('Failed updating amenity data');
			})
	}

	_deleteAmenity(index){
		this.setState({
			preloadSaveAmenities : true
		})

		var request = new Request(CONSTANT.API_URL+'propertyamenity/delete/'+amenityFormArr[index].ID, {
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
				// console.log(response);

				amenityFormArr.splice(index, 1)

				this.setState({
					amenityFormArr : amenityFormArr,
					preloadSaveAmenities : false
				})

				if(this.state.amenityFormArr.length <= 1){
					
					let amenityFormArr = [];
				}
			})
			.catch((err) => {
				alert('Failed deleteing amenity data')
				console.log(err)
				this.setState({
					preloadSaveAmenities : false
				})
			})
		// console.log(amenityFormArr)
	}

	renderAmenityButton(){
		if(this.state.showAmenityForm){
			return(
				<View style={styles.inputGroupHorizontal} >
					<ScrollView style={styles.inputGroupLong}
		      		showsVerticalScrollIndicator={false}
		      		scrollEnabled={false}>
				        <TextField
				            label={'Amenity Type'}
							highlightColor={styleVar.colors.secondary}
							editable={false}
							textColor={styleVar.colors.black}
							labelColor={styleVar.colors.primary}
							dense={true}
							value={this.state.siteInputAmenityType}
							onFocus={() => this.openAmenityTypeSelect()}
							blurOnSubmit={true}
							autoGrow={true}
							labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
							inputStyle={{fontFamily : 'gothic'}}/>

				        <Icon name="arrow-drop-down" size={30} color={styleVar.colors.primary} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
		      		</ScrollView>

		      		<ScrollView style={[styles.inputGroupMiddle, {marginLeft : 10}]}
		      		showsVerticalScrollIndicator={false}
		      		scrollEnabled={false}>
				        <TextField
				            label={'Rate / Day'}
							highlightColor={styleVar.colors.secondary}
							editable={true}
							textColor={styleVar.colors.black}
							labelColor={styleVar.colors.primary}
							dense={true}
							keyboardType={'numeric'}
							value={this.state.siteInputAmenityRate}
							onChangeText={(value) => this.state.siteInputAmenityRate = value}
							blurOnSubmit={true}
							autoGrow={true}
							labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
							inputStyle={{fontFamily : 'gothic'}}/>
		      		</ScrollView>

		      		<View style={[styles.inputGroupMiddle, styles.inputGroupHorizontal, {justifyContent : 'flex-end', alignItems : 'center'}]}>
		      			<TouchableWithoutFeedback onPress={() => {this._addNewAmenities()}}>
		      				<View style={styles.inputGroupButton}>
		      					<Icon name="archive" size={25} color={styleVar.colors.greyDark} style={{}}></Icon>
		      				</View>
		      			</TouchableWithoutFeedback>

		      			<TouchableWithoutFeedback onPress={() => this._cancelAddAmenities()}>
		      				<View style={[styles.inputGroupButton, {marginLeft : 5}]}>
		      					<Icon name="close" size={25} color={styleVar.colors.greyDark} style={{}}></Icon>
		      				</View>
		      			</TouchableWithoutFeedback>
		      		</View>
				</View>
			)
		}else{
			return(
				<TouchableWithoutFeedback onPress={() => this.addAmenityButton()}>
			    	<View style={styles.buttonSave}>
			    		<Text style={{fontFamily : 'gothic', color : '#FFF', fontSize : 14}}>Add Amenity</Text>
			    	</View>
			    </TouchableWithoutFeedback>
			)
			
		}
	}

	addAmenityButton(){
		if(this.state.siteID){
			this.setState({
				showAmenityForm : true
			})		
		}else{
			alert('You must add site info first')
		}
	
	}

	_addNewAmenities(){
		var data_baru = {
			'Rate' : this.state.siteInputAmenityRate,
			'Memo' : this.state.siteInputAmenityType,
			'AmenityTypeID' : this.state.siteInputAmenityTypeID,
			'PropertyID' : this.state.siteID
		}
		// console.log(amenityFormArr)
		// console.log('baru', data_baru)
		this.setState({
			preloadSaveAmenities : true
		})

		var request = new Request(CONSTANT.API_URL+'propertyamenity/save', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify({
				Rate : parseInt(this.state.siteInputAmenityRate),
				Memo : this.state.siteInputAmenityType,
				AmenityTypeID : this.state.siteInputAmenityTypeID,
				PropertyID : this.state.siteID
			})
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				var data = {
					'Rate' : this.state.siteInputAmenityRate,
					'Memo' : this.state.siteInputAmenityType,
					'AmenityTypeID' : this.state.siteInputAmenityTypeID,
					'PropertyID' : this.state.siteID,
					'ID' : response.Data
				}

				amenityFormArr.push(data);

				this.setState({
					preloadSaveAmenities : false,
					amenityFormArr : amenityFormArr,
					showAmenityForm : false,
					siteInputAmenityRate : '',
					siteInputAmenityType : '',
					siteInputAmenityTypeID : '',
				})

				// console.log(response)
			})
			.catch((err) => {
				this.setState({
					preloadSaveAmenities : false
				})
				alert('Failed to saving amenity data')
			})
	}

	_cancelAddAmenities(){
		this.setState({
			showAmenityForm : false,
			siteInputAmenityType : '',
			siteInputAmenityTypeID : '',
			siteInputAmenityRate : ''
		})
	}

	openAmenityTypeSelect(index){
		// console.log('get focus')
		this.setState({
			showPickerAmenityType : true
		})

		if(index!=null){
			this.setState({
				indexEditAmenity : index
			})
		}
	}

	chooseAmenityType(data){
		if(this.state.indexEditAmenity){
			amenityFormArr[this.state.indexEditAmenity].Memo = data.Description;
			amenityFormArr[this.state.indexEditAmenity].AmenityTypeID = data.ID;	

			// console.log('data', data)
			// console.log(amenityFormArr[this.state.indexEditAmenity])

			this.setState({
				showPickerAmenityType : false,
				amenityFormArr : amenityFormArr,
			})
		}else{
			this.setState({
				showPickerAmenityType : false,
				siteInputAmenityType : data.Description,
				siteInputAmenityTypeID : data.ID
			})
		}		
	}

	renderClosure(closureFormArr){
		// console.log('closure',closureFormArr)
		return(
			closureFormArr.map((data, index) => {
				return(
					<View key={index} style={styles.closureEditForm}>
						<View style={styles.inputGroupHorizontal} >
							<ScrollView style={[styles.inputGroupMiddle]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'Effective From'}
									highlightColor={styleVar.colors.secondary}
									editable={false}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									ref="EffectiveFromUpdate"
									keyboardType={'numeric'}
									value={moment(this.state.closureFormArr[index].FromDate).format('YYYY-MM-DD')}
									onFocus={this.showDatePickerClosure.bind(this, 'siteInputClosureFromUpdate', {
										date : new Date(moment(this.state.closureFormArr[index].FromDate).format('YYYY-MM-DD')),
							          	minDate : new Date(),
							          	maxDate : new Date(moment(this.state.closureFormArr[index].ToDate).format('YYYY-MM-DD')),
							          	type : 'update',
							          	index : index
							        })}
									blurOnSubmit={true}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>

									<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
				      		</ScrollView>

				      		<ScrollView style={[styles.inputGroupMiddle, {marginLeft : 10}]}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
						        <TextField
						            label={'Effective To'}
									highlightColor={styleVar.colors.secondary}
									editable={false}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									ref="EffectiveToUpdate"
									keyboardType={'numeric'}
									value={moment(this.state.closureFormArr[index].ToDate).format('YYYY-MM-DD')}
									onFocus={this.showDatePickerClosure.bind(this, 'siteInputClosureToUpdate', {
										date: new Date(moment(this.state.closureFormArr[index].ToDate).format('YYYY-MM-DD')),
							          	minDate : new Date(moment(this.state.closureFormArr[index].FromDate).format('YYYY-MM-DD')),
							          	type : 'update',
							          	index : index
							        })}
									blurOnSubmit={true}
									autoGrow={true}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
									<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
				      		</ScrollView>

						</View>
						<View style={styles.inputGroupHorizontal} >
							<ScrollView style={[styles.inputGroupMiddle]}
				      		showsVerticalScrollIndicator={true}
				      		scrollEnabled={true}>
						        <TextField
						            label={'Description'}
									highlightColor={styleVar.colors.secondary}
									editable={true}
									textColor={styleVar.colors.black}
									labelColor={styleVar.colors.primary}
									dense={true}
									keyboardType={'default'}
									multiline={false}
									value={data.Description}
									onChangeText={(value) => this.state.closureFormArr[index].Description = value }
									blurOnSubmit={true}
									autoGrow={true}
									labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
									inputStyle={{fontFamily : 'gothic'}}/>
				      		</ScrollView>
				      	</View>

				      	<View style={styles.inputGroupHorizontal} >
				      		<TouchableWithoutFeedback onPress={() => {this._updateClosure(index)}}>
				      			<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.secondary}]}>
				      				<View>
				      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Edit</Text>
				      				</View>
				      			</View>
				      		</TouchableWithoutFeedback>
					      	
				      		<TouchableWithoutFeedback onPress={() => {this._deleteClosure(index)}}>

					      		<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.greyPrimary}]}>
				      				<View>
				      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Delete</Text>
				      				</View>
					      		</View>
				      		</TouchableWithoutFeedback>
					    </View>	
				    </View>
				)
			})
			
		)
	}

	_updateClosure(index){
		var data = this.state.closureFormArr[index];

		this.setState({
			preloadSaveClosure : true
		});

		var request = new Request(CONSTANT.API_URL+'propertyclosure/update', {
			method : 'POST',
			headers : {
    			'Accept': 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify({
				ID : data.ID,
				FromDate : moment(data.FromDate).format('YYYY-MM-DD'),
				ToDate : moment(data.ToDate).format('YYYY-MM-DD'),
				Description : data.Description,
				Memo : '',
				Booking : 0,
				PropertyID : this.state.siteID
			})
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response);
				this.setState({
					preloadSaveClosure : false
				})
			})
			.catch((err) => {
				console.log('error', err);
				this.setState({
					preloadSaveClosure : false
				})
				alert('Failed to updating property closure data');
			})
	}

	_deleteClosure(index){
		Alert.alert(
			'Warning',
			'Are you sure want to delete this data?',
			[
				{ text : 'Sure', onPress : () => this._doDeleteClosure(index)},
				{ text : 'No', onPress : () => console.log('cancel delete') }
			]
		);
	}

	_doDeleteClosure(index){

		this.setState({
			preloadSaveClosure : true
		});

		var request = new Request(CONSTANT.API_URL+'propertyclosure/delete/'+this.state.closureFormArr[index].ID, {
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			}
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response);

				this.state.closureFormArr.splice(index, 1);

				this.setState({
					closureFormArr : this.state.closureFormArr,
					preloadSaveClosure : false
				});
			})
			.catch((err) => {
				console.log('error', err);
				this.setState({
					preloadSaveClosure : false
				});
				alert('Failed to delete property closure data')
			})
	}

	setDescriptionValue(index, value){
		closureFormArr[index].Description = value;

		this.setState({
			closureFormArr : closureFormArr
		})
	}

	renderClosureButton(){
		if(this.state.showClosureForm){
			return(
				<View style={styles.closureAddForm}>
					<View style={styles.inputGroupHorizontal} >
						<ScrollView style={[styles.inputGroupMiddle]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Effective From'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								ref="EffectiveFrom"
								keyboardType={'numeric'}
								value={this.state.siteInputClosureFrom}
								onFocus={this.showDatePickerClosure.bind(this, 'siteInputClosureFrom', {
									date : new Date(this.state.siteInputClosureFrom),
						          	minDate : new Date(),
						          	maxDate : new Date(this.state.maxDate),
						          	mode : 'spinner'
						        })}
								blurOnSubmit={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>

								<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>

			      		<ScrollView style={[styles.inputGroupMiddle, {marginLeft : 10}]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Effective To'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								ref="EffectiveTo"
								keyboardType={'numeric'}
								value={this.state.siteInputClosureTo}
								onChangeText={(value) => this.state.siteInputClosureTo = value}
								onFocus={this.showDatePickerClosure.bind(this, 'siteInputClosureTo', {
									date: new Date(this.state.siteInputClosureTo),
						          	minDate : new Date(this.state.minDate)
						        })}
								blurOnSubmit={true}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
								<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>

					</View>
					<View style={styles.inputGroupHorizontal} >
						<ScrollView style={[styles.inputGroupMiddle]}
			      		showsVerticalScrollIndicator={true}
			      		scrollEnabled={true}>
					        <TextField
					            label={'Description'}
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'default'}
								multiline={false}
								value={this.state.siteInputClosureDesc}
								onChangeText={(value) => this.setState({siteInputClosureDesc : value}) }
								blurOnSubmit={true}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>
			      	</View>

			      	<View style={styles.inputGroupHorizontal} >
			      		<TouchableWithoutFeedback onPress={() => {this._addNewClosure()}}>
			      			<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.secondary}]}>
			      				<View>
			      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Save</Text>
			      				</View>
			      			</View>
			      		</TouchableWithoutFeedback>
				      	
			      		<TouchableWithoutFeedback onPress={() => {this._cancelAddClosure()}}>

				      		<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.greyPrimary}]}>
			      				<View>
			      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Cancel</Text>
			      				</View>
				      		</View>
			      		</TouchableWithoutFeedback>
				    </View>	
			    </View>
			)
		}else{
			return(
				<TouchableWithoutFeedback onPress={() => this.addClosureButton()}>
			    	<View style={styles.buttonSave} ref="buttonNew">
			    		<Text style={{fontFamily : 'gothic', color : '#FFF', fontSize : 14}}>Add Closure</Text>
			    	</View>
			    </TouchableWithoutFeedback>
			)
		}
	}

	addClosureButton(){
		if(this.state.siteID){
			this.setState({
				showClosureForm : true
			});
		}else{
			alert('You must add site info first');
		}
	}

	_addNewClosure(){

		this.setState({
			preloadSaveClosure : true
		});

		var request = new Request(CONSTANT.API_URL+'propertyclosure/save', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify({
				FromDate : moment(this.state.siteInputClosureFrom).format(),
				ToDate : moment(this.state.siteInputClosureTo).format(),
				Description : this.state.siteInputClosureDesc,
				Memo : null,
				Booking : 0 ,
				PropertyID : this.state.siteID
			})
		})

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response);
				var data = {
					'ID' : response.Data,
					'FromDate' : moment(this.state.siteInputClosureFrom).format(),
					'ToDate' : moment(this.state.siteInputClosureTo).format(),
					'Description' : this.state.siteInputClosureDesc,
					'Memo' : null,
					'Booking' : false ,
					'PropertyID' : this.state.siteID,
				}

				closureFormArr = this.state.closureFormArr;
				closureFormArr.push(data);

				this.setState({
					closureFormArr : closureFormArr,
					preloadSaveClosure : false
				})
			})
			.catch((err) => {
				console.log('error', err);
				this.setState({
					preloadSaveClosure : false
				})
				alert('Failed to create property closure data')
			})

	}

	_cancelAddClosure(){
		this.setState({
			siteInputClosureFrom : '',
			siteInputClosureTo : '',
			showClosureForm : false
		})
	}

	_getRateType(){
		var request = new Request(CONSTANT.API_URL+'rateTypes/get', {
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			}
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response)
				this.setState({
					rateTypeData : response.Data
				});
			})
			.catch((err) => {
				console.log('error', err);
				alert('Failed to retrieve rate type data');
			})
	}

	renderRate(rateFormArr, rateTypeData){
		if(rateTypeData.length >= 1){
			return(
				rateFormArr.map((key, index) => {
					
					return(
						<View key={index} style={styles.closureEditForm}>
							<View style={styles.inputGroupHorizontal} >
								<ScrollView style={styles.inputGroupLong}
						      		showsVerticalScrollIndicator={false}
						      		scrollEnabled={false}>
							        <TextField
							            label={'Rate Type'}
										highlightColor={styleVar.colors.secondary}
										editable={false}
										textColor={styleVar.colors.black}
										labelColor={styleVar.colors.primary}
										dense={true}
										value={_.findWhere(rateTypeData, {ID : key.RateTypeID}).Description}
										onFocus={() => this.openRateTypeSelect(index)}
										blurOnSubmit={true}
										onChangeText={() => this.refs.EffectiveFromRateUpdate.focus()}
										autoGrow={true}
										labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
										inputStyle={{fontFamily : 'gothic'}}/>

							        <Icon name="arrow-drop-down" size={30} color={styleVar.colors.primary} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
					      		</ScrollView>
				      		</View>

				      		<View style={styles.inputGroupHorizontal} >
								<ScrollView style={[styles.inputGroupMiddle]}
					      		showsVerticalScrollIndicator={false}
					      		scrollEnabled={false}>
							        <TextField
							            label={'Effective From'}
										highlightColor={styleVar.colors.secondary}
										editable={false}
										textColor={styleVar.colors.black}
										labelColor={styleVar.colors.primary}
										dense={true}
										ref="EffectiveFromRateUpdate"
										keyboardType={'numeric'}
										value={moment(this.state.rateFormArr[index].FromDate).format('YYYY-MM-DD')}
										onFocus={this.showDatePickerRate.bind(this, 'siteInputRateFromUpdate', {
											date : new Date(moment(this.state.rateFormArr[index].FromDate).format('YYYY-MM-DD')),
								          	minDate : new Date(),
								          	maxDate : new Date(moment(this.state.rateFormArr[index].ToDate).format('YYYY-MM-DD')),
								          	mode : 'spinner',
								          	type : 'update',
								          	index : index
								        })}
										blurOnSubmit={true}
										labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
										inputStyle={{fontFamily : 'gothic'}}/>

										<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
					      		</ScrollView>

					      		<ScrollView style={[styles.inputGroupMiddle, {marginLeft : 10}]}
					      		showsVerticalScrollIndicator={false}
					      		scrollEnabled={false}>
							        <TextField
							            label={'Effective To'}
										highlightColor={styleVar.colors.secondary}
										editable={false}
										textColor={styleVar.colors.black}
										labelColor={styleVar.colors.primary}
										dense={true}
										ref="EffectiveToRateUpdate"
										keyboardType={'numeric'}
										value={moment(this.state.rateFormArr[index].ToDate).format('YYYY-MM-DD')}
										onFocus={this.showDatePickerRate.bind(this, 'siteInputRateToUpdate', {
											date: new Date(moment(this.state.rateFormArr[index].ToDate).format('YYYY-MM-DD')),
								          	minDate : new Date(moment(this.state.rateFormArr[index].FromDate).format('YYYY-MM-DD')),
								          	type : 'update',
								          	index : index
								        })}
										blurOnSubmit={true}
										autoGrow={true}
										labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
										inputStyle={{fontFamily : 'gothic'}}/>
										<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
					      		</ScrollView>
							</View>

							<View style={styles.inputGroupHorizontal} >
								<ScrollView style={[styles.inputGroupMiddle]}
					      		showsVerticalScrollIndicator={true}
					      		scrollEnabled={true}>
							        <TextField
							            label={'Rate ($)'}
										highlightColor={styleVar.colors.secondary}
										editable={true}
										textColor={styleVar.colors.black}
										labelColor={styleVar.colors.primary}
										dense={true}
										keyboardType={'numeric'}
										multiline={false}
										value={this.state.rateFormArr[index].Rate.toString()}
										onChangeText={(value) => this.state.rateFormArr[index].Rate = parseInt(value) }
										blurOnSubmit={true}
										autoGrow={true}
										labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
										inputStyle={{fontFamily : 'gothic'}}/>
					      		</ScrollView>

					      		<ScrollView style={[styles.inputGroupMiddle]}
					      		showsVerticalScrollIndicator={true}
					      		scrollEnabled={true}>
							        <TextField
							            label={'Weekend Surcharge'}
										highlightColor={styleVar.colors.secondary}
										editable={true}
										textColor={styleVar.colors.black}
										labelColor={styleVar.colors.primary}
										dense={true}
										keyboardType={'numeric'}
										multiline={false}
										value=''
										onChangeText={(value) => console.log(value) }
										blurOnSubmit={true}
										autoGrow={true}
										labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
										inputStyle={{fontFamily : 'gothic'}}/>
					      		</ScrollView>
				      		</View>

				      		<View style={styles.inputGroupHorizontal} >
					      		<TouchableWithoutFeedback onPress={() => {this._updateRate(index)}}>
					      			<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.secondary}]}>
					      				<View>
					      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Edit</Text>
					      				</View>
					      			</View>
					      		</TouchableWithoutFeedback>
						      	
					      		<TouchableWithoutFeedback onPress={() => {this._deleteRate(index)}}>

						      		<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.greyPrimary}]}>
					      				<View>
					      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Delete</Text>
					      				</View>
						      		</View>
					      		</TouchableWithoutFeedback>
						    </View>		

						</View>
					)
				})
			)
		}
	}

	_updateRate(index){
		var data = this.state.rateFormArr[index];

		this.setState({
			preloadSaveRate : true
		});

		var request = new Request(CONSTANT.API_URL+'propertyRate/update', {
			method : 'POST',
			headers : {
    			'Accept': 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify({
				ID : data.ID,
				FromDate : moment(data.FromDate).format('YYYY-MM-DD'),
				ToDate : moment(data.ToDate).format('YYYY-MM-DD'),
				Rate : data.Rate,
				Memo : '',
				RateTypeID : data.RateTypeID,
				PropertyID : this.state.siteID
			})
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response);
				this.setState({
					preloadSaveRate : false,
					indexEditRate : null
				})
			})
			.catch((err) => {
				console.log('error', err);
				this.setState({
					preloadSaveRate : false
				})
				alert('Failed to updating property rate data');
			})
	}

	_deleteRate(index){
		Alert.alert(
			'Warning',
			'Are you sure want to delete this data?',
			[
				{ text : 'Sure', onPress : () => this._doDeleteRate(index)},
				{ text : 'No', onPress : () => console.log('cancel delete') }
			]
		);
	}

	_doDeleteRate(index){

		this.setState({
			preloadSaveRate : true
		});

		var request = new Request(CONSTANT.API_URL+'propertyRate/delete/'+this.state.rateFormArr[index].ID, {
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			}
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response);

				this.state.rateFormArr.splice(index, 1);

				this.setState({
					rateFormArr : this.state.rateFormArr,
					preloadSaveRate : false
				});
			})
			.catch((err) => {
				console.log('error', err);
				this.setState({
					preloadSaveRate : false
				});
				alert('Failed to delete property rate data')
			})
	}

	openRateTypeSelect(index){
		this.setState({
			showPickerRateType : true
		})

		if(index!=null){
			this.setState({
				indexEditRate : index
			})
		}
	}

	chooseRateType(data){
		if(this.state.indexEditRate!=null){
			rateFormArr[this.state.indexEditRate].RateTypeID = data.ID;	

			this.setState({
				showPickerRateType : false,
				rateFormArr : rateFormArr,
			})
		}else{
			this.setState({
				showPickerRateType : false,
				siteInputRateType : data.Description,
				siteInputRateTypeID : data.ID
			})
		}
	}

	renderRateButton(){
		if(this.state.showRateForm){
			return(
				<View style={styles.closureAddForm}>
					<View style={styles.inputGroupHorizontal} >
						<ScrollView style={styles.inputGroupLong}
				      		showsVerticalScrollIndicator={false}
				      		scrollEnabled={false}>
					        <TextField
					            label={'Rate Type'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								value={this.state.siteInputRateType}
								onFocus={() => this.openRateTypeSelect()}
								blurOnSubmit={true}
								onChangeText={() => this.refs.EffectiveFromRate.focus()}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>

					        <Icon name="arrow-drop-down" size={30} color={styleVar.colors.primary} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>
			      	</View>

			      	<View style={styles.inputGroupHorizontal} >
						<ScrollView style={[styles.inputGroupMiddle]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Effective From'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								ref="EffectiveFromRate"
								keyboardType={'numeric'}
								value={this.state.siteInputRateFrom}
								onFocus={this.showDatePickerRate.bind(this, 'siteInputRateFrom', {
									date : new Date(this.state.siteInputRateFrom),
						          	minDate : new Date(),
						          	maxDate : new Date(this.state.maxDateRate),
						          	mode : 'spinner'
						        })}
								blurOnSubmit={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>

								<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>

			      		<ScrollView style={[styles.inputGroupMiddle, {marginLeft : 10}]}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Effective To'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								ref="EffectiveToRate"
								keyboardType={'numeric'}
								value={this.state.siteInputRateTo}
								onChangeText={(value) => this.state.siteInputRateTo = value}
								onFocus={this.showDatePickerRate.bind(this, 'siteInputRateTo', {
									date: new Date(this.state.siteInputRateTo),
						          	minDate : new Date(this.state.minDateRate)
						        })}
								blurOnSubmit={true}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
								<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>
					</View>

					<View style={styles.inputGroupHorizontal} >
						<ScrollView style={[styles.inputGroupMiddle]}
			      		showsVerticalScrollIndicator={true}
			      		scrollEnabled={true}>
					        <TextField
					            label={'Rate ($)'}
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'numeric'}
								multiline={false}
								value={this.state.siteInputRateValue}
								onChangeText={(value) => this.setState({siteInputRateValue : value}) }
								blurOnSubmit={true}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>

			      		<ScrollView style={[styles.inputGroupMiddle]}
			      		showsVerticalScrollIndicator={true}
			      		scrollEnabled={true}>
					        <TextField
					            label={'Weekend Surcharge'}
								highlightColor={styleVar.colors.secondary}
								editable={true}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={true}
								keyboardType={'numeric'}
								multiline={false}
								value={this.state.siteInputRateSurcharge}
								onChangeText={(value) => this.setState({siteInputRateSurcharge : value}) }
								blurOnSubmit={true}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic'}}/>
			      		</ScrollView>
			      	</View>					

			      	<View style={styles.inputGroupHorizontal} >
			      		<TouchableWithoutFeedback onPress={() => {this._addNewRate()}}>
			      			<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.secondary}]}>
			      				<View>
			      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Save</Text>
			      				</View>
			      			</View>
			      		</TouchableWithoutFeedback>
				      	
			      		<TouchableWithoutFeedback onPress={() => {this._cancelAddRate()}}>

				      		<View style={[styles.inputGroupShort, {justifyContent : 'center', alignItems : 'center', backgroundColor : styleVar.colors.greyPrimary}]}>
			      				<View>
			      					<Text style={{color : 'white', fontFamily : 'gothic'}}>Cancel</Text>
			      				</View>
				      		</View>
			      		</TouchableWithoutFeedback>
				    </View>	
			    </View>
			)
		}else{
			return(
				<TouchableWithoutFeedback onPress={() => this.addRateButton()}>
			    	<View style={styles.buttonSave} ref="buttonNew">
			    		<Text style={{fontFamily : 'gothic', color : '#FFF', fontSize : 14}}>Add Rate</Text>
			    	</View>
			    </TouchableWithoutFeedback>
			)
		}
	}

	_cancelAddRate(){
		this.setState({
			showRateForm : false
		})
	}

	_addNewRate(){
		this.setState({
			preloadSaveRate : true
		});

		var dataRate = {
			"FromDate" : this.state.siteInputRateFrom,
			"ToDate" : this.state.siteInputRateTo,
			"Rate" : this.state.siteInputRateValue,
			"Memo" : '',
			"RateTypeID" : this.state.siteInputRateTypeID,
			"PropertyID" : this.state.siteID
		};

		var request = new Request(CONSTANT.API_URL+'propertyRate/save', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify(dataRate)
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response);
				dataRate['ID'] = response.Data;

				this.state.rateFormArr.push(dataRate);
				this.setState({
					rateFormArr : rateFormArr,
					showRateForm : false,
					preloadSaveRate : false
				});

			})
			.catch((err) => {
				this.setState({
					preloadSaveRate : false
				});
				console.log('error',err);
				alert('Failed to save new Property Rate');
			})
	}

	addRateButton(){
		if(this.state.siteID){
			this.setState({
				showRateForm : true
			});
		}else{
			alert('You must add site info first');
		}
	}

	renderPicture(data){

	}

	renderPictureButton(){

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
    				// preloadSavePictures : true
    			})

    			console.log(photo)

    			// var newPhoto = {
    			// 	ID : 199,
    			// 	Path : 
    			// 	Memo
    			// 	Profile
    			// 	PropertyID
    			// };

    			// this._doUploadPicture(photo);
    		}
    	})
	}

	renderPropertyPictures(propertyPictures){
		return(
			propertyPictures.map((key, index) => {
				console.log(CONSTANT.WEB_URL+key.Path);
				return(
					<TouchableWithoutFeedback key={index}>
						<Image source={{uri : CONSTANT.WEB_URL+key.Path}} style={styles.imageFlex}/>
					</TouchableWithoutFeedback>
				)
			})
		)
	}

	handleChangeTab({i, ref, from}){
		switch(i){
			case 2 :
				closureFormArr = this.state.closureFormArr;
			break;
		}
	}

	render(){
		if (this.state.renderPlaceholderOnly) {
	    	return this.preload();
	    }

	    // let arr = this.renderAmenitiesForm();

		return(
			<View style={styles.containerHome}>
				<View style={[styles.headerModal]}>
					<Icon name='arrow-back' size={30} color="#FFF" onPress={ () => this.backSite() }></Icon>
					<Text style={styles.headerTitle}>Add Site</Text>
					<View style={{width : 30}}/>
					
				</View>

				<ModalSelect 
					viewModal={this.state.showPickerAmenityType}
					data={this.state.amenityTypeData}
					onDataChoose={(data) => this.chooseAmenityType(data)}/>

				<ModalSelect 
					viewModal={this.state.showPickerRateType}
					data={this.state.rateTypeData}
					onDataChoose={(data) => this.chooseRateType(data)}/>


				<ScrollTabView
					renderTabBar={() => <ScrollableTabBar style={styles.scrollbarWrapper}/>}
					locked={false}
					initialPage={0}
					tabBarPosition="top"
					tabBarActiveTextColor={styleVar.colors.primary}
					tabBarUnderlineColor={styleVar.colors.primary}
					tabBarInactiveTextColor={styleVar.colors.greyDark}
	      			tabBarTextStyle={{fontFamily: 'gothic', fontSize: 15}}
	      			onChangeTab={this.handleChangeTab.bind(this)}
				>
					<ScrollView
						tabLabel="SITE INFO"
						key={0}
						style={styles.scrollbarView}
						showsVerticalScrollIndicator={true}>
						
						{this.preloadSave(this.state.preloadSaveInfo)}
						{this.renderSiteInfo()}
					</ScrollView>

					<ScrollView
						tabLabel="AMENITIES"
						key={1}
						style={styles.scrollbarView}	
						showsVerticalScrollIndicator={true}>

						{this.preloadSave(this.state.preloadSaveAmenities)}
						<View style={styles.containerContent}>
							{
								this.renderAmenities()
							}

							{
								this.renderAmenityButton()
							}
							
						</View>
					</ScrollView>

					<ScrollView
						tabLabel="CLOSURE DATE"
						key={2}
						style={styles.scrollbarView}	
						showsVerticalScrollIndicator={true}>

						{this.preloadSave(this.state.preloadSaveClosure)}
						<View style={styles.containerContent}>
							{
								this.renderClosure(this.state.closureFormArr)
							}

							{
								this.renderClosureButton()
							}
							
						</View>
					</ScrollView>

					<ScrollView
						tabLabel="RATE"
						key={3}
						style={styles.scrollbarView}	
						showsVerticalScrollIndicator={true}>

						{this.preloadSave(this.state.preloadSaveRate)}
						<View style={styles.containerContent}>
							{
								this.renderRate(this.state.rateFormArr, this.state.rateTypeData)
							}

							{
								this.renderRateButton()
							}
							
						</View>
					</ScrollView>

					<ScrollView
						tabLabel="PICTURES"
						key={4}
						style={styles.scrollbarView}	
						showsVerticalScrollIndicator={true}>

						{this.preloadSave(this.state.preloadSavePictures)}
						<View style={styles.containerContent}>
							{
								//this.renderPicture(this.state.propertyPictures)
							}

							<View style={styles.imageContainer}>

								{this.renderPropertyPictures(this.state.propertyPictures)}
								
								<TouchableWithoutFeedback onPress={this.uploadPicture.bind(this)}>
									<View style={styles.imageFlexWrapper}>
										<Icon name='add-a-photo' size={50} color={styleVar.colors.greyDark}/>
									</View>
								</TouchableWithoutFeedback>
							</View>
							
							{
								this.renderPictureButton()
							}
							
						</View>
					</ScrollView>
				</ScrollTabView>
					
				<Modal
					animationType={"slide"}
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {alert("Modal has been closed.")}}
				>
					<ModalSearchAddress 
						onCloseModal={() => this.closeModal()}
						onPlaceChange={(state) => this.onPlaceChange(state)}/>
				</Modal>
			</View>
		)
	}
}

module.exports = SiteForm;