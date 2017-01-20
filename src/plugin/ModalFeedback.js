import React , {Component, PropTypes} from 'react';
import {
	View,
	Text,
	Modal,
	Image,
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
	Navigator
} from 'react-native';

import styleVar from '../styleVar';
let screenWidth = Dimensions.get('window').width;
const propTypes = {
  toRoute: PropTypes.func.isRequired
}

class ModalFeedback extends Component{
	constructor(props) {
		super(props);
	
		this.state = {
			showModal : false,
			notificationText : ''
		};
	}

	componentDidMount(){
		this.setState({
			showModal : this.props.viewModal,
			notificationText : this.props.textModal
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			showModal : nextProps.viewModal,
			notificationText : nextProps.textModal
		})
	}

	clickButton(){
		this.props.doClickButton()
		
	}

	render(){
		return(
			<View>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.showModal}
					onRequestClose={() => {console.log('close')}}
				>
					<View style={styles.containerModal}>
						<View style={styles.containerLoading}>
							<Image source={require('image!confirm')} style={{width : screenWidth / 3, height : screenWidth / 3, marginVertical : 10}} />
						    <Text style={[styleVar.size.h4, {color : '#000', textAlign : 'center'}]}>{this.state.notificationText}</Text>
							<TouchableWithoutFeedback onPress={() => this.clickButton()}>
								<View style={styles.buttonSave}>
									<Text style={[styleVar.size.h4, {color : '#FFF'}]}>Go To Booking Page</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

let styles = StyleSheet.create({
	containerModal : {
		position:'absolute',
		flex:1, 
		flexDirection : 'row',
		backgroundColor : 'rgba(0,0,0,0.7)', 
		alignItems :'center', 
		justifyContent:'center', 
		left:0, 
		right:0, 
		top :0, 
		bottom:0, 
		padding : 20,
		zIndex : 4
	},
	containerLoading : {
		flex:1, 
		backgroundColor : '#FFF', 
		borderRadius : 5, 
		alignItems : 'center', 
		justifyContent : 'center',
		padding: 20,
		elevation : 8
	},
	buttonSave : {
		left:0,
		right : 0,
		padding : 15,
		borderRadius : 5,
		marginVertical : 15,
		alignItems : 'center',
		backgroundColor : styleVar.colors.secondary
	},
});

module.exports = ModalFeedback;