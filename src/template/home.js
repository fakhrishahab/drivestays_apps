import React, { Component, PropTypes } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
	TextInput,
	Modal,
	ScrollView,
	DatePickerAndroid,
	TouchableWithoutFeedback,
	Navigator
} from 'react-native';
import MapView from 'react-native-maps';
import Menu from '../component/menu';
import Header from '../component/header';
import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import ModalSearchAddress from '../component/modalSearchAddress';
import TextField from 'react-native-md-textinput';
import styleVar from '../styleVar';

import AuthenticationAction from '../actions/authenticationAction';
import AccessToken from '../accessToken';
import ApiRequest from '../apiRequest';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

class Home extends Component{

	constructor(props) {
		super(props);
		this.onNextPage = this.onNextPage.bind(this);

		this.state = {
			modalVisible : false,
			dateNow : new Date(),
			placeAddress : '',
			geometry : '',
			userData : ''
		};


	}

	toggle(type) {
		this.drawer.openDrawer();
        this.setState({
          isOpen: !this.state.isOpen,
        });
    }

    showNotif(type){
    	console.log('test')
    	this.props.replaceRoute(Routes.link('notification'));
		// var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
	 //    	sceneConfig.gestures.pop.disabled = true;

		// this.props.toRoute({
		// 	name : 'message',
		// 	component : require('./message'),
  //   		sceneConfig : sceneConfig
		// })
    }

    onNextPage = (menu) => {
		this.props.toRoute(Routes.link(menu));
    }

    setModalVisible(visible){
    	this.setState({
    		modalVisible : true
    	})
    }

    closeModal(){
    	this.setState({
    		modalVisible : false
    	})
    }

    onPlaceChange(details){
    	this.setState({
    		modalVisible : false,
    		placeAddress : details.placeAddress,
    		geometry : details.placeGeometry
    	})
    }

    async showPicker(stateKey, options){
		try {
			var newState = {};
			const {action, year, month, day} = await DatePickerAndroid.open(options);
			if (action === DatePickerAndroid.dismissedAction) {
				newState[stateKey + 'Text'] = 'dismissed';
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
			}

			this.setState(newState);
		} catch ({code, message}) {
			//console.warn(`Error in example '${stateKey}': `, message);
		}
    }

    onDateChange(date){
    	//console.log(this.state)
    }

