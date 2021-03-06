'use strict';

const worker = require('./lib/cluster/worker');
const slicer = require('./lib/cluster/slicer');
const assetsLoader = require('./lib/cluster/assets_loader');
const assetsService = require('./lib/cluster/services/assets');
const master = require('./lib/master');
const clusterMaster = require('./lib/cluster/cluster_master');
const moderator = require('./lib/cluster/moderator');

const configSchema = require('./lib/config/schemas/system').config_schema;
const schemaFormats = require('./lib/utils/convict_utils');

function opsDirectory(configFile) {
    if (configFile.teraslice && configFile.teraslice.ops_directory) {
        return configFile.teraslice.ops_directory;
    }
}

function clusterName(configFile) {
    if (configFile.teraslice && configFile.teraslice.name) {
        return configFile.teraslice.name;
    }
}

function loggingConnection(configFile) {
    if (configFile.teraslice && configFile.teraslice.state) {
        return configFile.teraslice.state.connection;
    }

    return 'default';
}

const foundation = require('terafoundation')({
    name: 'teraslice',
    worker,
    master,
    slicer,
    assets_loader: assetsLoader,
    assets_service: assetsService,
    shutdownMessaging: true,
    cluster_master: clusterMaster,
    moderator,
    descriptors: {
        slicer: true,
        worker: true,
        cluster_master: true,
        moderator: true,
        assets_loader: true,
        assets_service: true
    },
    start_workers: false,
    config_schema: configSchema,
    schema_formats: schemaFormats,
    ops_directory: opsDirectory,
    cluster_name: clusterName,
    logging_connection: loggingConnection
});
