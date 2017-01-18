import React, {Component, PropTypes} from 'react';
import {
	View,
	Text,
	InteractionManager,
	ScrollView,
	ActivityIndicator,
	TouchableWithoutFeedback,
	AsyncStorage,
	Dimensions,
	Navigator
} from 'react-native';

import styleVar from '../styleVar';
import styles from '../style/invoiceStyle';
import HeaderContent from '../component/headerContent';
import Routes from '../routes';
import CONSTANT from '../constantVar';

import AccessToken from '../accessToken';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
let screenWidth = Dimensions.get('window').width;

class Invoice extends Component{
	constructor(props) {
		super(props);
	
		this.state = {
			access_token : '',
			renderPlaceholderOnly : true,
			progressAnimate : true,
			preloadSaveInvoice : false,
			// RequestID : this.props.data.RequestID,
			RequestID : 77,
			invoiceData : '',
			invoiceTotalRateSite : 0,
			invoiceTotalRate : 0
		};
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(()=>{
			this.setState({renderPlaceholderOnly : false})
		})

		AsyncStorage.getItem('ACCESS_TOKEN').then((value) => {
			this.setState({access_token : value});

			this._getInvoiceData();
		})
		// console.log('RequestID', this.state.RequestID)
	}

	_getInvoiceData(){
		this.setState({preloadSaveInvoice : true})
		var request = new Request(CONSTANT.API_URL+'request/createinvoice/'+this.state.RequestID, {
				method : 'GET',
				headers : {
					'Content-Type' : 'application/json',
					'Authorization' : this.state.access_token
				}
			});

		fetch(request)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				this.setState({
					preloadSaveInvoice : false,
					invoiceData : response.Data
				});

				response.Data.BillingItems.map((key, index) => {
					if(key.BillingItemTypeID == 1){
						this.setState({
							invoiceTotalRateSite : this.state.invoiceTotalRateSite + key.Amount
						});
					}

					this.setState({
						invoiceTotalRate : this.state.invoiceTotalRate + key.Amount
					});
				})
			})
			.catch((err) => {
				this.setState({preloadSaveInvoice : false})
				console.log('error',err);
			})
	}

	_doPayment(){
		// this.setState({preloadSaveInvoice : true})
		var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
		sceneConfig.gestures.pop.disabled = true;
    	

    	this.props.toRoute({
			name : 'payment',
			component : require('./payment'),
			data : {
				RequestID : this.state.RequestID
			},
    		sceneConfig : sceneConfig
		})
	}

	renderInvoiceSite(data){
		if(data){
			return(
				data.BillingItems.map((key, index) => {
					if(key.BillingItemTypeID == 1){
						return(
							<Text key={index}>{moment(key.FromDate).format('YYYY-MM-DD')} ($ {key.Amount}.00)</Text>
						)	
					}
				})
			)
		}
		
	}

	renderInvoiceAmenities(data){
		if(data){
			return(
				data.BillingItems.map((key, index) => {
					if(key.BillingItemTypeID != 1){
						return(
							<View style={styles.itemTableContentList} key={index}>
								<View style={{flex : 3}}>
									<Text>{key.Description}</Text>
								</View>
								<View style={{flex: 1}}>
									<Text>$ {key.Amount}.00</Text>
								</View>
							</View>
						)
					}
				})
			)
		}
	}

	preload(status){
		if(status){
			return(
				<View style={{flex : 1, position : 'absolute', width : screenWidth, left: 0, right : 0, top: 0, bottom: 0, zIndex: 4, backgroundColor : 'rgba(255,255,255, 0.8)'}}>
					<ActivityIndicator
				        animating={true}
				        style={{height: 80,padding: 8, marginTop: 50}}
				        color={styleVar.colors.secondary}
				        size="large"/>
				</View>
			)
		}else{
			return(
				<View style={{position:'absolute'}}>
				</View>
			)
		}
	}

	initialLoad(status){
		if(status){
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
	}

	backSite(){
		this.props.toBack();
	}

	render(){
		if (this.state.renderPlaceholderOnly) {
	    	return this.initialLoad(true);
	    }

		return(
			<View style={styles.containerHome}>
				<View style={[styles.headerModal]}>
					<Icon name='arrow-back' size={30} color="#FFF" onPress={ () => this.backSite() }></Icon>
					<Text style={styles.headerTitle}>Invoice Details</Text>
					<View style={{width : 30}}/>
				</View>
				{this.initialLoad(this.state.renderPlaceholderOnly)}
				{this.preload(this.state.preloadSaveInvoice)}
				<ScrollView style={{backgroundColor : styleVar.colors.greySecondary}}>
					<View style={styles.invoiceHeader}>
						<Text style={[styleVar.size.h3,{color : styleVar.colors.white}]}>INV-0077</Text>
						<Text style={[styleVar.size.h4,{color : styleVar.colors.white}]}>Order Date : {moment(this.state.invoiceData.OrderDate).format('YYYY-MM-DD')}</Text>
						<Text style={[styleVar.size.h3,{color : styleVar.colors.white, marginTop : 30}]}>TOTAL</Text>
						<Text style={[styleVar.size.h1,{color : styleVar.colors.white}]}>$ {this.state.invoiceTotalRate}.00</Text>
					</View>
					<View style={styles.invoiceDate}>
						<View style={styles.invoiceDateContent}>
							<Text style={[styleVar.size.h3, {color : styleVar.colors.black}]}>{moment(this.state.invoiceData.FromDate).format('YYYY-MM-DD')}</Text>
							<Text style={[styleVar.size.content, {color : styleVar.colors.primary}]}>Arrival Date</Text>
						</View>

						<View style={styles.invoiceDateContent}>
							<Text style={[styleVar.size.h3, {color : styleVar.colors.black}]}>{moment(this.state.invoiceData.ToDate).format('YYYY-MM-DD')}</Text>
							<Text style={[styleVar.size.content, {color : styleVar.colors.primary}]}>Departure Date</Text>
						</View>
					</View>

					<View style={styles.itemTableHeader}>
						<View style={{flex : 3, }}>
							<Text style={[styleVar.size.h4],{color: styleVar.colors.primary}}>Items</Text>
						</View>
						<View style={{flex : 1,}}>
							<Text style={[styleVar.size.h4],{color: styleVar.colors.primary}}>Amount</Text>
						</View>
					</View>

					<View style={styles.itemTableContent}>
						<View style={styles.itemTableContentList}>
							<View style={{flex : 3}}>
								<Text>{this.state.invoiceData.PropertyAddressLine1}</Text>

								{this.renderInvoiceSite(this.state.invoiceData)}
								
							</View>
							<View style={{flex: 1}}>
								<Text>$ {this.state.invoiceTotalRateSite}.00</Text>
							</View>
						</View>

						{this.renderInvoiceAmenities(this.state.invoiceData)}						

						<View style={styles.itemTableContentFooter}>
							<View style={{flex : 3}}>
								<Text style={[styleVar.size.h3, styleVar.bold, {color : styleVar.colors.black}]}>TOTAL
</Text>
							</View>
							<View style={{flex: 1}}>
								<Text style={[styleVar.size.h3, styleVar.bold, {color : styleVar.colors.black}]}>$ {this.state.invoiceTotalRate}.00</Text>
							</View>
						</View>
					</View>

					<TouchableWithoutFeedback onPress={() => this._doPayment()}>
						<View style={styles.btnPayment}>
							<Text style={[styleVar.size.h4, {color : styleVar.colors.white}]}>Pay with Paypal</Text>
						</View>
					</TouchableWithoutFeedback>

				</ScrollView>
			</View>
		)
	}
}

module.exports = Invoice;