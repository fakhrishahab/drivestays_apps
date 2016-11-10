'use strict';

import Reflux from 'reflux';
import PropertyAction from '../actions/propertyAction';

import ApiRequest from '../apiRequest';

let currentProperty = null;

export default Reflux.createStore({
	listenables: PropertyAction,
	init : function(){

	},
	getCurrentProperty : function(){
		return currentProperty;
	},
	setCurrentProperty : function(property){
		currentProperty = property;
	},
	getProperty : function(id, fromDate, toDate){
		// console.log(id, fromDate, toDate)
		ApiRequest.loadSiteDetail(id, fromDate, toDate)
			.then((data) => {
				// console.log(data)
				this.setCurrentProperty(data)
				PropertyAction.getProperty.completed(data);
			})
			.catch((err) => PropertyAction.getProperty.failed(err));
	},
	getPropertyCompleted : function(data){
		PropertyAction.loadProperty(data)
	},
	getPropertyFailed : function(error){
		console.log('Get Property data error ', error.message);
	},
	loadProperty : function(id){
		return this.getCurrentProperty()
	}
})