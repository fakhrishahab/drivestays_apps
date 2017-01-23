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
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import ScrollTabView,  {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';
import styleVar from '../styleVar';

import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import AccessToken from '../accessToken';
import styles from '../style/stayRequest';
import CONSTANT from '../constantVar';
import _ from 'underscore';
import moment from 'moment';
import ModalLoading from '../plugin/ModalLoading';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

class StayRequest extends Component{

	constructor(props) {
		super(props);
	
	  	this.state = {
	  		renderPlaceholderOnly : true,
	  		access_token : '',
	  		loading : false,
	  		initialTab : 0,
	  		statusTypeID : 1,
	  		preloadRequest : false,
	  		stayRequestData : ''
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

	renderLoading(status){
		if(status){
			return <ModalLoading/>
		}else{
			return(
				<View></View>
			)
		}
	}

    componentDidMount(){
    	InteractionManager.runAfterInteractions(()=>{
			this.setState({
				renderPlaceholderOnly : false
			});
		});	

		AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
			this.setState({
				access_token : value
			});

			this._getStayRequestData(this.state.statusTypeID);
		});
    }

    _getStayRequestData(id){
    	this.setState({
    		stayRequestData : '',
			preloadRequest : true
		});

		var request = new Request(CONSTANT.API_URL+'requests/getincoming/'+id, {
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
				// console.log(response.Data);
				this.setState({
					preloadRequest : false,
					stayRequestData : response.Data
				});
			})
			.catch((err) => {
				console.log('error',err);
				this.setState({
					preloadRequest : false
				});
			})
    }

    renderStayRequest(requestData){
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
							<Text style={[styles.requestItemName, styleVar.fontGothic]}>{key.RenterFirstName} {(key.RenterLastName) ? key.RenterLastName : ''}</Text>
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
									<Text style={[styleVar.fontGothic]}>{moment(key.Request.FromDate).format('YYYY-MM-DD')} to {moment(key.Request.ToDate).format('YYYY-MM-DD')}</Text>
									<Text style={[styleVar.fontGothic]}>Total Price : $ {total}.00</Text>
								</View>
							</View>
							<View style={styles.detailInfoWrapper}>
								<TouchableHighlight>
									<View style={styles.detailInfoButton}>
										<Icon name='person' size={18} color={styleVar.colors.greyPrimary} />
										<Text style={[styleVar.size.content, {marginLeft : 5}]}>User Detail</Text>
									</View>
								</TouchableHighlight>

								<TouchableHighlight>
									<View style={styles.detailInfoButton}>
										<Icon name='directions-bus' size={18} color={styleVar.colors.greyPrimary} />
										<Text style={[styleVar.size.content, {marginLeft : 5}]}>Caravan Info</Text>
									</View>
								</TouchableHighlight>
							</View>
							{this.renderButton(key.Request, index)}
							
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
    	console.log(request.StatusTypeID)
    	switch(request.StatusTypeID){
    		case 1:
    			return(
		    		<View style={styles.requestItemActionButton}>
		    			<TouchableHighlight onPress={() => this._acceptRequest(request.ID, index)}>
							<View style={[styles.requestButton, styles.buttonSecondary]}>
								<Text style={{color: '#FFF'}}>Accept Request</Text>
							</View>
						</TouchableHighlight>
						<TouchableHighlight onPress={() => this._declineRequest(request.ID, index)}>
							<View style={[styles.requestButton, styles.buttonPrimary]}>
								<Text style={{color: '#FFF'}}>Decline Request</Text>
							</View>
						</TouchableHighlight>
					</View>
		    	)
    		break;
    		case 2 :
	    		return(
			    		<View style={styles.requestItemActionButton}>
							<TouchableHighlight onPress={() => this._cancelRequest(request.ID, index)}>
								<View style={[styles.requestButton, styles.buttonPrimary]}>
									<Text style={{color: '#FFF'}}>Cancel Request</Text>
								</View>
							</TouchableHighlight>
						</View>
			    	)
    		break;
    		case 4 :
	    		return(
			    		<View style={styles.requestItemActionButton}>
							<TouchableHighlight onPress={() => this._cancelRequest(request.ID, index)}>
								<View style={[styles.requestButton, styles.buttonPrimary]}>
									<Text style={{color: '#FFF'}}>Cancel Request</Text>
								</View>
							</TouchableHighlight>
						</View>
			    	)
    		break;
    	}
    }

    _acceptRequest(requestID, index){
    	Alert.alert(
			'Attention',
			'Are you sure want to accept this request?',
			[
				{text : 'Sure', onPress: () => this._doAcceptRequest(requestID, index)},
				{text : 'No', onPress: () => console.log('No pressed')}
			]
		);
    }

    _doAcceptRequest(id, index){
    	this.setState({
			loading : true
		});

		var request = new Request(CONSTANT.API_URL+'request/accept/'+id, {
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
				console.log(response);
				this.state.stayRequestData.splice(index, 1);

				this.setState({
					loading : false,
		    		stayRequestData : this.state.stayRequestData
				});
			})
			.catch((err) => {
				console.log('error',err);
				this.setState({
					loading : false
				});

			})
    }

    _declineRequest(requestID, index){
    	Alert.alert(
			'Attention',
			'Are you sure want to decline this request?',
			[
				{text : 'Sure', onPress: () => this._doDeclineRequest(requestID, index)},
				{text : 'No', onPress: () => console.log('No pressed')}
			]
		);
    }

    _doDeclineRequest(id, index){
    	this.setState({
			loading : true
		});

		var request = new Request(CONSTANT.API_URL+'request/decline/'+id, {
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
				console.log(response);
				this.state.stayRequestData.splice(index, 1);

				this.setState({
					loading : false,
		    		stayRequestData : this.state.stayRequestData
				});
			})
			.catch((err) => {
				console.log('error',err);
				this.setState({
					loading : false
				});
			})
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

    _doCancelRequest(id, index){
    	this.setState({
			loading : true
		});

		var request = new Request(CONSTANT.API_URL+'request/cancelbyowner/'+id, {
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
				console.log(response);
				this.state.stayRequestData.splice(index, 1);

				this.setState({
					loading : false,
		    		stayRequestData : this.state.stayRequestData
				});
			})
			.catch((err) => {
				console.log('error',err);
				this.setState({
					loading : false
				});
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

				this._getStayRequestData(i+1)
				break;
			case 4 :
			case 5 : 
			case 6 : 
			case 7 : 
				this.setState({
					statusTypeID : i+3
				})

				this._getStayRequestData(i+3)
				break;
		};
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
			    	<HeaderContent onPress={() => this.toggle()} title="Stay Request"/>

			    	<ModalLoading viewModal={this.state.loading}/>

			    	<ScrollTabView
						renderTabBar={() => <ScrollableTabBar style={styles.scrollbarWrapper}/>}
						locked={false}
						initialPage={this.state.initialTab}
						ref="scrollTab"
						tabBarPosition="top"
						tabBarActiveTextColor={styleVar.colors.primary}
						tabBarUnderlineColor={styleVar.colors.primary}
						tabBarInactiveTextColor={styleVar.colors.greyDark}
		      			tabBarTextStyle={{fontFamily: 'gothic', fontSize: 15}}
		      			onChangeTab={this.handleChangeTab.bind(this)}
					>
						<ScrollView
							tabLabel="INCOMING REQUEST"
							key={1}
							index={1}
							style={styles.scrollbarView}
							showsVerticalScrollIndicator={true}>

							{
								this.preloadSave(this.state.preloadRequest)
							}
							
							{
								this.renderStayRequest(this.state.stayRequestData)
							}

						</ScrollView>

						<ScrollView
							tabLabel="APPROVE"
							key={2}
							index={2}
							style={styles.scrollbarView}
							showsVerticalScrollIndicator={true}>

							{
								this.preloadSave(this.state.preloadRequest)
							}
							
							{
								this.renderStayRequest(this.state.stayRequestData)
							}

						</ScrollView>

						<ScrollView
							tabLabel="DECLINED"
							key={3}
							index={3}
							style={styles.scrollbarView}
							showsVerticalScrollIndicator={true}>

							{
								this.preloadSave(this.state.preloadRequest)
							}
							
							{
								this.renderStayRequest(this.state.stayRequestData)
							}

						</ScrollView>

						<ScrollView
							tabLabel="PAID"
							key={4}
							index={4}
							style={styles.scrollbarView}
							showsVerticalScrollIndicator={true}>

							{
								this.preloadSave(this.state.preloadRequest)
							}
							
							{
								this.renderStayRequest(this.state.stayRequestData)
							}

						</ScrollView>

						<ScrollView
							tabLabel="CANCELLED - BY VISITOR"
							key={7}
							index={7}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{
								this.preloadSave(this.state.preloadRequest)
							}
							
							{
								this.renderStayRequest(this.state.stayRequestData)
							}
						</ScrollView>

						<ScrollView
							tabLabel="CANCELLED - BY OWNER"
							key={8}
							index={8}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{
								this.preloadSave(this.state.preloadRequest)
							}
							
							{
								this.renderStayRequest(this.state.stayRequestData)
							}
						</ScrollView>
						<ScrollView
							tabLabel="CANCELLED - BY SYSTEM"
							key={9}
							index={9}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{
								this.preloadSave(this.state.preloadRequest)
							}
							
							{
								this.renderStayRequest(this.state.stayRequestData)
							}
						</ScrollView>
					</ScrollTabView>
			    </View>
			</DrawerLayout>
		)
	}
}

module.exports = StayRequest;