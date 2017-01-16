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
  Dimensions
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

const propTypes = {
  toRoute: PropTypes.func.isRequired
}
let screenWidth = Dimensions.get('window').width;

class MyBooking extends Component{

	constructor(props) {
		super(props);
	
	  	this.state = {
	  		defaultStatusID : 1,
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
	  		requestCancelSystem : ''
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

    		this._getRequestSubmited(this.state.defaultStatusID);
    	})
    }

    _getRequestSubmited(id){
    	this.setState({
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
    			// console.log(response);
    		})
    		.catch((err) => {
    			console.log('error', err);
    		})
    }

    preloadSave(status){
		if(status){
			return(
				<View style={{position:'absolute', flex: 1, width: screenWidth, bottom:0, top:0, left:0, right: 0, backgroundColor: 'rgba(255, 255, 255, 1)', zIndex: 5, elevation : 10}}>
					<ActivityIndicator
				        animating={true}
				        style={{height: 80,padding: 8, marginTop: 0}}
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
									<Text style={[styleVar.fontGothic]}>Address Line</Text>
									<Text style={[styleVar.fontGothic]}>From 2016-10-25 To 2016-10-29</Text>
									<Text style={[styleVar.fontGothic]}>Total Price : $ 200.00</Text>
								</View>
							</View>
							<View style={styles.requestItemActionButton}>
								<TouchableHighlight>
									<View style={[styles.requestButton, styles.buttonPrimary]}>
										<Text style={{color: '#FFF'}}>Continue To Payment</Text>
									</View>
								</TouchableHighlight>
								<TouchableHighlight>
									<View style={[styles.requestButton, styles.buttonSecondary]}>
										<Text style={{color: '#FFF'}}>Continue To Payment</Text>
									</View>
								</TouchableHighlight>
							</View>
						</View>

					)
				})
			)
		}
		// return(
		// 	<View>
		// 		<View style={styles.requestItemWrapper}>
		// 			<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
		// 			<View style={styles.requestItemSiteWrapper}>
		// 				<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
		// 				</Image>
		// 				<View style={styles.requestItemDescWrapper}>
		// 					<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
		// 					<Text style={[styleVar.fontGothic]}>Address Line</Text>
		// 					<Text style={[styleVar.fontGothic]}>From 2016-10-25 To 2016-10-29</Text>
		// 					<Text style={[styleVar.fontGothic]}>Total Price : $ 200.00</Text>
		// 				</View>
		// 			</View>
		// 			<View style={styles.requestItemActionButton}>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonPrimary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonSecondary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 			</View>
		// 		</View>
		// 		<View style={styles.requestItemWrapper}>
		// 			<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
		// 			<View style={styles.requestItemSiteWrapper}>
		// 				<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
		// 				</Image>
		// 				<View style={styles.requestItemDescWrapper}>
		// 					<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
		// 					<Text style={[styleVar.fontGothic]}>Address Line</Text>
		// 					<Text style={[styleVar.fontGothic]}>From 2016-10-25 To 2016-10-29</Text>
		// 					<Text style={[styleVar.fontGothic]}>Total Price : $ 200.00</Text>
		// 				</View>
		// 			</View>
		// 			<View style={styles.requestItemActionButton}>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonPrimary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonSecondary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 			</View>
		// 		</View>
		// 		<View style={styles.requestItemWrapper}>
		// 			<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
		// 			<View style={styles.requestItemSiteWrapper}>
		// 				<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
		// 				</Image>
		// 				<View style={styles.requestItemDescWrapper}>
		// 					<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
		// 					<Text style={[styleVar.fontGothic]}>Address Line</Text>
		// 					<Text style={[styleVar.fontGothic]}>From 2016-10-25 To 2016-10-29</Text>
		// 					<Text style={[styleVar.fontGothic]}>Total Price : $ 200.00</Text>
		// 				</View>
		// 			</View>
		// 			<View style={styles.requestItemActionButton}>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonPrimary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonSecondary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 			</View>
		// 		</View>
		// 		<View style={styles.requestItemWrapper}>
		// 			<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
		// 			<View style={styles.requestItemSiteWrapper}>
		// 				<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
		// 				</Image>
		// 				<View style={styles.requestItemDescWrapper}>
		// 					<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
		// 					<Text style={[styleVar.fontGothic]}>Address Line</Text>
		// 					<Text style={[styleVar.fontGothic]}>From 2016-10-25 To 2016-10-29</Text>
		// 					<Text style={[styleVar.fontGothic]}>Total Price : $ 200.00</Text>
		// 				</View>
		// 			</View>
		// 			<View style={styles.requestItemActionButton}>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonPrimary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonSecondary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 			</View>
		// 		</View>
		// 		<View style={styles.requestItemWrapper}>
		// 			<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
		// 			<View style={styles.requestItemSiteWrapper}>
		// 				<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
		// 				</Image>
		// 				<View style={styles.requestItemDescWrapper}>
		// 					<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
		// 					<Text style={[styleVar.fontGothic]}>Address Line</Text>
		// 					<Text style={[styleVar.fontGothic]}>From 2016-10-25 To 2016-10-29</Text>
		// 					<Text style={[styleVar.fontGothic]}>Total Price : $ 200.00</Text>
		// 				</View>
		// 			</View>
		// 			<View style={styles.requestItemActionButton}>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonPrimary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 				<TouchableHighlight>
		// 					<View style={[styles.requestButton, styles.buttonSecondary]}>
		// 						<Text style={{color: '#FFF'}}>Continue To Payment</Text>
		// 					</View>
		// 				</TouchableHighlight>
		// 			</View>
		// 		</View>
				
		// 	</View>
		// )
	}

	handleChangeTab({i, ref, from}){
		// console.log('tab',i);

		switch(i){
			case 0 :
				console.log('do this for number 0 tab');
				break;
			// default : 
			// 	console.log('this is default page');
		};
		// switch(i){
		// 	case 2 :
		// 		closureFormArr = this.state.closureFormArr;
		// 	break;
		// }
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
							tabLabel="SUBMITTED"
							key={0}
							style={styles.scrollbarView}
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							
							{this.renderSubmittedRequest(this.state.requestData)}

						</ScrollView>

						<ScrollView
							tabLabel="APPROVE"
							key={1}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							{this.preloadSave(this.state.preloadRequest)}
							<View>
								<Text>Ini Accepted</Text>
							</View>
						</ScrollView>
						<ScrollView
							tabLabel="DECLINED"
							key={2}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							<View>
								<Text>Ini Accepted</Text>
							</View>
						</ScrollView>
						<ScrollView
							tabLabel="PAID"
							key={3}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							<View>
								<Text>Ini Accepted</Text>
							</View>
						</ScrollView>
						<ScrollView
							tabLabel="ACCEPTED FOR FREE"
							key={4}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							<View>
								<Text>Ini Accepted</Text>
							</View>
						</ScrollView>
						<ScrollView
							tabLabel="CANCELLED - BY VISITOR"
							key={5}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							<View>
								<Text>Ini Accepted</Text>
							</View>
						</ScrollView>
						<ScrollView
							tabLabel="CANCELLED - BY OWNER"
							key={6}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							<View>
								<Text>Ini Accepted</Text>
							</View>
						</ScrollView>
						<ScrollView
							tabLabel="CANCELLED - BY SYSTEM"
							key={7}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

							<View>
								<Text>Ini Accepted</Text>
							</View>
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