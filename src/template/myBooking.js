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
  ScrollView
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

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

class MyBooking extends Component{

	constructor(props) {
		super(props);
	
	  	this.state = {
	  		renderPlaceholderOnly : true
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
			this.setState({renderPlaceholderOnly : false})
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

	renderItem(){
		return(
			<View>
				<View style={styles.requestItemWrapper}>
					<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
					<View style={styles.requestItemSiteWrapper}>
						<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
						</Image>
						<View style={styles.requestItemDescWrapper}>
							<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
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
				<View style={styles.requestItemWrapper}>
					<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
					<View style={styles.requestItemSiteWrapper}>
						<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
						</Image>
						<View style={styles.requestItemDescWrapper}>
							<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
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
				<View style={styles.requestItemWrapper}>
					<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
					<View style={styles.requestItemSiteWrapper}>
						<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
						</Image>
						<View style={styles.requestItemDescWrapper}>
							<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
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
				<View style={styles.requestItemWrapper}>
					<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
					<View style={styles.requestItemSiteWrapper}>
						<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
						</Image>
						<View style={styles.requestItemDescWrapper}>
							<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
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
				<View style={styles.requestItemWrapper}>
					<Text style={[styles.requestItemName, styleVar.fontGothic]}>Fakhri Syahab</Text>
					<View style={styles.requestItemSiteWrapper}>
						<Image source={{uri : 'http://travellers.azurewebsites.net/Content/Images/143.jpg'}} style={{height : 100, width : 100}}> 
						</Image>
						<View style={styles.requestItemDescWrapper}>
							<Text style={[styles.itemDescTitle, styleVar.fontGothic]}>Broadway Street</Text>
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
				
			</View>
		)
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
					>
						<ScrollView
							tabLabel="SUBMITTED"
							key={0}
							style={styles.scrollbarView}
							showsVerticalScrollIndicator={true}>
							
							{this.renderItem()}

						</ScrollView>

						<ScrollView
							tabLabel="ACCEPTED"
							key={1}
							style={styles.scrollbarView}	
							showsVerticalScrollIndicator={true}>

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
							tabLabel="CANCELLED"
							key={5}
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