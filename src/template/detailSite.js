import React, {Component, PropTypes} from 'react';
import {
	AppRegistry,
	View,
	Text,
	StyleSheet,
	Navigator,
	Dimensions,
	ScrollView,
	DatePickerAndroid,
	Animated,
	ViewPagerAndroid,
	TouchableWithoutFeedback,
	ActivityIndicator,
	Image,
	AsyncStorage,
	Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/EvilIcons';
import ScrollTabView,  {DefaultTabBar} from 'react-native-scrollable-tab-view';
import styleVar from '../styleVar';
import CONSTANT from '../constantVar';
import PropertyAction from '../actions/propertyAction';
import PropertyStore from '../stores/propertyStore';
import Helpers from '../helpers';
import MapView from 'react-native-maps';
import TextField from 'react-native-md-textinput';
import Carousel from 'react-native-carousel';
import _ from 'underscore';
import moment from 'moment';
import styles from '../style/detailSite';
import AccessToken from '../accessToken';
import Routes from '../routes';
import ModalLoading from '../plugin/ModalLoading';

const propTypes = {
  toRoute: PropTypes.func.isRequired,
  toBack : PropTypes.func.isRequired
}

let screenWidth = Dimensions.get('window').width;
// var diffDays;

class DetailSite extends Component{
	constructor(props) {
	  	super(props);
		
		this.state = {
		  	siteId : this.props.data.siteId,
		  	fromDate : this.props.data.FromDate,
		  	toDate : this.props.data.ToDate,
		  	// siteId : 347,
		  	// fromDate : '2017-01-27',
		  	// toDate : '2017-02-04',
		  	propertyData : {
		  		customer : {
		  			CustomerPictures : []
		  		},
		  		PropertyPictures : []
		  	},
		  	PropertyAmenities : [],
		  	imageSite : [],
		  	fadeAnim: new Animated.Value(1),
		  	fadeImage : 1,
		  	headerBg : 'rgba(0,0,0,0.5)',
		  	headerColor : '#FFF',
		  	mapRegion : {
		  		longitude : 0,
				latitude : 0,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421
	  		},
	  		minDate : '',
	  		maxDate : '',
	  		billingItems : [],
	  		billingTotalPrice : 0,
	  		preloadBookInfo : false,
	  		diffDays : 0,
	  		access_token : '',
	  		loading : false
	  	};

	}

	backHome(){
		this.props.toBack();
	}

	componentWillMount(){
		// console.log(this.state.siteId, this.state.fromDate, this.state.toDate);
		PropertyAction.getProperty(this.state.siteId, this.state.fromDate, this.state.toDate);
		PropertyAction.loadProperty.listen(this._onGetProperty.bind(this));
	}

	componentDidMount(){
		Helpers.countRates();

		AsyncStorage.getItem("ACCESS_TOKEN").then((value) => {
        	this.setState({"access_token": value});
    	}).done();
		// console.log(PropertyStore.getCurrentProperty())
	}

	_onGetProperty(data){
		this.setState({
			propertyData : data,
			PropertyAmenities : data.PropertyAmenities,
			mapRegion : {
				longitude : data.Longitude ? data.Longitude : null,
				latitude : data.Latitude ? data.Latitude: null,
				latitudeDelta: 0.02,
				longitudeDelta: 0.02
			},
			arrivalText : this.state.fromDate,
			departureText : this.state.toDate,
			minDate : this.state.fromDate,
			maxDate: this.state.toDate
		})

		this._countBilling(data);
	}

	_countBilling(data){
		// console.log(data.PropertyRates)
		var billingTotalPrice = 0;
		var groupingRate = _.chain(data.PropertyRates)
							.groupBy('Rate')
							.map( (value, key) => {
								return{
									rate : parseInt(key),
									date : _.pluck(value, 'FromDate')
								}
							}).reverse()._wrapped;
		var items = [];
		groupingRate.map( (key) => {
			var memo = moment(key.date[0]).format('YYYY-MM-DD') + ' to ' + moment(key.date[key.date.length - 1]).format('YYYY-MM-DD') + ' - '+key.date.length +' days(s) x $ '+key.rate+'.00'+'';

			var dailyBilling = {
	            'ID': '',
	            'Memo': memo,
	            'DailyRate' : key.rate,
	            'Rate' : key.rate * key.date.length,
	            'Type' : 'daily'
	        };

	        items.push(dailyBilling);
	        billingTotalPrice += key.rate * key.date.length;
	        // console.log(billingTotalPrice)
		})
		
		var timeDiff = Math.abs(new Date(this.state.toDate).getTime() - new Date(this.state.fromDate).getTime())

		this.setState({
        	billingItems : items,
        	billingTotalPrice : billingTotalPrice,
        	diffDays : Math.ceil(timeDiff / (1000 * 3600 * 24))
        });

       


    	// diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    	// console.log(diffDays)
	}

	carouselImage(){

		if(this.state.propertyData.PropertyPictures.length > 0){
		return(
			
				<Carousel width={screenWidth}
					animate={false}
					indicatorColor="#FFFFFF"
					indicatorSize={40}
					indicatorSpace={14}
					inactiveIndicatorColor="#999999"
					indicatorOffset={0}
					>

					{this.state.propertyData.PropertyPictures.map((key, index) => {
						return(
							<View style={{width: screenWidth, flex: 1,justifyContent: 'center',backgroundColor: 'transparent'}} key={index} >
								<Image 
									source={{uri : 'http://travellers.azurewebsites.net/'+key.Path}}
									style={[styles.propertyImage]}>
								</Image>
					        </View>
						)
					})}
      			</Carousel>
		)
		}else{
			return(
				<Image 
					source={{uri : 'https://maps.googleapis.com/maps/api/streetview?size='+screenWidth+'x200&location='+this.state.propertyData.Latitude+','+this.state.propertyData.Longitude+'&key=AIzaSyCyAzhSGNjz0VMDgLM1mJNajs7owgIa0Uk'}}
					style={[styles.propertyImage]}>
				</Image>
			)
		}
	}

	siteInfo(){
		// console.log(this.state.propertyData)
		return(
			<View style={styles.containerContent}>

				<View style={{height: 200, width: screenWidth}}>
				{
					this.carouselImage()
				}
  				</View>

				<View style={styles.contentWrapper}>
					<Text 
						style={[styleVar.size.h1, styles.siteAddress]}
						>
						{this.state.propertyData.AddressLine1}	
					</Text>
					<View style={styles.siteLocation}>
						<Icon name="place" size={20} color={styleVar.colors.greyDark}/>
						<Text style={styles.siteLocationTitle}>{this.state.propertyData.PostalCode} {this.state.propertyData.City}, {this.state.propertyData.State}</Text>
					</View>

					<View style={[styles.borderTB, styles.hostedWrapper]}>
						<View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
							<View>
								<Text style={[styleVar.size.h4, {color : styleVar.colors.black}]}>Hosted By</Text>
								<Text style={[styleVar.size.h4, {color : styleVar.colors.primary}]}>{this.state.propertyData.customer.FirstName}</Text>
							</View>
							<View>
								<Image source={(this.state.propertyData.customer.CustomerPictures.length == 0) ? require('image!user_upload') : {uri : 'http://travellers.azurewebsites.net/'+this.state.propertyData.customer.CustomerPictures[0].Path}} style={styles.hostedImage}/>
							</View>
						</View>

						<View style={{marginTop : 30}}>
							<Text style={[styleVar.size.h4, {color : styleVar.colors.black}]}>Site Info</Text>
						</View>

						<View style={styles.siteDescWrapper}>
							<Text>
								Width : 
								{ this.state.propertyData.Width ? this.state.propertyData.Width : 'N/A' }; 

								Height : 
								{ this.state.propertyData.Height ? this.state.propertyData.Height : 'N/A' }; 

								Length : 
								{ this.state.propertyData.Length ? this.state.propertyData.Length : 'N/A' }; 

								Security : 
								{ this.state.propertyData.Security ? 'Yes' : 'No' };

								Power : 
								{ this.state.propertyData.Powered ? 'Yes' : 'No'};

								Access :
								{ this.state.propertyData.AccessToProperty ? 'No Lock' : 'Lock'}

							</Text>
						</View>
					</View>

					{/*<View style={[styles.dateWrapper]}>
						<View style={[styles.dateRow]}>
							<View style={{justifyContent : 'center'}}>
								<Image source={require('image!icon_51')} style={[styles.imageDate, {tintColor : styleVar.colors.primary}]}/>
							</View>
							<View>
								<Text style={[styleVar.size.content, {color : styleVar.colors.black}]}>Arrival</Text>
								<Text style={[styleVar.size.h3, {color : styleVar.colors.primary}]}>18-09-2016</Text>
							</View>
						</View>

						<View>
							<View style={{width : 60}}></View>
							<View style={styles.separator}></View>
						</View>

						<View style={[styles.dateRow]}>
							<View style={{justifyContent : 'center'}}>
								<Image source={require('image!icon_51')} style={[styles.imageDate, {tintColor : styleVar.colors.secondary}]}/>
							</View>
							<View>
								<Text style={[styleVar.size.content, {color : styleVar.colors.black}]}>Departure</Text>
								<Text style={[styleVar.size.h3, {color : styleVar.colors.secondary}]}>21-09-2016</Text>
							</View>
						</View>
					</View>

					<View style={styles.buttonCenter}>
						<Image source={require('image!icon_44')} style={styles.buttonImage}/>
						<Text style={[styleVar.size.content, {color : styleVar.colors.greyDark}]}>Add Amenities</Text>
					</View>*/}

					<View style={styles.mapWrapper}>
						<MapView
							ref="map"
							style={styles.map}
							followUserLocation = {false}
							showsUserLocation = {false}
							zoomEnabled = {true}
							scrollEnabled={true}
							region={this.state.mapRegion}
						>
							{this.getMarker()}
							<MapView.Marker
								coordinate={{latitude : this.state.mapRegion.latitude, longitude : this.state.mapRegion.longitude, longitudeDelta : 0, latitudeDelta: 0}}  image={require('image!map_marker')}
							>
							</MapView.Marker>
						</MapView>

						<View style={styles.calloutContent}>
							<Text>{this.state.propertyData.City}, {this.state.propertyData.State} {this.state.propertyData.PostalCode}</Text>
						</View>

					</View>
					
				</View>
			</View>
		)
	}

	getMarker(){
		// console.log(this.state.propertyData)
		return(
			<MapView.Circle 
				center={{latitude : this.state.mapRegion.latitude, longitude : this.state.mapRegion.longitude}}
				radius={500}
				fillColor={styleVar.colors.primaryTransparent}
				strokeColor={styleVar.colors.primary}>
			</MapView.Circle>
		)
	}

	async showPicker(stateKey, options){
		try {
			var newState = {};
			const {action, year, month, day} = await DatePickerAndroid.open(options);
			if (action === DatePickerAndroid.dismissedAction) {
				var defaultDate = new Date(options.date)
				// newState[stateKey + 'Text'] = 'dismissed';
				// newState[stateKey + 'Text'] = defaultDate.getFullYear() + '-' + parseInt(defaultDate.getMonth()+1) + '-' + defaultDate.getDate();
				newState[stateKey + 'Text'] = moment(defaultDate).format('YYYY-MM-DD');
			} else {
				var date = new Date(year, month, day);
				// newState[stateKey + 'Text'] = date.toLocaleDateString();
				// newState[stateKey + 'Text'] = date.getFullYear() + '-'+ parseInt(date.getMonth()+1) + '-' + date.getDate();
				newState[stateKey + 'Text'] = moment(date).format('YYYY-MM-DD');
				newState[stateKey + 'Date'] = date;
				
				if(stateKey == 'arrival'){
					this.setState({
						minDate : date
					})
				}else{
					this.setState({
						maxDate : date
					})
				}
				this.refs.arrivalDate.blur();
				this.refs.departureDate.blur();
				this.onDateChange();
			}

			this.setState(newState);
		} catch ({code, message}) {
			console.warn(`Error in example '${stateKey}': `, message);
		}
    }

    checkDisabled(amenitiesID){
    	var amenityIndex = _.findLastIndex(this.state.billingItems, { ID : amenitiesID})
    	// console.log('index', amenityIndex)
    	// console.log('billing',this.state.billingItems)
    	if(amenityIndex >= 0){
    		return {backgroundColor : styleVar.colors.greySecondary}
    	}else{
    		return {backgroundColor : '#FFFFFF'}
    	}
    }
    checkAddDisabled(amenitiesID){
    	var amenityIndex = _.findLastIndex(this.state.billingItems, { ID : amenitiesID})

    	if(amenityIndex >= 0){
    		return "remove"
    	}else{
    		return "add"
    	}
    }

    getAmenityList(){
    	// console.log('amenities', this.state.PropertyAmenities)

    	if(this.state.PropertyAmenities.length > 0){
    		return(
	    		<View style={styles.amenitiesWrapper}>
	    			{this.state.PropertyAmenities.map( (key, index) => {

	    				return(
	    					<TouchableWithoutFeedback key={index} onPress={ () => this._addAmenities(key.ID)}>
		    					<View style={[styles.amenitiesItem, this.checkDisabled(key.ID)]} >
					      			<Text style={this.checkDisabled(key.ID)}>{key.Memo} ( ${key.Rate}.00/day )</Text>
					      			<Icon name={this.checkAddDisabled(key.ID)} size={25} color={styleVar.colors.greyDark}/>
					      		</View>
				      		</TouchableWithoutFeedback>
	    				)
	    			})}
		      	</View>
	    	)
    	}else{
    		return(
    			<View>
    				<Text>test</Text>
    			</View>
    		)
    	}    	
    }

    _addAmenities(amenitiesID){
    	// console.log(this.state.PropertyAmenities)
    	
    	var amenityIndex = _.findLastIndex(this.state.PropertyAmenities, { ID : amenitiesID})
    	// console.log(this.state.billingItems)
    	// console.log(this.state.PropertyAmenities[amenityIndex].Rate)
    	var billingIndex = _.findLastIndex(this.state.billingItems, { ID : amenitiesID})


    	if(billingIndex >= 0){
    		var rate = this.state.billingItems[billingIndex].Rate * this.state.diffDays;

    		this.setState({
    			billingTotalPrice : this.state.billingTotalPrice - rate
    		})
    		this.state.billingItems.splice(billingIndex, 1)
    	}else{
    		this.state.PropertyAmenities[amenityIndex]['type'] = 'amenities';
    		this.state.billingItems.push(this.state.PropertyAmenities[amenityIndex]);

    		var rate = this.state.PropertyAmenities[amenityIndex].Rate * this.state.diffDays;
    		// console.log(this.state.diffDays)
    		this.setState({
    			billingTotalPrice : this.state.billingTotalPrice + rate
    		})
    	}

    	this.setState({
			billingItems : this.state.billingItems
		})

    	// this.state.PropertyAmenities.splice(amenityIndex, 1);
    	// this.setState({
    	// 	PropertyAmenities : this.state.PropertyAmenities
    	// })
    	// console.log(this.state.PropertyAmenities)
    }

    getBookingDetailList(){
    	// console.log(this.state.billingItems)

    	return(
    		<View>
    			{this.state.billingItems.map( (key, index) => {
    				if(key.ID == ''){
    					return(
			    			<View style={styles.bookingDetailItem} key={index}>
			    				<Text style={styles.bookingDetailItemsTitle}>{key.Memo}</Text>
			    				<Text style={styles.bookingDetailItemsRate}>$ {key.Rate}.00</Text>
			    			</View>
			    		)	
    				}else{
    					return(
    						<View style={styles.bookingDetailItem} key={index}>
			    				<Text style={styles.bookingDetailItemsTitle}>{key.Memo} - {this.state.diffDays} day(s) x $ {key.Rate}.00</Text>
			    				<Text style={styles.bookingDetailItemsRate}>$ {parseInt(key.Rate*this.state.diffDays)}.00</Text>
			    			</View>
    					)
    				}
		    		
		    	})}
    		</View>
    	)
    	
    }

	bookDetail(){
		return(
			<View style={styles.containerContent}>
				<View style={styles.searchForm}>
					<ScrollView style={{flex : 1,paddingLeft : 0, marginRight : 10, position: 'relative'}}
			      		showsVerticalScrollIndicator={false}>
				        <TextField
							label={'Arrival Date'}
							highlightColor={styleVar.colors.secondary}
							ref="arrivalDate"
							textColor={styleVar.colors.black}
							labelColor={styleVar.colors.primary}
							dense={false}
							onFocus={this.showPicker.bind(this, 'arrival', {
					          	date: new Date(this.state.fromDate),
					          	minDate : new Date(),
					          	maxDate : new Date(this.state.maxDate)
					        })}
							blurOnSubmit={true}
							labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
							inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 18}}
							autoGrow={true}
							value={this.state.arrivalText}
							editable={false}/>

				        <Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      	</ScrollView>

			      	<ScrollView style={{flex : 1,paddingLeft : 0}}
			      		showsVerticalScrollIndicator={false}>
				        <TextField
							label={'Departure Date'}
							highlightColor={styleVar.colors.secondary}
							ref="departureDate"
							textColor={styleVar.colors.black}
							labelColor={styleVar.colors.primary}
							dense={false}
							onFocus={this.showPicker.bind(this, 'departure', {
							    date: new Date(this.state.toDate),
					          	minDate : new Date(this.state.minDate)
							})}
							blurOnSubmit={true}
							labelStyle={{fontFamily : 'gothic', color : styleVar.colors.primary}}
							inputStyle={{fontFamily : 'gothic',padding: 0,fontSize : 18}}
							value={this.state.departureText}
							editable={false}/>

				         <Icon name="event-available" size={30} color={styleVar.colors.greyDark} style={{position: 'absolute', right: 0,bottom:10}}></Icon>
			      	</ScrollView>
				</View>
				
				<View style={styles.detailBox}>
					<View style={styles.detailBoxHeader}>
						<Text style={[styleVar.size.h4, styles.titleSection]}>
							available amenities below if you needed 
						</Text>
					</View>
					{ this.getAmenityList() }
				</View>

				<View style={styles.detailBox}>
					<View style={styles.detailBoxHeader}>
						<Text style={[styleVar.size.h4, styles.titleSection]}>
							Booking Detail
						</Text>
					</View>
					
					{ 
						this.getBookingDetailList() 
					}
				</View>

				<View style={styles.bookingTotal}>
					<Text style={styles.bookingTotalTitle}>Total Price</Text>
					<Text style={[styles.bookingTotalTitle, {color: styleVar.colors.primaryDark}]}>${this.state.billingTotalPrice}.00</Text>
				</View>

				<TouchableWithoutFeedback onPress={() => this._bookProcess()}>
					<View  style={styles.btnBook}>
					<Text style={styles.btnBookCaption}>Book Now</Text>
					</View>
				</TouchableWithoutFeedback>
				
			</View>
		)
	}

	onDateChange(){
		var fromDate = moment(this.state.minDate).format('YYYY-MM-DD'),
			toDate = moment(this.state.maxDate).format('YYYY-MM-DD');

		// console.log('fromDate', fromDate);
		// console.log('toDate', toDate);
		// console.log('siteID', this.state.siteId)

		this.setState({
			preloadBookInfo : true
		})

		var request = new Request(CONSTANT.API_URL+'properties/newdatesearch', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
			},
			body : JSON.stringify({
				FromDate : fromDate,
				ToDate : toDate,
				PropertyID : this.state.siteId
			})
		})

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response.Data.PropertyRates)
				this.setState({
					preloadBookInfo : false
				})

				if(response.Data == null){
					this.setState({
						arrivalText : this.state.fromDate,
						departureText : this.state.toDate
					})
					alert("No availability for the selected date range!");
				}else{
					this.setState({
						fromDate : fromDate,
						toDate : toDate
					})
					this._countBilling(response.Data)
				}
				
			})
			.catch((err) => {
				this.setState({
					preloadBookInfo : false
				})

				alert("We Cannot retrieve data, check your internet connection");
			})
	}

	_bookProcess(){
		var arrAmenities = _.pluck(_.where(this.state.billingItems, { type: 'amenities' }), 'ID')
		this.setState({
			loading : true
		});
		var request = new Request(CONSTANT.API_URL+'request/save', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify({
				PropertyID : this.state.siteId,
				FromDate : this.state.fromDate,
				ToDate : this.state.toDate,
				ChosenAmenities : arrAmenities
			})
		})

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				// console.log(response)
				this.setState({
					loading : false
				});
				if(response.Status == 409){
					alert("This site is already booked, please change your date")
				}else{

					Alert.alert(
						'Booking Success',
						'Send booking request to site owner, We will notice you if there is an update from site owner ',
						[
							{text : 'OK', onPress: () => this._bookSuccess()}
						]
					)

				}
			})
			.catch((err) => {
				console.log(err)
				this.setState({
					loading : false
				});
				alert('Booking Error, please check your internet connection');
			})
	}

	_bookSuccess(){
		var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
		sceneConfig.gestures.pop.disabled = true;
    	

    	this.props.toRoute({
			name : 'myBooking',
			component : require('./myBooking'),
    		sceneConfig : sceneConfig
		})
		// this.props.replaceRoute(Routes.link('transactionList'));
	}

	preloadBook(status){
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
		return(
			<View style={styles.containerHome}>
				<View style={[styles.headerModal]}>
					<Icon name='arrow-back' size={30} color={this.state.headerColor} onPress={() => this.backHome()}></Icon>
					<Text style={[styles.headTotalPrice, {color: this.state.headerColor, fontFamily : 'gothic'}]}>Total Price : ${this.state.billingTotalPrice}.00</Text>
				</View>
				
				<ModalLoading viewModal={this.state.loading}/>
				<ScrollTabView
					renderTabBar={() => <DefaultTabBar style={styles.scrollbarWrapper}/>}
					locked={true}
					initialPage={0}
					tabBarPosition="bottom"
					tabBarActiveTextColor={styleVar.colors.primary}
					tabBarUnderlineColor={styleVar.colors.primary}
					tabBarInactiveTextColor={styleVar.colors.greyDark}
	      			tabBarTextStyle={{fontFamily: 'gothic', fontSize: 15}}
				>
					<ScrollView
						tabLabel="Site Info"
						key={0}
						style={styles.scrollbarView}
						showsVerticalScrollIndicator={true}>
						
						{this.siteInfo()}

					</ScrollView>

					<ScrollView
						tabLabel="Book Now"
						key={1}
						style={styles.scrollbarView}	
						showsVerticalScrollIndicator={true}>

						{this.preloadBook(this.state.preloadBookInfo)}
						
						{this.bookDetail()}
					</ScrollView>
				</ScrollTabView>
			</View>
		)
	}
}

DetailSite.PropTypes = PropTypes;

module.exports = DetailSite;