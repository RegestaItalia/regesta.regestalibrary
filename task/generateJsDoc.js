/**
 * Custom task example
 *
 * @param {Object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {Object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace if available
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with <code>undefined</code> once data has been written
 */
module.exports = async function ({
	workspace,
	dependencies,
	options
}) {
	// For logging purposes
	console.log("----------------------RUNNING JSDOC----------------------");

	const {
		execSync
	} = require('child_process');
	// will execute the standard jsdoc command using our configuration.
	execSync('jsdoc -c ./jsdoc.conf.json --verbose', {
		stdio: 'inherit'
	});

	// For logging purposes
	console.log("----------------------END OF RUNNING JSDOC----------------------");

};