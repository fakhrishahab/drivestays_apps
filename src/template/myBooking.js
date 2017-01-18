import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Image,
  View,
  TouchableHighlight,
  InteractionManager,
  ActivityIndicator,
  ScrollView,
  AsyncStorage,
  Dimensions,
  Alert,
  Modal,
  Navigator
} from 'react-native';
import MapView from 'react-native-maps';
import ScrollTabView,  {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';
import styleVar from '../styleVar';

import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import AccessToken from '../accessToken';
import styles from '../style/myBookingStyle';
import CONSTANT from '../constantVar';
import _ from 'underscore';
import moment from 'moment';
import ModalLoading from '../plugin/ModalLoading';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}
let screenWidth = Dimensions.get('window').width;

class MyBooking extends Component{

	constructor(props) {
		super(props);
	
	  	this.state = {
	  		statusTypeID : 1,
	  		access_token : '',
	  		renderPlaceholderOnly : true,
	  		preloadRequest : true,
	  		preloadSubmitted : false,
	  		preloadApprove : false,
	  		preloadDeclined : false,
	  		preloadPaid : false,
	  		preloadAcceptFree : false,
	  		preloadCancelVisitor : false,
	  		preloadCancelOwner : false,
	  		preloadCancelSystem : false,
	  		requestData : '',
	  		requestSubmitted : '',
	  		requestApprove : '',
	  		requestDeclined : '',
	  		requestPaid : '',
	  		requestAcceptFree : '',
	  		requestCancelVisitor : '',
	  		requestCancelOwner : '',
	  		requestCancelSystem : '',
	  		loading : false
	  	};
	  	this.onNextPage = this.onNextPage.bind(this);
	}

	toggle() {
		this.drawer.openDrawer();
        this.setState({
          isOpen: !this.state.isOpen,
        });
    }

    onNextPage = (menu) => {
		this.props.toRoute(Routes.link(menu));
    }

	_onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

