import {
	Navigator
} from 'react-native';
var Routes = module.exports = {
	link: function(page){
		var target;
		switch(page){
			case 'myProfile' :
				target = require('./template/myProfile');
				break;
			case 'home' :
				target = require('./template/home');
				break;
			case 'myCaravan' :
				target = require('./template/myCaravan');
				break;
			case 'mySite' :
				target = require('./template/mySite');
				break;
			case 'transactionList' :
				target = require('./template/transactionList');
				break;
			case 'accountSetting' :
				target = require('./template/accountSetting');
				break;
			case 'accountPayment' :
				target = require('./template/accountPayment');
				break;
			case 'configuration' :
				target = require('./template/configuration');
				break;
			case 'login' :
				target = require('./template/login');
				break;
			case 'register' :
			target = require('./template/register');
				break;
			case 'splash' :
				target = require('./template/splash');
				break;
			case 'message' :
				target = require('./template/message');
				break;
		}

		var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
		sceneConfig.gestures.pop.disabled = true;

		return {
    		name : 'menu',
    		component: target,
    		sceneConfig: sceneConfig
    	}
	}
}