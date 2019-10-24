const errorName = {
    UNAUTHORIZED: 'UNAUTHORIZED'
}
const errorType = {
	UNAUTHORIZED: {
		message: 'Authentication is needed to get requested response. Use login mutation to log in.',
		statusCode:401
	},
	INVALID_ROLE: {
		message: 'Invalid input for user role. Supported roles are user, moderator and admin',
		statusCode:422
	}
}

module.exports = {
/**
 * @function getError
 * @returns {Object<ErrorType>}
 * @description Returns error object with passed error name
 */
	getError: errorName => {
		return errorType[errorName]
	},
	errorName
}