    componentDidMount(){
    	InteractionManager.runAfterInteractions(()=>{
			this.setState({
				renderPlaceholderOnly : false,
				preloadRequest : true
			})
		})	

    	AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
    		this.setState({access_token : value})

    		this._getRequestSubmited(this.state.statusTypeID);
    	})
    }

    _getRequestSubmited(id){
    	// console.log('status id', id)
    	this.setState({
    		requestData : '',
			preloadRequest : true
		});
    	var request = new Request(CONSTANT.API_URL+'requests/getbystatus?RequestStatusID='+id, {
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
    			this.setState({
    				requestData : response.Data,
    				preloadRequest : false
    			});
    			// console.log(response.Data[0].Request.ID);
    		})
    		.catch((err) => {
    			console.log('error', err);
    			this.setState({
    				preloadRequest : false
    			});
    		})
    }

    preloadSave(status){
		if(status){
			return(
				<View style={{flex : 1,}}>
					<ActivityIndicator
				        animating={true}
				        style={{height: 80,padding: 8, marginTop: 10}}
				        color={styleVar.colors.secondary}
				        size="large"/>
				</View>
			)
		}else{
			return(
				<View style={{position:'absolute'}}>
				</View>
			)
		}
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

	renderSubmittedRequest(requestData){
		if(requestData != ''){
			return(
				requestData.map((key, index) => {
					var total = 0;
					_.chain(key.Request.RequestBillingItems)
					.map(function(num){
						total += num.Amount;
					});

					return(
						<View style={styles.requestItemWrapper} key={index}>
							<Text style={[styles.requestItemName, styleVar.fontGothic]}>You</Text>
							<View style={styles.requestItemSiteWrapper}>
								{
									(key.MainPropertyPicture) ? 

									<Image source={{uri : CONSTANT.WEB_URL+key.MainPropertyPicture}} style={{height : 100, width : 100}}/> 

									:

									<Image source={require('image!site_notfound')} style={{height : 100, width : 100}}/> 
								}
								
								<View style={styles.requestItemDescWrapper}>
									<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>{key.PropertyAddressLine1}</Text>
									<Text style={[styleVar.fontGothic]}>Booking Date {moment(key.Request.Date).format('YYYY-MM-DD')}</Text>
									<Text style={[styleVar.fontGothic]}>From {moment(key.Request.FromDate).format('YYYY-MM-DD')} To {moment(key.Request.ToDate).format('YYYY-MM-DD')}</Text>
									<Text style={[styleVar.fontGothic]}>Total Price : $ {total}.00</Text>
								</View>
							</View>
							{
								this.renderButton(key.Request, index)
							}
							
						</View>

					)
				})
			)
		}else if(requestData == '' && this.state.preloadRequest == false){
			return(
				<View style={styles.requestItemWrapperNull}>
					<Text>
						- No Data -
					</Text>
				</View>
			)
		}
	}

	renderButton(request, index){
		switch(request.StatusTypeID){
			case 1 : 
				return(
					<View style={styles.requestItemActionButton}>
						<TouchableHighlight onPress={() => this._cancelRequest(request.ID, index)}>
							<View style={[styles.requestButton, styles.buttonPrimary]}>
								<Text style={{color: '#FFF'}}>Cancel Order</Text>
							</View>
						</TouchableHighlight>
					</View>
				)
			break;

			case 2 : 
				return(
					<View style={styles.requestItemActionButton}>
						<TouchableHighlight onPress={() => this._paymentRequest(request.ID, index)}>
							<View style={[styles.requestButton, styles.buttonSecondary]}>
								<Text style={{color: '#FFF'}}>Continue To Payment</Text>
							</View>
						</TouchableHighlight>
						<TouchableHighlight onPress={() => this._cancelRequest(request.ID, index)}>
							<View style={[styles.requestButton, styles.buttonPrimary]}>
								<Text style={{color: '#FFF'}}>Cancel Order</Text>
							</View>
						</TouchableHighlight>
					</View>
				)
			break;
		}
	}

	_cancelRequest(requestID, index){
		Alert.alert(
			'Attention',
			'Are you sure want to cancel this request?',
			[
				{text : 'Sure', onPress: () => this._doCancelRequest(requestID, index)},
				{text : 'No', onPress: () => console.log('No pressed')}
			]
		);
	}

	_paymentRequest(requestID, index){
		Alert.alert(
			'Attention',
			'Are you sure want to continue to payment process?',
			[
				{text : 'Sure', onPress: () => this._doPaymentRequest(requestID, index)},
				{text : 'No', onPress: () => console.log('No pressed')}
			]
		);
	}

	_doCancelRequest(id, index){
		this.setState({
			loading : true
		});

		var request = new Request(CONSTANT.API_URL+'request/cancelbyrenter/'+id, {
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
				this.state.requestData.splice(index, 1)

				this.setState({
					requestData : this.state.requestData,
					loading : false
				})
			})
			.catch((err) => {
				console.log('error', err);
				this.setState({
					loading : false
				})
			})
	}

	_doPaymentRequest(id, index){
		var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
    	sceneConfig.gestures.pop.disabled = true;
    	

    	this.props.toRoute({
			name : 'invoice',
			component : require('./invoice'),
			data : {
				RequestID : id
			},
    		sceneConfig : sceneConfig
		})
    	  
	}

	handleChangeTab({i, ref, from}){

		switch(i){
			case 0 :
			case 1 :
			case 2 : 
			case 3 :
				this.setState({
					statusTypeID : i+1
				})

				this._getRequestSubmited(i+1)
				break;
			case 4 :
			case 5 : 
			case 6 : 
			case 7 : 
				this.setState({
					statusTypeID : i+3
				})

				this._getRequestSubmited(i+3)
				break;
		};
	}

	renderLoading(status){
		if(status){
			return <ModalLoading/>
		}else{
			return(
				<View></View>
			)
		}
	}

	render(){
    	const menu = <Menu nextPage={this.onNextPage} logout={this._onLogout}/>;

    	if (this.state.renderPlaceholderOnly) {
	    	return this.preload();
	    }

		return(
			<DrawerLayout
		      drawerWidth={300}
		      ref={(drawer) => { return this.drawer = drawer  }}
		      drawerPosition={DrawerLayout.positions.Left}
		      renderNavigationView={() => menu}>
				<View style={styles.containerHome}>
			    	<HeaderContent onPress={() => this.toggle()}  title="My Booking" />

			    	<ModalLoading viewModal={this.state.loading}/>
			    	    	
			    	<ScrollTabView
						renderTabBar={() => <ScrollableTabBar style={styles.scrollbarWrapper}/>}
						locked={false}
						initialPage={0}
						ref="scrollTab"
						tabBarPosition="top"
						tabBarActiveTextColor={styleVar.colors.primary}
						tabBarUnderlineColor={styleVar.colors.primary}
						tabBarInactiveTextColor={styleVar.colors.greyDark}
		      			tabBarTextStyle={{fontFamily: 'gothic', fontSize: 15}}
		      			onChangeTab={this.handleChangeTab.bind(this)}
					>
						<ScrollView
							tabLabel="SUBMITTED"
							key={1}
							index={1}
							style={styles.scrollbarView}
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{
								this.renderSubmittedRequest(this.state.requestData)
							}

						</ScrollView>

						<ScrollView
							tabLabel="APPROVE"
							key={2}
							index={2}
							style={styles.scrollbarView}
							onEnter={() => {this._doThis()}}	
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{
								this.renderSubmittedRequest(this.state.requestData)
							}
						</ScrollView>
						<ScrollView
							tabLabel="DECLINED"
							key={3}
							index={3}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{
								this.renderSubmittedRequest(this.state.requestData)
							}
						</ScrollView>
						<ScrollView
							tabLabel="PAID"
							key={4}
							index={4}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{
								this.renderSubmittedRequest(this.state.requestData)
							}
						</ScrollView>
						
						<ScrollView
							tabLabel="CANCELLED - BY VISITOR"
							key={7}
							index={7}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{
								this.renderSubmittedRequest(this.state.requestData)
							}
						</ScrollView>
						<ScrollView
							tabLabel="CANCELLED - BY OWNER"
							key={8}
							index={8}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{
								this.renderSubmittedRequest(this.state.requestData)
							}
						</ScrollView>
						<ScrollView
							tabLabel="CANCELLED - BY SYSTEM"
							key={9}
							index={9}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{
								this.renderSubmittedRequest(this.state.requestData)
							}
						</ScrollView>
					</ScrollTabView>
			    	{
			    // 		<View style={styles.containerContent}>
							// <Text>This is Transaction List Page</Text>
			    // 		</View>
			    	}
			    </View>
			</DrawerLayout>
		)
	}
}

module.exports = MyBooking;