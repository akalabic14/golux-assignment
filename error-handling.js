const errorName = {
    UNAUTHORIZED: 'UNAUTHORIZED'
}
const errorType = {
	UNAUTHORIZED: {
		message: 'Authentication is needed to get requested response.',
		statusCode:401
    }
}

module.exports = {
	getError: errorName => {
		return errorType[errorName]
	},
	errorName
}