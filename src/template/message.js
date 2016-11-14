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
	ActivityIndicator
} from 'react-native';
import MapView from 'react-native-maps';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';

import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import styleVar from '../styleVar';
import AccessToken from '../accessToken';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

class Message extends Component{

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	renderPlaceholderOnly : true
	  };
	  this.onNextPage = this.onNextPage.bind(this);
	}

	toggle() {
		this.drawer.openDrawer();
        this.setState({
          isOpen: !this.state.isOpen,
        });
    }

    onNextPage = (menu) => {
		this.props.toRoute(Routes.link(menu));
    }

    componentDidMount(){
    	InteractionManager.runAfterInteractions(()=>{
    		this.setState({renderPlaceholderOnly : false})
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

	_onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

	render(){
    	const menu = <Menu nextPage={this.onNextPage} logout={this._onLogout}/>;

    	if (this.state.renderPlaceholderOnly) {
	    	return this.preload();
	    }
		return(
			<DrawerLayout
		      drawerWidth={300}
		      ref={(drawer) => { return this.drawer = drawer  }}
		      drawerPosition={DrawerLayout.positions.Left}
		      renderNavigationView={() => menu}>
				<View style={styles.containerHome}>
			    	<HeaderContent onPress={() => this.toggle()}/>
			    	<View style={styles.containerContent}>
						<Text>Ini Message</Text>
			    	</View>
			    </View>
			</DrawerLayout>
		)
	}
}

const styles = StyleSheet.create({
	containerHome : {
		flex: 1,
		zIndex : 0,
		backgroundColor : '#FFFFFF'
	},
	containerContent : {
		flex : 1,
		backgroundColor : styleVar.colors.greySecondary
	}
})

module.exports = Message;