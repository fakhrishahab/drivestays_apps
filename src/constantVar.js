module.exports = {
	API_URL : 'http://travellers.azurewebsites.net/api/',
	WEB_URL : 'http://travellers.azurewebsites.net/',

	REQUEST_STATUS : {
		SUBMITTED: 1,
		ACCEPTED: 2,
		DECLINED: 3,
		PAID: 4,
		FREE: 5,
		CANCELLED_VISITOR: 7,
		CANCELLED_OWNER: 8,
		CANCELLED_SYSTEM: 9
	},

	PAYMENT_TYPE: [
        {ID: 1,NAME: 'visa',PATH: "/Assets/images/visa.png", Description : 'Visa'},
        {ID: 2,NAME: 'mastercard',PATH: "/Assets/images/master_card.png", Description : 'Master Card'},
        {ID: 3,NAME: 'amex',PATH: "/Assets/images/american_express.png", Description : 'American Express'},
        {ID: 4,NAME: 'discover',PATH: "/Assets/images/discover.png", Description : 'Discover'}
    ]
}