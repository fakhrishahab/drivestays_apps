/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Navigator,
  Image,
  } from 'react-native';

import Router from 'react-native-simple-router';

import Home from './src/template/home';
import Splash from './src/template/splash';
import Menu from './src/component/menu';
import DrawerLayoutAndroid from 'react-native-drawer-layout';

var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
    sceneConfig.gestures.pop.disabled = true;

let defaultRoute = {
  name : 'Splash',
  component : Splash,
  sceneConfig : sceneConfig
}

const propTypes = {
  toRoute: PropTypes.func.isRequired
}

class DrivestaysApp extends Component{
  render(){

    return(
      <Router 
        firstRoute={defaultRoute}
        hideNavigationBar = {true}
        noStatusBar = {true}
        trans={false}
        handleBackAndroid ={true}/>
    )
  }
}


const styles = StyleSheet.create({
  appContainer : {
    flex : 1
  },
  header : {
    height: 0,
    backgroundColor : '#000000'
  }
});

AppRegistry.registerComponent('drivestays_app', () => DrivestaysApp);
