import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	Dimensions,
	Modal,
	TouchableHighlight,
	ListView,
	ScrollView
} from 'react-native';

import styles from '../style/modalSelectStyle'

let screenWidth = Dimensions.get('window').width;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ModalSelect extends Component{
	constructor(props) {
		super(props);
	
		this.state = {
			showModal : false,
		  	dataSource: ds.cloneWithRows([]),
		};
	}

	componentDidMount(){
		this.setState({
			showModal : this.props.viewModal,
			
		})

		// console.log(this.state.dataSource)
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			showModal : nextProps.viewModal,
			dataSource : this.state.dataSource.cloneWithRows(this.props.data)
		})
	}

	close(){
		this.setState({
			showModal : false
		})
	}

	chooseData(data){
		this.close();
		this.props.onDataChoose(data);
	}

	renderDataList(){
		return(
			<ListView
				dataSource={this.state.dataSource}
				enableEmptySections={true}
				renderRow={(rowData) =>
					<TouchableHighlight onPress={ () => this.chooseData(rowData)}>
						<View style={styles.listItem}>
							<Text>{rowData.Description}</Text>
						</View>
					</TouchableHighlight>
				}/>
		)
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
					<View style={styles.modalBackground}>
						<View style={styles.modalContentContainer}>
							<ScrollView>
								{this.renderDataList()}
							</ScrollView>
						</View>

						<View style={styles.modalContentContainer}>
							<TouchableHighlight onPress={() => {this.close()}}>
								<View style={styles.listItemCancel}>
									<Text>Cancel</Text>
								</View>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

module.exports = ModalSelect;