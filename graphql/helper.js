module.exports = {
/**
 * @function promisfy_mongoose
 * @returns {Promise}
 * @description Executes forwarded mongodb query and resolves result or rejects error 
 */
    promisfy_mongoose: (command) => {
        return new Promise((resolve, reject) => {
            try {
                command.exec((err, obj) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(obj)
                    }
                })   
            } catch (err) {
                logger.error(err);
                reject(err);
            }
        })
    }
}