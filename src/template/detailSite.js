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
		  	// siteId : 350,
		  	// fromDate : '2016-11-28',
		  	// toDate : '2016-11-30',
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
	  		access_token : ''
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
	            'DailyRate ' : key.rate,
	            'Rate' : key.rate * key.date.length,
	            'Type' : 'daily'
	        };

	        items.push(dailyBilling);
		})
		
		var timeDiff = Math.abs(new Date(this.state.toDate).getTime() - new Date(this.state.fromDate).getTime())

		this.setState({
        	billingItems : items,
        	billingTotalPrice : items[0].Rate,
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
				newState[stateKey + 'Text'] = defaultDate.getFullYear() + '-' + parseInt(defaultDate.getMonth()+1) + '-' + defaultDate.getDate();
			} else {
				var date = new Date(year, month, day);
				newState[stateKey + 'Text'] = date.toLocaleDateString();
				newState[stateKey + 'Text'] = date.getFullYear() + '-'+ parseInt(date.getMonth()+1) + '-' + date.getDate();
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
    	// console.log(this.state.billingItems)
    	var amenityIndex = _.findLastIndex(this.state.PropertyAmenities, { ID : amenitiesID})

    	var billingIndex = _.findLastIndex(this.state.billingItems, { ID : amenitiesID})


    	if(billingIndex >= 0){
    		var rate = this.state.billingItems[billingIndex].Rate * this.state.diffDays;

    		this.setState({
    			billingTotalPrice : this.state.billingTotalPrice - rate
    		})
    		this.state.billingItems.splice(billingIndex, 1)
    	}else{
    		this.state.billingItems.push(this.state.PropertyAmenities[amenityIndex]);

    		var rate = this.state.PropertyAmenities[amenityIndex].Rate * this.state.diffDays;

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
			    				<Text style={styles.bookingDetailItemsRate}>${key.Rate}.00</Text>
			    			</View>
			    		)	
    				}else{
    					return(
    						<View style={styles.bookingDetailItem} key={index}>
			    				<Text style={styles.bookingDetailItemsTitle}>{key.Memo}</Text>
			    				<Text style={styles.bookingDetailItemsRate}>${parseInt(key.Rate*this.state.diffDays)}.00</Text>
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
							Addasdasd available amenities below if you needed 
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
		// console.log(this.state.siteId, this.state.fromDate, this.state.toDate)
		var request = new Request(CONSTANT.API_URL+'request/save', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
				'Authorization' : this.state.access_token
			},
			body : JSON.stringify({
				PropertyID : this.state.siteId,
				FromDate : this.state.fromDate,
				ToDate : this.state.toDate
			})
		})

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				console.log(response)
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
				alert('Booking Error, please check your internet connection');
			})
	}

	_bookSuccess(){
		this.props.replaceRoute(Routes.link('transactionList'));
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

// const styles=StyleSheet.create({
// 	containerHome : {
// 		flex: 1,
// 		backgroundColor : '#FFFFFF',
// 	},
// 	headerModal : {
// 		flexDirection: 'row',
// 		justifyContent : 'space-between',
// 		alignItems : 'center',
// 		height : 60,
// 		top: 0,
// 		left: 0,
// 		bottom: 0,
// 		right: 0,
// 		paddingLeft : 10,
// 		paddingRight : 20,
// 		position : 'absolute',
// 		zIndex : 2,
// 		backgroundColor : styleVar.colors.primary,
// 		elevation :5,
// 	},
// 	containerContent : {
// 		flex:1,
// 		bottom:0,
// 		marginTop:60
// 	},
// 	contentWrapper : {
// 		backgroundColor : '#FFF',
// 	},
// 	mapWrapper : {
// 		padding : 20
// 	},
// 	map : {
// 		left : 0,
// 		right : 0,
// 		height : 300,
// 		top: 0,
// 		bottom : 0
// 	},
// 	calloutContent : {
// 		position:'absolute',
// 		top: 40,
// 		left : 40,
// 		right : 40,
// 		elevation : 1,
// 		borderRadius : 3,
// 		padding : 7,
// 		backgroundColor : '#FFFF',
// 		flex:1,
// 		flexDirection : 'row',
// 		justifyContent : 'center',
// 	},
// 	scrollbarWrapper : {
// 		backgroundColor : styleVar.colors.greySecondary,
// 		borderTopWidth : 0.5,
// 		borderTopColor : styleVar.colors.greyDark
// 	},
// 	scrollbarView : {
// 	},
// 	propertyImage : {
// 		left : 0,
// 		right: 0,
// 		top: 0,
// 		width : screenWidth,
// 		height : 200,
// 		resizeMode : 'cover',
// 	},
// 	scrollView : {
// 		flex : 1,
// 		left : 0,
// 		right: 0,
// 		top:0,
// 		bottom:0
// 	},
// 	siteAddress : {
// 		color : styleVar.colors.primary,
// 		marginTop: 20,
// 		marginLeft: 20,
// 		paddingLeft : 20,
// 		paddingRight : 20,
// 		paddingTop : 20,
// 		paddingBottom : 5,
// 	},
// 	siteLocation : {
// 		flex : 1,
// 		flexDirection :'row',
// 		paddingHorizontal : 20,
// 		marginBottom : 20
// 	},
// 	siteLocationTitle : {
// 		color:styleVar.colors.greyDark, 
// 		fontFamily: 'gothic',
// 		lineHeight : 5
// 	},
// 	borderTB : {
// 		borderBottomColor : styleVar.colors.greyDark,
// 		borderBottomWidth : 0.3,
// 		borderTopColor : styleVar.colors.greyDark,
// 		borderTopWidth : 0.3,
// 	},
// 	hostedWrapper : {
// 		padding : 20
// 	},
// 	hostedImage : {
// 		height : 40,
// 		width : 40,
// 		paddingHorizontal : 20,
// 	},
// 	amenitiesWrapper : {
// 		alignItems : 'center',
// 		justifyContent : 'space-between',
// 		flexDirection : 'column',
// 		paddingHorizontal : 10,
// 		paddingTop: 10,
// 		borderBottomColor : styleVar.colors.greyDark,
// 		borderBottomWidth : 0.3,
// 		borderTopColor : styleVar.colors.greyDark,
// 		borderTopWidth : 0.3,
// 		justifyContent:  'space-between'
// 	},
// 	amenitiesIcon : {
// 		width : 30,
// 		height : 30,
// 		tintColor : styleVar.colors.greyDark
// 	},
// 	amenitiesCount : {
// 		color : '#000',
// 		fontFamily : 'gothic',
// 		fontSize : 25
// 	},
// 	amenitiesItem : {
// 		left:0,
// 		right: 0,
// 		padding: 10,
// 		width: screenWidth-20,
// 		flex: 1,
// 		flexDirection: 'row',
// 		borderColor: styleVar.colors.greySecondary,
// 		borderStyle: 'solid',
// 		// backgroundColor: '#FFFFFF',
// 		borderWidth: 1,
// 		elevation :1,
// 		marginBottom: 10,
// 		justifyContent:  'space-between'
// 	},
// 	infoWrapper : {
// 		flexDirection : 'row',
// 		justifyContent : 'space-between',
// 		paddingVertical : 10,
// 		borderBottomWidth : 0.3,
// 		borderBottomColor : styleVar.colors.greyDark
// 	},
// 	infoItem : {
// 		fontFamily : 'gothic',
// 		fontSize : 14
// 	},
// 	infoDetail : {
// 		fontFamily : 'gothic',
// 		color : styleVar.colors.greySecondary
// 	},
// 	siteDescWrapper : {
// 		flex : 1,
// 		flexWrap : 'wrap'
// 	},
// 	dateWrapper : {
// 		backgroundColor : '#CCC',
// 		padding : 20
// 	},
// 	dateRow : {
// 		flex : 1,
// 		flexDirection : 'row',
// 		left : 0,
// 		right : 0
// 	},
// 	imageDate : {
// 		height : 30,
// 		width : 30,
// 		marginRight : 20,
// 		alignSelf : 'center'
// 	},
// 	separator : {
// 		marginVertical : 10,
// 		height : 0.5,
// 		backgroundColor : styleVar.colors.greyDark
// 	},
// 	buttonCenter : {
// 		alignSelf : 'center',
// 		borderWidth : 1,
// 		flexDirection : 'row',
// 		borderColor : styleVar.colors.greyDark,
// 		alignItems : 'center',
// 		height : 40,
// 		paddingHorizontal : 10,
// 		marginTop : 20
// 	},
// 	buttonImage : {
// 		width : 20,
// 		height : 20,
// 		marginRight : 10
// 	},
// 	searchForm : {
// 		backgroundColor : styleVar.colors.greySecondary,
// 		flex : 1,
// 		padding : 20,
// 		left : 0,
// 		right : 0,
// 		top : 0,
// 		flexDirection :'row',
// 		alignItems : 'flex-start',
// 		justifyContent : 'space-around'
// 	},
// 	inputStyle : {
// 		fontFamily : 'gothic',
// 		padding: 0,
// 		fontSize : 18
// 	},
// 	carouselItem : {
// 		width: screenWidth,
// 	    flex: 1,
// 	    justifyContent: 'center',
// 	    alignItems: 'center',
// 	    backgroundColor: 'transparent',
// 	}
// })
	
DetailSite.PropTypes = PropTypes;

module.exports = DetailSite;