    validateForm(){
    	var status;

    	if(!this.state.placeAddress){
    		alert('Please input the address first')
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.arrivalText){
    		alert('Please input arrival date');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	if(!this.state.departureText){
    		alert('Please input departure date');
    		status = false;
    		return false;
    	}else{
    		status = true
    	}

    	return (true);
    }

    findSite(){
    	var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
    	sceneConfig.gestures.pop.disabled = true;
    	
    	if(this.validateForm()){
	    	this.props.toRoute({
				name : 'search',
				component : require('./searchSite'),
				data : {
					address : this.state.placeAddress,
					geometry : this.state.geometry,
					arrivalDate : this.state.arrivalText,
					departureDate : this.state.departureText
				},
	    		sceneConfig : sceneConfig
			})
    	}    	
    }

    _onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

    showMessage(){
    	this.props.toRoute(Routes.link('message'));
    }
    
	render(){
		const menu = <Menu nextPage={this.onNextPage} logout={this._onLogout}/>;

		return (
			<DrawerLayout
		      drawerWidth={300}
		      ref={(drawer) => { return this.drawer = drawer  }}
		      drawerPosition={DrawerLayout.positions.Left}
		      renderNavigationView={() => menu}>
				<View style={styles.containerHome}>
					<Header onPress={() => this.toggle()} onClick={() => this.showNotif()} onTeken={ () => this.showMessage()}/>
					<MapView
						ref="map"
						style={[styles.map]}
						followUserLocation = {false}
						showsUserLocation = {false}
						zoomEnabled = {false}
						scrollEnabled={false}
					>
					</MapView>

					<View style={styles.searchForm}>
						<Text>{this.state.simpleText}</Text>
						<View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
					      		showsVerticalScrollIndicator={false}>
						        <TextField
						          label={'Address'}
						          highlightColor={styleVar.colors.secondary}
						          keyboardType={'default'}
						          dense={true}
						          ref="address"
						          textColor='#FFF'
						          labelColor='#FFF'
						          editable={false}
						          blurOnSubmit={true}
						          labelStyle={{fontFamily : 'gothic'}}
						          inputStyle={{fontFamily : 'gothic', paddingLeft: 0}}
						          value={this.state.placeAddress}
						          onFocus={() => this.setModalVisible(true)}
						        />
					      	</ScrollView>
					    </View>

					    <View style={styles.inputContainer}>
							<ScrollView style={styles.inputText}
					      		showsVerticalScrollIndicator={false}>
						        <TextField
						          label={'Arrival Date'}
						          highlightColor={styleVar.colors.secondary}
						          keyboardType={'default'}
						          ref="arrivalDate"
						          textColor='#FFF'
						          labelColor='#FFF'
						          dense={true}
						          onFocus={this.showPicker.bind(this, 'arrival', {
						          	date: this.state.dateNow,
						          	minDate : new Date(),
						          	maxDate : this.state.maxDate
						          })}
						          blurOnSubmit={true}
						          labelStyle={{fontFamily : 'gothic'}}
						          inputStyle={{fontFamily : 'gothic', paddingLeft: 0}}
						          onDateChange={this.onDateChange}
						          value={this.state.arrivalText}
						          editable={false}
						        />
					      	</ScrollView>

					      	<ScrollView style={[styles.inputText, {marginLeft : 10}]}
					      		showsVerticalScrollIndicator={false}
					      		>
						        <TextField
						          label={'Departure Date'}
						          highlightColor={styleVar.colors.secondary}
						          keyboardType={'default'}
						          ref="departureDate"
						          textColor='#FFF'
						          labelColor='#FFF'
						          dense={true}
						          labelStyle={{fontFamily : 'gothic'}}
						          inputStyle={{fontFamily : 'gothic', paddingLeft: 0}}
						          onFocus={this.showPicker.bind(this, 'departure', {
						          	minDate : this.state.minDate
						          })}
						          onDateChange={this.onDateChange}
						          value={this.state.departureText}
						        />
					      	</ScrollView>
					    </View>

				        <View style={styles.inputContainer}>
					    	<TouchableWithoutFeedback
					    		onPress={() => this.findSite()}>
					    		<View style={styles.inputButton}>
					    			<Text style={styles.inputButtonText}>Find Site</Text>
					    		</View>
					    	</TouchableWithoutFeedback>
					    </View>
						
					</View>
					
					<Modal
						animationType={"slide"}
						transparent={false}
						visible={this.state.modalVisible}
						onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<ModalSearchAddress 
							onCloseModal={() => this.closeModal()}
							onPlaceChange={(state) => this.onPlaceChange(state)}/>
					</Modal>
				</View>
			</DrawerLayout>
		);
	}
}

const styles = StyleSheet.create({
	containerHome : {
		flex: 1,
		backgroundColor : '#FFF'
	},
	map : {
		flex : 1,
		bottom : 0,
		zIndex : -1,
		position: 'relative'
	},
	searchForm : {
		backgroundColor : 'rgba(0,0,0,0.8)',
		paddingRight : 20,
		paddingLeft : 20,
		paddingBottom : 20,
		flex : 1,
		position : 'absolute',
		alignItems : 'center',
		justifyContent : 'center',
		bottom: 20,
		left :0,
		right: 0,
		marginLeft : 20,
		marginRight : 20,
		marginBottom : 20,
		borderRadius : 5
	},
	inputContainer: {
		flex : 1,
		flexDirection :'row',
		alignItems : 'flex-start',
		justifyContent : 'space-between'
	},
	inputText : {
		flex : 1,
		paddingLeft : 0
	},
	inputButton : {
		flex : 1,
		alignItems : 'center',
		justifyContent : 'center',
		height : 40,
		backgroundColor : styleVar.colors.secondary,
		marginTop : 10
	},
	inputButtonText : {
		fontSize : 14,
		color : '#FFF',
		fontFamily : 'gothic'
	}
})

Home.PropTypes = PropTypes;

module.exports = Home;