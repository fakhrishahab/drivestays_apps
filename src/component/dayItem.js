import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

var DayItem = React.createClass({
	render: function(){
		return(
			<Text style={this.style()}>
				{this.props.dataItem}
			</Text>
		)
	},
	style: function(){
		return{
			color : this.color()
		}
	},
	color : function(){
		var opacity = 1;
		if(this.props.daysUntil > 0){
			opacity = parseFloat(1 / this.props.daysUntil);	
		}
		
		return 'rgba(0, 0, 0,'+ opacity +')';
	}
});

module.exports = DayItem;