 import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Image,
  View,
  TouchableHighlight,
  ScrollView,
  InteractionManager,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  Modal,
  Navigator
} from 'react-native';
import MapView from 'react-native-maps';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';

import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import AccessToken from '../accessToken';
import styles from '../style/mySiteStyle';
import styleVar from '../styleVar';
import CONSTANT from '../constantVar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'underscore';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let dataSiteArr = [];

class MySite extends Component{

	constructor(props) {
		super(props);
	
		this.state = {
	  		renderPlaceholderOnly : true,
	  		access_token : '',
	  		dataSource : ds.cloneWithRows([]),
	  		siteData : [],
	  		preloadShow : true,
	  		totalSite : 0,
	  		modalVisible : false
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

    componentDidMount(){
    	InteractionManager.runAfterInteractions(()=>{
			this.setState({renderPlaceholderOnly : false})
		})	

    	AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
    		this.setState({
    			access_token : value
    		})

    		this._getSiteData();
    	})
    }

	_onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

    _getSiteData(){
    	var request = new Request(CONSTANT.API_URL+'properties/get', {
    		method : 'GET',
    		headers : {
    			'Content-Type' : 'application/json',
    			'Authorization' : this.state.access_token
    		}
    	})

    	fetch(request)
    		.then((response) => {
    			return response.json()
    		})
    		.then((response) => {
    			console.log(response)
    			response.Data.map((key) => {
    				dataSiteArr.push(key)
    			});


    			this.setState({
    				preloadShow : false,
    				dataSource : this.state.dataSource.cloneWithRows(_.sortBy(dataSiteArr, 'ID')),
    				totalSite : response.Data.length
    			})
    		})
    		.catch((err) => {
    			console.log('error', err);
    			alert("We got some problem to showing the data");
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

    _renderSiteList(){
    	if(this.state.preloadShow){
			return(
    			<View style={styles.loadingContentWrapper}>
					<ActivityIndicator
				        animating={this.state.progressAnimate}
				        style={[styles.centering, {height: 100}]}
				        size="large"
				        color={styleVar.colors.primary}
				    />
				</View>
    		)
		}else{
			return(
				<ListView
					dataSource={this.state.dataSource}
					enableEmptySections={true}
					renderRow={(rowData) => 
						<View>
							{this.renderSiteList(rowData)}
						</View>
					 }/>
			)
		}
    }

	renderSiteList(data){
		return(
			<TouchableHighlight onPress={ () => this.openSiteForm(data)}>
				<View style={styles.requestItemWrapper}>
					{
						(data.PropertyPictures.length >= 1) ?

						<Image source={{ uri : CONSTANT.WEB_URL+data.PropertyPictures[0].Path }} style={styles.requestImage}/>

						:

						<Image source={require('image!site_notfound')} style={styles.requestImage}/>	
					}
					
					<View style={styles.requestDescWrapper}>
						<View style={styles.requestDescText}>
							<Text style={styles.requestDescBrand}>{data.AddressLine1}</Text>
							<Text style={styles.requestDescYear}>{data.City}</Text>
						</View>
						<View style={styles.iconWrapper}>
							<Icon name="star" size={30} color="#FFF" onPress={ ()=> this.setDefault(data.ID)}/>
							<Icon name="delete" size={30} color="#FFF" onPress={ ()=> this.deleteSite(data.ID)}/>
						</View>
					</View>
		    	</View>
	    	</TouchableHighlight>
		)
	}

	openSiteForm(){

	}

	setDefault(){

	}

	deleteSite(){

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
			    	<HeaderContent onPress={() => this.toggle()} title="My Site" icon="search"/>
			    	<ScrollView style={{backgroundColor : styleVar.colors.greySecondary}}>
			    		{this._renderSiteList()}
			    		
			    	</ScrollView>
			    </View>
			</DrawerLayout>
		)
	}
}

// const styles = StyleSheet.create({
// 	containerHome : {
// 		flex: 1,
// 		zIndex : 0,
// 		backgroundColor : '#FFFFFF'
// 	},
// 	containerContent : {
// 		flex : 1,
// 		backgroundColor : '#CCC'
// 	}
// })

module.exports = MySite;