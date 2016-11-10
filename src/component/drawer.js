import React, {Component} from 'react';

import DrawerLayout from 'react-native-drawer-layout';

class Drawer extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render(){
		return(
			<DrawerLayout
		      drawerWidth={300}
		      ref={(drawer) => { return this.drawer = drawer  }}
		      drawerPosition={DrawerLayout.positions.Left}
		      renderNavigationView={() => this.props.templateMenu}/>
		)
	}
}

module.exports = Drawer;