import Reflux from 'reflux';

let actions = Reflux.createActions([
	{ getProperty : {asyncResult : true }},
	{ updateProperty : {asyncResult:true }},
	{ deleteProperty : {asyncResult : true}},
	{ loadProperty : {asyncResult : true }}
]);

export default actions;