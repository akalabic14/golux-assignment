const errorName = {
    UNAUTHORIZED: 'UNAUTHORIZED'
}
const errorType = {
	UNAUTHORIZED: {
		message: 'Unauthorized request. You are not logged in, or your role does not have required permission.',
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