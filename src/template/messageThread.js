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
	TextInput,
	AsyncStorage
} from 'react-native';
import MapView from 'react-native-maps';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import styleVar from '../styleVar';
import AccessToken from '../accessToken';
import CONSTANT from '../constantVar';

import styles from '../style/messageThreadStyle';
import _ from 'underscore';
import moment from 'moment';

const propTypes = {
  toRoute: PropTypes.func.isRequired,
  toBack : PropTypes.func.isRequired
}

var dataMessageThread = [];
var messageThreadsArr = [];
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class MessageThread extends Component{

	constructor(props) {
	 	super(props);
	
	  	this.state = {
	  		renderPlaceholderOnly : true,
	  		preloadShow : true,
		  	headerColor : '#FFF',
		  	dataSource: ds.cloneWithRows([]),
		  	messageData : [],
		  	totalMessage : 0,
		  	viewedMessage : 0,
		  	MessageID : this.props.data.MessageID,
			FromUser : this.props.data.CustomerFirstName,
			UserImagePath : this.props.data.CustomerImage,
			// MessageID : 2,
			// FromUser : "Leigh",
			// UserImagePath : "Content/Images/Customers/12.jpg",
			access_token : '',
			limit : 10,
			offset : 0,
			preload : true,
			loadMore : false,
			loadMoreShow : false,
			autoScroll : true,
			messageText : '',
			scrollHeight : 0,
			doAutomaticScroll : false,
			messageThreadsArr : []
	  	};
	  	this.onNextPage = this.onNextPage.bind(this);

	  	this.contentHeight= 0;
  		this.scrollViewHeight= 0;
	}

	toggle() {
		this.drawer.openDrawer();
        this.setState({
          isOpen: !this.state.isOpen,
        });
    }

    backButton(){
		this.props.toBack();
    }

    onNextPage = (menu) => {
		this.props.toRoute(Routes.link(menu));
    }

    componentDidMount(){
    	InteractionManager.runAfterInteractions(()=>{
    		this.setState({renderPlaceholderOnly : false})

    		// const listViewHeight = this.state.height._value
          	// this.refs.messageList.scrollTo({y: 400})
    	})

    	AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
    		this.setState({
    			access_token : value
    		})

    		this._requestMessageThread()
    	})
    }

    preload(status){
    	if(status){
    		return(
				<View>
					<ActivityIndicator
				        animating={this.state.progressAnimate}
				        style={[styles.centering, {height: 100}]}
				        size="large"
				        color={styleVar.colors.primary}
				    />
				</View>
			)
    	}else{
    		return <View></View>
    	}
	}

	_requestMessageThread(loadMore){
		this.setState({
			loadMore : false
		})
		console.log(CONSTANT.API_URL+'messagethreads/get?messageID='+this.state.MessageID+'&offset='+this.state.viewedMessage+'&limit='+this.state.limit)
		var request = new Request(CONSTANT.API_URL+'messagethreads/get?messageID='+this.state.MessageID+'&offset='+this.state.viewedMessage+'&limit='+this.state.limit, {
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
				console.log(response)

				response.Data.MessageThreads.map((key, index) => {
					messageThreadsArr.unshift(key);
				})

				// console.log(messageThreadsArr)

				this.setState({
					messageThreadsArr : messageThreadsArr,
					totalMessage : response.Data.Total,
					viewedMessage : parseInt(this.state.viewedMessage + response.Data.MessageThreads.length),
					preloadShow : false,
					loadMoreShow : false,
				})

				// response.Data.MessageThreads.map((key) => {
				// 	dataMessageThread.push(key)	
				// })
				
				// // console.log(_.sortBy(dataMessageThread, 'DateCreated'))
				// // console.log(response.Data)
				// this.setState({

				// 	messageData : _.sortBy(dataMessageThread, 'DateCreated'),
				// 	dataSource : this.state.dataSource.cloneWithRows(_.sortBy(dataMessageThread, 'DateCreated')),
				// 	totalMessage : response.Data.Length,
				// 	viewedMessage : parseInt(this.state.viewedMessage + response.Data.length),
				// 	preload : false,
				// });

				if(response.Data.Total <= this.state.viewedMessage){
					this.setState({
						loadMore : false,
						loadMoreShow : false
					})
				}else{
					this.setState({
						loadMore : true
					})
				}

				// if(response.Data.Total < this.state.limit || response.Data.length == 0){
				// 	this.setState({
				// 		loadMore : false
				// 	})
				// }else{
				// 	this.setState({
				// 		loadMore : true
				// 	})
				// }
			})
			.catch((err) => {
				console.log('error', err)
			})
	}

	_onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

    viewListMessage(data){
    	// if(data.Self){
    	// 	return(
    	// 		<View style={styles.bubbleRight}>    
			  //       <View style={[styles.messageBubbleRight]}>
			  //         	<Text style={[styles.messageContent, styles.right]}>
			  //           	{data.Text}
			  //         	</Text>
			  //         	<Text style={[styles.messageDate, styles.right]}>
			  //         		{moment.utc(data.DateCreated).format('MMM, DD YYYY H:m:s')}
			  //         	</Text>
			  //       </View>
			  //   </View>
    	// 	)
    	// }else if(data.FromUserID == 0){
    	// 	return(
			  //  	<View style={styles.bubbleCenter}>    
			  //       <View style={styles.messageSystem}>
			  //         	<Text>
			  //           	{data.Text}
			  //         	</Text>
			  //         	<Text>
			  //         		{moment.utc(data.DateCreated).format('MMM, DD YYYY H:m:s')}
			  //         	</Text>
			  //       </View>
			  //   </View>
    	// 	)
    	// }else{
    	// 	return(
			  //  	<View style={styles.bubbleLeft}>    
			  //       <View style={styles.messageBubbleLeft}>
			  //         	<Text style={[styles.messageContent]}>
			  //           	{data.Text}
			  //         	</Text>
			  //         	<Text style={[styles.messageDate]}>
			  //         		{moment.utc(data.DateCreated).format('MMM, DD YYYY H:m:s')}
			  //         	</Text>
			  //       </View>
			  //   </View>
    	// 	)
    	// }
    }


    // _renderMessageList(){
    // 	if(this.state.preload){
    // 		return(
    // 			<View style={styles.loadingContentWrapper}>
				// 	<ActivityIndicator
				//         animating={this.state.progressAnimate}
				//         style={[styles.centering, {height: 100}]}
				//         size="large"
				//         color={styleVar.colors.primary}
				//     />
				// </View>
    // 		)
    // 	}else{
    // 		return(
	   //  		<ListView
	   //  			dataSource={this.state.dataSource}
	   //  			enableEmptySections={true}
	   //  			renderRow={(rowData) => 
	   //  				<View>
	   //  				{this.viewListMessage(rowData)}
	   //  				</View>
	   //  			}/>
	   //  	)
    // 	}
    	
    // }

    _renderMessageList(data){
    	return(
    		data.map((key, index) => {
    			if(key.Self){
					return(
		    			<View style={styles.bubbleRight} key={index}>    
					        <View style={[styles.messageBubbleRight]}>
					          	<Text style={[styles.messageContent, styles.right]}>
					            	{key.Text}
					          	</Text>
					          	<Text style={[styles.messageDate, styles.right]}>
					          		{moment.utc(key.DateCreated).format('MMM, DD YYYY H:m:s')}
					          	</Text>
					        </View>
					    </View>
		    		)
    			}else if(key.FromUserID == 0){
					return(
					   	<View style={styles.bubbleCenter} key={index}>    
					        <View style={styles.messageSystem}>
					          	<Text>
					            	{key.Text}
					          	</Text>
					          	<Text>
					          		{moment.utc(key.DateCreated).format('MMM, DD YYYY H:m:s')}
					          	</Text>
					        </View>
					    </View>
					)
				}else{
		    		return(
					   	<View style={styles.bubbleLeft} key={index}>    
					        <View style={styles.messageBubbleLeft}>
					          	<Text style={[styles.messageContent]}>
					            	{key.Text}
					          	</Text>
					          	<Text style={[styles.messageDate]}>
					          		{moment.utc(key.DateCreated).format('MMM, DD YYYY H:m:s')}
					          	</Text>
					        </View>
					    </View>
		    		)
		    	}
    		})
    	)
    }

    handleScroll(event: Object){
    	// console.log(this.state.loadMore, event.nativeEvent.contentOffset.y)
    	if(this.state.loadMore && event.nativeEvent.contentOffset.y <= 1){
    		this.setState({
    			loadMoreShow : true
    		})
    		// console.log('ok load more');
    		this._requestMessageThread(true)
    	}
    	// console.log(event.nativeEvent)
    }

    scrollBottom(height){
    	this.setState({
    		scrollHeight : height
    	})
    	// console.log(this.state.messageData.length)
    	if(this.state.messageData.length <= 10){
    		this.refs.messageList.scrollTo({y : height})	
    	}else if(this.state.doAutomaticScroll){
    		this.refs.messageList.scrollTo({y : height + 200})	
    		this.setState({
    			doAutomaticScroll : false
    		})
    	}
    	// if(this.state.autoScroll){
    		

    	// }

    	// this.setState({
    	// 		autoScroll : false
    	// 	})
    	
    }

    loadMore(status){
    	if(status){
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
    		return <View></View>
    	}
    }

    sendMessage(){
    	this.refs.messageBox.blur();
    	if(this.state.messageText == ''){
    		alert('Please input your message')
    	}else{
    		this._doSendMessage();
    	}
    	
    }

    _doSendMessage(){
    	var request = new Request(CONSTANT.API_URL+'messagethread/create', {
    		method : 'POST',
    		headers : {
    			'Content-Type' : 'application/json',
    			'Authorization' : this.state.access_token
    		},
    		body : JSON.stringify({
    			MessageID : this.state.MessageID,
    			Text : this.state.messageText
    		})
    	});

    	fetch(request)
    		.then((response) => {
    			return response.json()
    		})
    		.then((response) => {
    			console.log(response)
    // 			dataMessageThread.push(response.Data)

    // 			this.setState({
				// 	messageData : _.sortBy(dataMessageThread, 'DateCreated'),
				// 	dataSource : this.state.dataSource.cloneWithRows(_.sortBy(dataMessageThread, 'DateCreated')),
				// 	doAutomaticScroll : true,
				// 	viewedMessage : parseInt(this.state.viewedMessage + 1),
				// 	messageText : ''
				// })

				this.refs.messageList.scrollTo({y : this.contentHeight + 400})
    		})
    		.catch((err) => {
    			console.log('Error', err);
    			alert("We Cannot retrieve data, check your internet connection");
    		})
    }

	render(){
    	const menu = <Menu nextPage={this.onNextPage} logout={this._onLogout}/>;

    	if (this.state.renderPlaceholderOnly) {
	    	return this.preload();
	    }
		return(
			<View style={styles.containerHome}>
				<View style={[styles.headerModal]}>
					<Icon name='arrow-back' size={30} color={this.state.headerColor} onPress={() => this.backButton()}></Icon>
					<View style={styles.userInfoWrapper}> 
						<Text style={styles.userInfoName}>{this.state.FromUser}</Text>

						{ (this.state.UserImagePath) ? 
							<Image source={{uri : CONSTANT.WEB_URL+this.state.UserImagePath}} style={styles.userInfoImage}/>
							:
							<Image source={require('image!user_upload')} style={styles.userInfoImageNull}/>
						}
						
					</View>
				</View>
				<View>
					<ScrollView style={styles.scrollMessage} 
						ref="messageList"
						onContentSizeChange={(w, h) => {this.contentHeight = h; this.scrollBottom(h)}}
						onScroll={this.handleScroll.bind(this)}>
						{this.preload(this.state.preloadShow)}
						{
							this.loadMore(this.state.loadMoreShow)
						}
						{
							this._renderMessageList(this.state.messageThreadsArr)
						}

					</ScrollView>
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder="Type Your Message Here"
						ref="messageBox"
						onChangeText={(text) => this.setState({messageText : text})}
						value={this.state.messageText}
						style={styles.messageTextInput}/>
					<Icon name='send' size={30} color={styleVar.colors.greyPrimary} onPress={() => this.sendMessage()}></Icon>
				</View>
			</View>
		)
	}
}

module.exports = MessageThread;