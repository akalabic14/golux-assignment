const errorName = {
	UNAUTHORIZED: 'UNAUTHORIZED',
	INVALID_ROLE: 'INVALID_ROLE',
	INVALID_SORTING: 'INVALID_SORTING'
}
const errorType = {
	UNAUTHORIZED: {
		message: 'Unauthorized request. You are not logged in, or your role does not have required permission.',
		statusCode:401
	},
	INVALID_ROLE: {
		message: 'Invalid input for user role. Supported roles are user, moderator and admin',
		statusCode:422
	},
	INVALID_SORTING: {
		message: 'Invalid input for sorting value. Supported values are "asc" and "desc"',
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