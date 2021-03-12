const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const { alias, aliasJest } = require('react-app-rewire-alias')

const aliasMap = {
    example: 'example/src',
    '@library': 'library/src',
}

module.exports = alias(aliasMap)
module.exports.jest = aliasJest(aliasMap)

module.exports = function override(config, env) {
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
    return config;
};