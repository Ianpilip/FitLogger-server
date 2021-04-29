/**
 * Return a random token hash
 * Set the param about property (nested 
 * @return {String}
 */
const generateToken = () => Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)

module.exports = {
    generateToken,
}