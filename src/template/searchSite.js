	import React, {Component, PropTypes} from 'react';
	import {
		View,
		StyleSheet,
		Text,
		ActivityIndicator,
		ScrollView,
		ListView,
		Dimensions,
		Image,
		RefreshControl,
		InteractionManager,
		TouchableWithoutFeedback,
		Navigator
	} from 'react-native';

	import Icon from 'react-native-vector-icons/MaterialIcons';
	import ScrollTabView,  {DefaultTabBar} from 'react-native-scrollable-tab-view';
	import MapView from 'react-native-maps';
	import styleVar from '../styleVar';
	import AccessToken from '../accessToken';

	const propTypes = {
	  toRoute: PropTypes.func.isRequired,
	  toBack : PropTypes.func.isRequired
	}
	const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

	var {width, height} = Dimensions.get('window');

	class SearchSite extends Component{
		constructor(props) {
		  super(props);
		
		  this.state = {
		  	renderPlaceholderOnly : true,
		  	preloadShow:true,
		  	progressAnimate : true,
		  	searchAddress : this.props.data.address,
		  	searchGeometry : this.props.data.geometry,
		  	arrivalDate : this.props.data.arrivalDate,
		  	departureDate : this.props.data.departureDate,
		  	// searchGeometry : {
		  	// 	location : {
		  	// 		lng : '144.74083300000007',
		  	// 		lat : '-38.338889'
		  	// 	}
		  	// },
		  	// arrivalDate : '2016-11-25',
		  	// departureDate : '2016-11-29',
		  	dataSource: ds.cloneWithRows([]),
		  	propertyData : [],
		  	propertyRow : 0,
		  	propertyCount : 0,
		  	offsetSearch : 0,
		  	limitSearch : 10,
		  	loadStatus : false,
		  	refreshing : false,
		  	mapMarker : []
		  };

		  this.getSiteData = this.getSiteData.bind(this);

		}

		backHome(){
			this.props.toBack();
		}

		getSiteData(){
			this.setState({
				loadStatus : true
			})
			var request = new Request('http://travellers.azurewebsites.net/api/properties/search',{
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json',
				},
				body: JSON.stringify({
					VehicleID : 0,
					Longitude : this.state.searchGeometry.location.lng,
					Latitude : this.state.searchGeometry.location.lat,
					FromDate : this.state.arrivalDate,
					ToDate : this.state.departureDate,
					Offset : this.state.propertyRow,
					Limit : this.state.limitSearch
				})
			})

			fetch(request)
				.then((response) => {
					return response.json();
					// this.setState({
					// 	propertyData : this.state.propertyData.concat(JSON.parse(response._bodyInit).Properties),
					// 	propertyRow : parseInt(JSON.parse(response._bodyInit).Properties.length + this.state.propertyRow),
					// 	propertyCount : JSON.parse(response._bodyInit).Length,
					// 	dataSource : this.state.dataSource.cloneWithRows(this.state.propertyData.concat(JSON.parse(response._bodyInit).Properties)),
					// 	preloadShow : false,
					// 	offsetSearch : JSON.parse(response._bodyInit).Properties.length,
					// 	loadStatus:false,
					// 	refreshing : false,
					// 	mapMarker : this.state.mapMarker.concat(JSON.parse(response._bodyInit).Properties)
					// })

					//console.log(JSON.parse(response._bodyInit).Properties)
					//console.log('sukses')
				})
				.then((response) => {
					// console.log(response.Data)
					this.setState({
						propertyData : this.state.propertyData.concat(response.Data.Properties),
						propertyRow : parseInt(response.Data.Properties.length + this.state.propertyRow),
						propertyCount : response.Data.Length,
						dataSource : this.state.dataSource.cloneWithRows(this.state.propertyData.concat(response.Data.Properties)),
						preloadShow : false,
						offsetSearch : response.Data.Properties.length,
						loadStatus:false,
						refreshing : false,
						mapMarker : this.state.mapMarker.concat(response.Data.Properties),
						mapRegion : {
							latitude : response.Data.Properties[0].Latitude,
							longitude : response.Data.Properties[0].Longitude,
							latitudeDelta : 0.2,
							longitudeDelta : 0.2
						}
					})
					// console.log('after success : '+this.state.propertyRow)
				})
				.catch((error) => {
					console.log(error)
					this.setState({
						loadStatus : false,
						refreshing : false
					})
					alert("We cannot retrieve data, check your internet connection")
				})
		}

		componentDidMount(){
			InteractionManager.runAfterInteractions(() => {
				this.setState({
					renderPlaceholderOnly: false
				});
				if(this.state.loadStatus == false){
					this.getSiteData();
				}
			});
		}

		setMapMarker(){
			// console.log('do create marker')
			return this.state.propertyData.map((data) =>{
				return(
					<MapView.Marker 
						ref={data.ID}
						key={data.ID}
						coordinate={{latitude: data.Latitude,longitude: data.Longitude,latitudeDelta: 0, longitudeDelta: 0}} image={require('image!map_marker')}
						calloutOffset={{ x: -8, y: 28 }}
	            		calloutAnchor={{ x: 0.5, y: 0.4 }}>
						<MapView.Callout style={styles.calloutWrapper}
							onPress={() => this.goToDetail(data.ID)}>
							<View style={styles.calloutContent}>
								<Image 
			          			source={{uri : (data.PropertyPictures.length == 0) ? 'https://maps.googleapis.com/maps/api/streetview?size=100x80&location='+data.Latitude+','+data.Longitude+'&key=AIzaSyCyAzhSGNjz0VMDgLM1mJNajs7owgIa0Uk' : 'http://travellers.azurewebsites.net/'+data.PropertyPictures[0].Path}}
			          			style={styles.siteListImageCallout}/>
			          			<View style={{flex:1}}>
									<Text style={{flex:1,fontWeight:'bold', fontFamily : 'gothic'}}>{data.AddressLine1}</Text>
									<Text style={{flex:1}}>$ {data.DefaultRate}.00</Text>
									<View 
										style={{flex:1,width:90,backgroundColor:styleVar.colors.secondary,alignItems:'center',justifyContent:'center'}}>
										<Text style={{color:'#FFF', fontFamily : 'gothic'}}>See Detail</Text>
									</View>
								</View>
							</View>
						</MapView.Callout>
					</MapView.Marker>
				)
			})
			
		}

		goToDetail(id){
	    	var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
	    	sceneConfig.gestures.pop.disabled = true;

			this.props.toRoute({
				name : 'detail site',
				component : require('./detailSite'),
				data : {
					siteId : id,
					FromDate : this.state.arrivalDate,
					ToDate : this.state.departureDate
				},
	    		sceneConfig : sceneConfig
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

		preloadContent(){
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
				<View style={[styles.siteListWrapper]}>
					{this.loadSiteList.bind(this)()}
				</View>
			)
		}

		loadSiteList(){

			return (
				<ListView
		          	dataSource={this.state.dataSource}
		          	enableEmptySections={true}
		          	renderRow={(rowData) => 
			          	<TouchableWithoutFeedback
			          		onPress={() => this.viewOnMap(rowData)}>
				          	<View style={[styles.siteListRow]}>
				          		<Image 
				          			source={{uri : (rowData.PropertyPictures.length == 0 ) ? 'https://maps.googleapis.com/maps/api/streetview?size='+width+'x120&location='+rowData.Latitude+','+rowData.Longitude+'&key=AIzaSyCyAzhSGNjz0VMDgLM1mJNajs7owgIa0Uk' : 'http://travellers.azurewebsites.net/'+rowData.PropertyPictures[0].Path}}
				          			style={styles.siteListImage}/>
				          		<View style={styles.siteListContent}>
					          		<Text style={styles.siteListContentTitle}>{rowData.AddressLine1}</Text>
					          		<Text style={styles.siteListContentSubtitle}>{rowData.City}, {rowData.State} {rowData.PostalCode}</Text>
				          		</View>
				          	</View>
			          	</TouchableWithoutFeedback>}/>
			)
		}

		viewOnMap(data){
			var {coordinate} = this.state
			this.setState({
				initialTab:1,
				mapRegion : {
					latitude : data.Latitude,
					longitude : data.Longitude,
					latitudeDelta : 0.0005,
					longitudeDelta : 0.0005
				}
			})
			// console.log(data)
		}

		handleScroll(event: Object){
			var offset = event.nativeEvent.contentOffset.y * 2;
			var elmHeight = event.nativeEvent.contentSize.height;

			if(offset >= elmHeight && this.state.loadStatus == false && this.state.propertyRow < this.state.propertyCount) {
				this.getSiteData();
				//console.log(this)
			}
			// console.log(event.nativeEvent.contentOffset.y);
			//console.log(event.nativeEvent);

		}

		loadingContent(){
			if(this.state.propertyRow > 0 && this.state.propertyRow < this.state.propertyCount){
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
			}
		}

		_onRefresh() {
			this.setState({
				dataSource: ds.cloneWithRows([]),
			  	propertyData : [],
			  	propertyRow : 0,
			  	refreshing: true
			})

			setTimeout(() => {
				this.getSiteData();
			},1000)
			
			// this.getSiteData();
		}

		onMapPress(e){
			// console.log(e.nativeEvent.coordinate)
		}

		render(){
			if (this.state.renderPlaceholderOnly) {
		    	return this.preload();
		    }

			return(
				<View style={styles.containerHome}>
					<View style={styles.headerModal}>
						<Icon name='arrow-back' size={30} color="#FFF" onPress={() => this.backHome()}></Icon>
						<Text style={[{color: '#FFF', fontFamily : 'gothic'}]}>Search Result</Text>
						<Icon name='search' size={30} color="#FFF"></Icon>
					</View>
					<ScrollTabView
						style={styles.scrollbarWrapper}
	      				renderTabBar={() => <DefaultTabBar />}
	      				tabBarUnderlineColor={styleVar.colors.secondary}
	      				tabBarActiveTextColor={styleVar.colors.secondary}
	      				tabBarInactiveTextColor="#999"
	      				page={this.state.initialTab}
	      				prerenderingSiblingsNumber={1}
	      				tabBarTextStyle={{fontFamily: 'gothic', fontSize: 15}}
	      				locked={true}
	      			>
	      				<ScrollView 
	      					style={[styles.scrollbarTitle]} 
	      					tabLabel='Site List'
	      					key={0}
	      					ref="siteWrapper"
	      					showsVerticalScrollIndicator={true}
	      					onScroll={this.handleScroll.bind(this)}
				          	refreshControl={
					          <RefreshControl
					            refreshing={this.state.refreshing}
					            enableEmptySections={true}
					            colors={['#FFF']}
					            progressBackgroundColor={styleVar.colors.primary}
					            onRefresh={this._onRefresh.bind(this)}/>
					        }
	      					pagingEnabled={true}>
	      					{this.preloadContent()}

	      					{this.loadingContent()}
	      				</ScrollView>
						<ScrollView 
							style={[styles.scrollbarTitle]} 
							tabLabel='Map'
							key={1}
							ref="mapWrapper">
							<MapView
								ref="maps"
								style={[styles.map]}
								followUserLocation = {false}
								showsUserLocation = {false}
								onPress={this.onMapPress}
								region={this.state.mapRegion}
							>
								{this.setMapMarker()}
							</MapView>
						</ScrollView>
					</ScrollTabView>
				
				</View>
			)
		}
	}

	const styles = StyleSheet.create({
		containerHome : {
			flex: 1,
			backgroundColor : '#FFFFFF'
		},
		headerModal : {
			flexDirection: 'row',
			justifyContent : 'space-between',
			alignItems : 'center',
			height : 60,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			paddingLeft : 10,
			paddingRight : 20,
			backgroundColor : styleVar.colors.primary
		},
		containerContent : {
			flex:1,
			bottom:0,
			top:0,
			backgroundColor : styleVar.colors.greySecondary
		},
		centering: {
		    alignItems: 'center',
		    justifyContent: 'center',
		    padding: 8,
		},
		scrollbarWrapper : {
			backgroundColor : '#FFF'
		},
		scrollbarTitle : {
			backgroundColor : styleVar.colors.greySecondary,
			flex : 0.5
		},
		paddingAll : {
			paddingLeft : 10,
			paddingRight : 10,
			paddingTop : 10,
			paddingBottom : 10
		},
		siteListWrapper : {
			flex : 1,
			flexDirection : 'row',
			alignItems : 'flex-start'
		},
		siteListRow : {
			elevation : 5,
			flex:1,
			marginBottom : 5,
			flexDirection : 'row',
			justifyContent : 'space-between',
			alignItems : 'center',
			backgroundColor: '#000',
			borderWidth:1,
			borderStyle: 'solid',
			borderColor : styleVar.colors.greyPrimary
		},
		map : {
			flex : 1,
			backgroundColor : 'red',
			position : 'relative',
			top:0,
			left:0,
			right:0,
			bottom:0,
			width : width,
			height : height
		},
		siteListContent : {
			position : 'absolute',
			backgroundColor : 'rgba(0,0,0,0.8)',
			bottom : 10,
			left : 0,
			paddingVertical : 5,
			paddingHorizontal : 5
		},
		siteListContentTitle : {
			fontWeight:'bold', 
			color:styleVar.colors.secondary, 
			fontFamily : 'gothic'
		},
		siteListContentSubtitle : {
			fontSize : 12, 
			color:'#FFF', 
			fontFamily : 'gothic'
		},
		siteListImage : {
			height : 150,
			width : width,
			backgroundColor : '#CCC',
		},
		siteListImageCallout : {
			height : 80,
	      	width : 100,
	      	marginRight : 10,
	      	backgroundColor : '#CCC'
		},
		loadingContentWrapper : {
			height : 80,
			alignItems : 'center',
			justifyContent : 'center',
			left:0,
			right:0,
			backgroundColor : '#FFF'
		},
		calloutWrapper : {
			width : 300,
			height : 90,
			paddingTop : 5,
			paddingBottom:5,
			paddingLeft:5,
			paddingRight:5
		},
		calloutContent : {
			flex:1,
			flexDirection : 'row',
			justifyContent : 'space-between',
		}
	})


	SearchSite.PropTypes = PropTypes;

	module.exports = SearchSite;