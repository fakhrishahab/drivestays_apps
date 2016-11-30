import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	ListView,
	Image,
	View,
	TouchableHighlight,
	Navigator,
	InteractionManager,
	ActivityIndicator,
	ScrollView,
	AsyncStorage
} from 'react-native';
import MapView from 'react-native-maps';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';
import styles from '../style/notificationStyle';
import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import styleVar from '../styleVar';
import AccessToken from '../accessToken';
import CONSTANT from '../constantVar';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Notification extends Component{

	constructor(props) {
		super(props);
	
	  	this.state = {
	  		renderPlaceholderOnly : true,
	  		limit : 10,
	  		offset : 0,
	  		dataSource: ds.cloneWithRows([]),
	  		access_token : '',
		  	progressAnimate : true,
		  	preloadShow : true,
		  	loadMoreShow : false,
		  	messageData : [],
		  	totalMessage : 0,
		  	viewedMessage : 0,
		  	loadStatus : true
	  	};
	  	this.onNextPage = this.onNextPage.bind(this);

	  	this._getMessageData = this._getMessageData.bind(this);
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

    componentWillMount(){

    }

    componentDidMount(){
    	InteractionManager.runAfterInteractions(()=>{
    		this.setState({
    			renderPlaceholderOnly : false,
    		})

    	})

    	AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
    		// console.log(value)
    		this.setState({
    			access_token : value
    		})
    		
    		this._getMessageData();
    	})
    }

    _getMessageData(){
    	// console.log('offset',this.state.viewedMessage)
    	this.setState({
    		loadStatus : true
    	})
    	var request = new Request(CONSTANT.API_URL+'messagethreads/notification?offset='+this.state.viewedMessage+'&limit='+this.state.limit, {
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
    			this.setState({
    				preloadShow : false,
    				messageData : response.Data.MessageThreads,
    				dataSource : this.state.dataSource.cloneWithRows(this.state.messageData.concat(response.Data.MessageThreads)),
    				totalMessage : response.Data.Total,
    				viewedMessage : parseInt(this.state.viewedMessage + response.Data.MessageThreads.length),
    				loadMoreShow : true,
		  			loadStatus : false
    			})

    			// console.log(this.state.messageData)
    		})
    		.catch((err) => {
    			console.log('error',err);
    			this.setState({
    				preloadShow : false
    			})
    			alert("We cannot retrieve data, check your internet connection");
    		})
    }

    preload(){
    	if(this.state.preloadShow){
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
    	}else{
    		return this.initialContent.bind(this)();
    	}
		
	}

	initialContent(){
		return(
			<ScrollView>
				{this.renderMessageList.bind(this)()}
			</ScrollView>
		)
	}

	viewList(rowData){
		if(rowData.FromUserID != 0){
			return(
				<View style={ (rowData.DateRead==null) ? [styles.listWrapper, {backgroundColor : '#FFF'}] : [styles.listWrapper, {backgroundColor : styleVar.colors.greySecondary}]}>
					<Image source={require('image!mail')} style={styles.notifImage}/>
					<View style={styles.listDesc}>
						<Text style={styles.textFrom}>Message From {rowData.FromUser}</Text> 
						<Text style={styles.textMessage}>{this._limitWords(rowData.Message, 7)}</Text>
					</View>
				</View>
			)
		}else{
			return(
				<View style={ (rowData.DateRead==null) ? [styles.listWrapper, {backgroundColor : '#FFF'}] : [styles.listWrapper, {backgroundColor : styleVar.colors.greySecondary}]}>
					<Image source={require('image!notification')} style={styles.notifImage}/>
					<View style={styles.listDesc}>
						<Text style={styles.textFrom}>System Message</Text>
						<Text style={styles.textMessage}>{this._limitWords(rowData.Message, 7)}</Text>
					</View>
				</View>
			)
		}
	}

	renderMessageList(){
    	return(
    		<ListView
	          	dataSource={this.state.dataSource}
	          	enableEmptySections={true}
	          	renderRow={(rowData) => 
		    		<TouchableHighlight underlayColor={styleVar.colors.greySecondary} onPress={() => this.messageClick(rowData)}>
		    				{this.viewList(rowData)}
						
					</TouchableHighlight>}/>
    	)
    }

	_onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

    _limitWords(text, length){
    	if (text != null) {
            var words = text.split(/\b[\s,\.-:;]*/);

            if (words.length > length) {
                words.splice(length);
                return words.join(" ")+' ...';
            } else {
                return words.join(" ");
            }
        } else {
            return text;
        }
    }

    messageClick(param){
    	console.log(param)

    	var sceneConfig = Navigator.SceneConfigs.FloatFromRight;
    	sceneConfig.gestures.pop.disabled = true;
    	// console.log(param)
    	this.props.toRoute({
			name : 'messageThread',
			component : require('./messageThread'),
			data : {
				MessageID : param.MessageID,
				CustomerFirstName : param.FromUser,
				CustomerImage : param.UserImagePath
			},
    		sceneConfig : sceneConfig
		})  
    }

    loadMore(){
    	if(this.state.loadMoreShow && this.state.viewedMessage < this.state.totalMessage){
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
    		return(null)
    	}
    }

    handleScroll(event: Object){
			var offset = event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height;
			var elmHeight = event.nativeEvent.contentSize.height;

			// console.log(offset, elmHeight)
			if(offset >= elmHeight && this.state.loadStatus == false && this.state.viewedMessage < this.state.totalMessage) {
				console.log('this')
				this._getMessageData();
			}
			// console.log(event.nativeEvent.contentOffset.y);
			//console.log(event.nativeEvent);

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
			    	<HeaderContent onPress={() => this.toggle()} title="Notification" icon="search"/>
			    	<View style={styles.containerContent}>
						<ScrollView
	      					onScroll={this.handleScroll.bind(this)}>
								{this.preload()}
								{this.loadMore()}
						</ScrollView>
			    	</View>

			    </View>
			</DrawerLayout>
		)
	}
}

module.exports = Notification;