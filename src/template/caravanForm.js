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
import styles from '../style/caravanFormStyle';
import TextField from 'react-native-md-textinput';
import ModalSelect from '../plugin/ModalSelect';
import CONSTANT from '../constantVar';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import _ from 'underscore';
 
var vehicleTypeDataArr = [], 
	vehiclePictures = [],
	arrStatus = [];

let screenWidth = Dimensions.get('window').width;

class CaravanForm extends Component{
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
	  		avatarSource : '',
    		preloadUploadInfo : false,
    		vehiclePictures : [],
    		showUploadContainer : false
	  	};
	}

	validateForm(){
		var status;

		//firstname, phone1, addressline1, City
		if(!this.state.vehicleTypeID){
			arrStatus.push('Vehicle Type');
			status = false;
			// return false;
		}else{
			status = true;
		}

		if(!this.state.vehicleInputBrand){
			arrStatus.push('Brand');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.vehicleInputYear){
			arrStatus.push('Year');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.vehicleInputWidth){
			arrStatus.push('Width');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.vehicleInputHeight){
			arrStatus.push('Height');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.vehicleInputLength){
			arrStatus.push('Length');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.vehicleInputLicense){
			arrStatus.push('License Plate');
			status = false;
			// return false
		}else{
			status = true;
		}

		if(!this.state.vehicleInputLicenseExp){
			arrStatus.push('License Expiry');
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

	backCaravan(){
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

	saveDataVehicle(){
		this.setState({
			showPickerVehicle : true
		})
	}

	openVehicleSelect(){
		this.setState({
			showPickerVehicle : true
		})
	}

	chooseVehicle(data){
		// console.log(data)
		this.setState({
			vehicleTypeText : data.Description,
			vehicleTypeID : data.ID,
			showPickerVehicle : false
		})
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

	_renderVehiclePictures(vehiclePictures){
		return(				
			vehiclePictures.map((key, index) => {
				return (
					<View key={index} style={styles.uploadedImageWrapper}>
						<Image source={{uri : CONSTANT.WEB_URL+key.Path}} style={styles.uploadedImage} />
						<View style={styles.imageButtonWrapper}>
							<Icon name="star" size={25} color={(key.Profile == true) ? styleVar.colors.secondary : '#FFF'} onPress={ ()=> this.setDefaultPicture(key.ID, index)} style={styles.imageButton}/>
							<Icon name="delete" size={25} color="#FFF" onPress={ ()=> this.deleteVehiclePicture(key.ID, index)} style={styles.imageButton}/>
						</View>
					</View>
				)
			})
		)
	}

	setDefaultPicture(id, index){
		this.setState({
			preloadSaveInfo : true
		});
		var request = new Request(CONSTANT.API_URL+'VehiclePicture/makeprofile/'+id, {
			method : 'POST',
			headers : {
				'Authorization' : this.state.access_token
			}
		});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				console.log(response);
				this.state.vehiclePictures.forEach(function(obj){
					if(obj.ID != id){
						obj.Profile = false;
					}else{
						obj.Profile = true;
					}
				})
				this.setState({
					preloadSaveInfo : false
				});
			})
			.catch((err) => {
				console.log('error',err);
				this.setState({
					preloadSaveInfo : false
				});
			})

	}

	deleteVehiclePicture(id, index){
		Alert.alert(
			'Warning',
			'Are you sure want to delete this picture?',
			[
				{ text : 'Sure', onPress : () => this._doDeleteVehiclePicture(id, index)},
				{ text : 'No', onPress : () => console.log('cancel delete') }
			]
		);
		// var index = _.findLastIndex(vehiclePictures, {ID : id})

		// vehiclePictures.splice(index, 1);

		// this.setState({
		// 	vehiclePictures : vehiclePictures
		// })
	}

	_doDeleteVehiclePicture(id, index){
		this.setState({
			preloadSaveInfo : true
		});

		var request = new Request(CONSTANT.API_URL+'VehiclePicture/delete/'+id, {
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
				console.log(response);
				this.state.vehiclePictures.splice(index, 1);

				this.setState({
					preloadSaveInfo : false,
					vehiclePictures : this.state.vehiclePictures
				});
			})
			.catch((err) => {
				console.log('error',err);
				this.setState({
					preloadSaveInfo : false
				});
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
			    			this._renderVehiclePictures(this.state.vehiclePictures)
			    		}
			    		
			    		{
			    			(this.state.vehiclePictures.length < 5) ?

			    			<TouchableWithoutFeedback onPress={this.uploadPicture.bind(this)}>
				    			<View style={styles.uploadTrigger}>
				    				<Icon name='add-a-photo' size={50} color={styleVar.colors.greyDark}/>
				    			</View>
				    		</TouchableWithoutFeedback>

				    		:

				    		false
			    		}
			    		
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
				alert('Update Data vehicle Error, check your input data or internet connection');
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

	render(){
		if (this.state.renderPlaceholderOnly) {
	    	return this.preload();
	    }
		return(
			<View style={styles.containerHome}>
				<View style={[styles.headerModal]}>
					<Icon name='close' size={30} color="#FFF" onPress={ () => this.backCaravan() }></Icon>
					<Text style={styles.headerTitle}>{(this.state.vehicleID) ? "Edit Vehicle" : "Add Vehicle"}</Text>
					<Icon name='done' size={30} color="#FFF" onPress={() => this.saveDataVehicle()}/>
				</View>

				<ModalSelect 
					viewModal={this.state.showPickerVehicle}
					data={this.state.vehicleTypeData}
					onDataChoose={(data) => this.chooseVehicle(data)}/>
				<ScrollView>
					{this.preloadSave(this.state.preloadSaveInfo)}

					<View style={styles.containerContent}>
						<ScrollView style={{flex : 1,paddingLeft : 0,paddingBottom: 10}}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
					            label={'Vehicle Type'}
								highlightColor={styleVar.colors.secondary}
								editable={false}
								textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								dense={false}
								value={this.state.vehicleTypeText}
								onFocus={() => this.openVehicleSelect()}
								blurOnSubmit={true}
								autoGrow={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}/>

					        <Icon name="arrow-drop-down" size={30} color={styleVar.colors.primary} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      		</ScrollView>

					    <ScrollView style={styles.inputText}
			      		showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Brand'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'default'}
								dense={false}
								ref="brand"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.vehicleInputBrand = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.vehicleInputBrand}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Year'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="year"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.vehicleInputYear = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.vehicleInputYear}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'Width'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'numeric'}
								dense={false}
								ref="width"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.vehicleInputWidth = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.vehicleInputWidth}/>
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
								onChangeText={(text) => this.state.vehicleInputHeight = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.vehicleInputHeight}/>
					    </ScrollView>

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
								onChangeText={(text) => this.state.vehicleInputLength = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.vehicleInputLength}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'License Plate'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'default'}
								dense={false}
								ref="license"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={true}
								blurOnSubmit={true}
								onChangeText={(text) => this.state.vehicleInputLicense = text}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								value={this.state.vehicleInputLicense}/>
					    </ScrollView>

					    <ScrollView style={styles.inputText}
					    showsVerticalScrollIndicator={false}
			      		scrollEnabled={false}>
					        <TextField
								label={'License Expiry'}
								highlightColor={styleVar.colors.secondary}
								keyboardType={'default'}
								dense={false}
								ref="expiry"
					          	textColor={styleVar.colors.black}
								labelColor={styleVar.colors.primary}
								editable={false}
								blurOnSubmit={true}
								labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
								inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 16}}
								onFocus={this.showPicker.bind(this, 'vehicleInputLicenseExp', {
							          	date: this.state.dateNow
							          })}
								value={this.state.vehicleInputLicenseExp}/>

								<Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
					    </ScrollView>

					    <View style={styles.inputSwitchWrapper}>
					    	<View style={styles.inputSwitch}>
						    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary, fontSize : 16}}>Kitchen</Text>
							    <Switch
									onValueChange={(value) => {this.setState({vehicleInputKitchen: value})}}
									style={{marginVertical: 10}}
									value={this.state.vehicleInputKitchen} />
								<Text style={{fontFamily : 'gothic', color : styleVar.colors.secondary}}>{(this.state.vehicleInputKitchen) ? 'Yes' : 'No'}</Text>
						    </View>

						    <View style={styles.inputSwitch}>
						    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary, fontSize : 16}}>Shower</Text>
							    <Switch
								onValueChange={(value) => {this.setState({vehicleInputShower: value})}}
								style={{marginVertical: 10}}
								value={this.state.vehicleInputShower} />
								<Text style={{fontFamily : 'gothic', color : styleVar.colors.secondary}}>{(this.state.vehicleInputShower) ? 'Yes' : 'No'}</Text>
						    </View>

						    <View style={styles.inputSwitch}>
						    	<Text style={{fontFamily : 'gothic', color : styleVar.colors.primary, fontSize : 16}}>Toilet</Text>
							    <Switch
								onValueChange={(value) => {this.setState({vehicleInputToilet: value})}}
								style={{marginVertical: 10}}
								value={this.state.vehicleInputToilet} />
								<Text style={{fontFamily : 'gothic', color : styleVar.colors.secondary}}>{(this.state.vehicleInputToilet) ? 'Yes' : 'No'}</Text>
						    </View>
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

module.exports = CaravanForm;