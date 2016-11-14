'use strict';
import CONSTANT from './constantVar';
const API_URL = 'http://travellers.azurewebsites.net';
import AccessToken from './accessToken';
import React, {
	AsyncStorage
} from 'react-native';

class ApiRequest{
	constructor(props) {
		// AccessToken.get()
		// 	.then((data) => {
		// 		this.state = {
		// 			access_token : data
		// 		}
		// 	})
	}

	login(data){
		return new Promise((next, error) => {
			let callback = function(err, authData){
				if(err){
					error(err);
				}else{
					next(authData);
				}
			};
			var email = data.email;
			if(data && data.email){
				return fetch(CONSTANT.API_URL+'login?email='+data.email+'&password='+data.password, {
						method : 'GET'
					})
					.then((response) => {
						return response.json();
					})
					.catch((err) => {
						console.log(err)
					})
					.then((data) => {
						next(data);
					})
			}
		})
	}

	logout(){
		return new Promise((next, error) => {
			return fetch(CONSTANT.API_URL+'logout', {
				method : 'get',
				headers : {
					'Authorization' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZha2hyaTE4MDRAZ21haWwuY29tIiwidXNlcklkIjozNzEsInJvbGUiOiJVc2VyIiwic3ViIjozNzEsIm5iZiI6MTQ5MzM4NTA0MywiaWF0IjoxNDc3NjYwMjQzLCJleHAiOjE1MDkxOTYyNDMsInBpYyI6IkNvbnRlbnQvSW1hZ2VzL0N1c3RvbWVycy8yMC5wbmciLCJ2Y2wiOjEwNX0.CU2uz8Y6v3p3_10zdkIVRiw-jy_KWOWzBfs-3d5Jr3M'
				}
				})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					next(data);
				})
				.catch((err) => {
					console.log('error : ',err)
				})
		})
	}

	loadUser(email, access_token){
		return new Promise((next, error) => {
			return fetch(CONSTANT.API_URL+'customer/get', {
				headers: {
					'Authorization' : access_token
				}
				})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					next(data)
				})
				.catch((err) => {
					error(err)
					// console.log('error')
				})
		})
		
	}

	loadSiteDetail(id, fromDate, toDate){
		return new Promise((next, error) => {
			return fetch(CONSTANT.API_URL+'property/viewproperty', {
					method : 'post',
					headers : {
						'Content-Type': 'application/json'
					},
					body : JSON.stringify({
					 	PropertyID : id,
					 	FromDate : fromDate,
					 	ToDate : toDate
					})
				})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					// console.log(data.Data)
					next(data.Data);
				})
				.catch((err) => error(err))
		})
	}

	getProperty(){
		// console.log(CONSTANT.API_URL+'properties/get')
		return new Promise((next, error) => {
			return fetch(CONSTANT.API_URL+'properties/get', {method : 'get'})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					next(data);
					// console.log('data ', data);
				})
				.catch((err) => console.log('error : ',err))
		})
	}

	signup(data){
		return new Promise((next, error) => {
			return fetch(CONSTANT.API_URL+'customer/register', {
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify({
					EmailAddress : data.email,
					LastName : data.lastname,
					FirstName : data.firstname,
					Password : data.password
				})
			})
			.then((response) => {
				return response.json()
			})
			.then((response) => {
				next(response)
			})
			.catch((err) => console.log(err))
		})
	}
}

export default new ApiRequest();