import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Image,
  View,
  TouchableHighlight
} from 'react-native';
import MapView from 'react-native-maps';
import SideMenu from 'react-native-side-menu';
import Menu from '../component/menu';
import HeaderContent from '../component/headerContent';

import Routes from '../routes';
import DrawerLayout from 'react-native-drawer-layout';
import AccessToken from '../accessToken';
import styles from '../style/stayRequest';

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

class StayRequest extends Component{

	constructor(props) {
	  super(props);
	
	  this.state = {};
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

	_onLogout = ( ) => {
    	AccessToken.clear();
    	this.props.replaceRoute(Routes.link('login'));
    }

	render(){
    	const menu = <Menu nextPage={this.onNextPage} logout={this._onLogout}/>;
		return(
			<DrawerLayout
		      drawerWidth={300}
		      ref={(drawer) => { return this.drawer = drawer  }}
		      drawerPosition={DrawerLayout.positions.Left}
		      renderNavigationView={() => menu}>
				<View style={styles.containerHome}>
			    	<HeaderContent onPress={() => this.toggle()} title="Stay Request" icon="search"/>
			    	<View style={styles.containerContent}>
						<Text>This is My Caravan Page</Text>
			    	</View>
			    </View>
			</DrawerLayout>
		)
	}
}

module.exports = StayRequest;