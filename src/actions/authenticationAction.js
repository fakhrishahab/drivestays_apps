import Reflux from 'reflux';

import AccessToken from '../accessToken';

let actions = Reflux.createActions([
	"auth",
	"unauth",
	{ login: { asyncResult : true } },
	"logout",
	{ signup : {asyncResult : true} },
	{ loadUser : {asyncResult : true } },
	{ updateUser : {asyncResult : true} }
]);

actions.auth.listen( () => {
	return AccessToken.get();
})

actions.unauth.listen( () => {
	AccessToken.clear();
})

export default actions;