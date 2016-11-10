'use strict';

import Reflux from 'reflux';
import AccessToken from '../accessToken';
import AuthenticationAction from '../actions/authenticationAction';

import ApiRequest from '../apiRequest';

let currentUser = null;

export default Reflux.createStore({
	listenables: AuthenticationAction,
	init : function(){

	},

	getCurrentUser: function(id){
		return currentUser;
	},

	setCurrentUser : function(uid, user){
		currentUser = Object.assign({uid : uid}, user);
	},

	onLogin : function(data){
		ApiRequest.login(data)
			.then((authData) => {
				AccessToken.set(authData.Auth_Token)
					.then(() => {
						AuthenticationAction.login.completed(authData.Data.EmailAddress, authData.Auth_Token)
					})
			})
			.catch((err) => AuthenticationAction.login.failed(err))
	},

	onLoginCompleted : function(data, access_token){
		AuthenticationAction.loadUser(data, access_token);
	},

	onLoginFailed : function(error){
		console.error("Login failed with error ", error.message);
	},

	onSignup : function(data){
		ApiRequest.signup(data)
			.then((userData) => AuthenticationAction.signup.completed(data, userData))
			.catch((err) => AuthenticationAction.signup.failed(err));
	},

	onSignupCompleted : function(data, user){
		AuthenticationAction.login(data)
	},

	onSignupFaield : function(error){
		console.error("Signup failed with error ", error.message);
	},

	onLoadUser : function(email, access_token){

		ApiRequest.loadUser(email, access_token)
			.then((user) => {
				AccessToken.setUser(user.Data)
					.then(() => {
						AuthenticationAction.loadUser.completed(user.Data.ID, user.Data)
					})
			})
			.catch((err) => AuthenticationAction.loadUser.failed(err));
	},

	onLoadUserCompleted : function(uid, user){
		this.setCurrentUser(uid, user);
	},

	onLoadUserFailed : function(error) {
		console.error("loading user failed with error ", error.message);
	},

	onLogout : function(){
		AccessToken.clear();
		// ApiRequest.logout()
		// 	.then(() => {
		// 		AccessToken.clear();		
		// 	})
		// 	.catch((err) => console.log('error : ',err))
		
	}
})
