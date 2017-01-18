import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	Dimensions,
	Modal,
	ActivityIndicator,
	StyleSheet
} from 'react-native';

import styleVar from '../styleVar';
let screenWidth = Dimensions.get('window').width;

class ModalLoading extends Component{
	constructor(props) {
		super(props);
	
		this.state = {
			showModal : false
	  	};
	}

	componentDidMount(){
		this.setState({
			showModal : this.props.viewModal,	
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			showModal : nextProps.viewModal
		})
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
							<ActivityIndicator
						        animating={true}
						        style={{height: 50}}
						        size="large"
						        color={styleVar.colors.primary}
						    />
						    <Text style={{color : '#000'}}>Loading...</Text>
						</View>
					</View>
				</Modal>
			</View>
			
		)
	}
};

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
		padding: 10,
		elevation : 8
	}
});

module.exports = ModalLoading;