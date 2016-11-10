import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	StyleSheet,
  	TextInput,
  	ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import styleVar from '../styleVar';
 
class ModalSearchAddress extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	placeChanged(details){
		this.setState({
			placeAddress : details.formatted_address,
			placeGeometry : details.geometry
		})
	}

	iconDone(){
		if(this.state.placeAddress){
			return(
				<Icon name='done' size={30} color="#FFF" onPress={() => this.props.onPlaceChange(this.state)}/>
			)
		}
	}

	render(){
		return(
			<View style={styles.containerModal}>
				<View style={styles.headerModal}>
					<Icon name='arrow-back' size={30} color="#FFF" onPress={this.props.onCloseModal}></Icon>
					{this.iconDone()}
				</View>
				<View style={styles.containerTextInput}>
					<GooglePlacesAutocomplete
						ref="placeAutocomplete"
						placeholder="Search Location"
						minLength={2}
						autoFocus={true}
						fetchDetails={true}
						onPress={(data, details=null) =>{
							this.placeChanged(details)
							console.log(details)
						}}
						onChange={(e) => {
							console.log(e)
							this.setState({
								placeValue : e.target.value
							})
						}}
						getDefaultValue={(e)=>{
							// console.log(e)
							return ''
						}}
						query={{
							key : 'AIzaSyCyAzhSGNjz0VMDgLM1mJNajs7owgIa0Uk',
							language : 'en'
						}}
						styles={{
							description:{
								
							},
							predefinedPlacesDescription:{
								color : '#999'
							}
						}}
						currentLocation={false}
						currentLocationLabel="Current Location"
						nearbyPlacesAPI='GoogleReverseGeocoding'
						GoogleReverseGeocodingQuery={{}}
						GooglePlacesSearchQuery={{
							rankby: 'keyword'
						}}
						filterReverseGeocodingByTypes={['locality', 'postal_code']}
					/>
				</View>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	containerModal : {
		flex:1
	},
	headerModal : {
		flexDirection: 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		height : 60,
		elevation :5,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		paddingLeft : 10,
		paddingRight : 20,
		backgroundColor : styleVar.colors.primary
	},
	containerModalContent : {
		flex:1,
		bottom:0,
		top:0
	},
	containerTextInput : {
		backgroundColor : "#FFF",
		left : 0,
		right : 0,
		flex : 1,
		flexDirection : 'row'
	},
	addressListContainer : {
		flex: 1
	}
})

module.exports = ModalSearchAddress;