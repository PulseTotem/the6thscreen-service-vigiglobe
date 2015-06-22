/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/node-uuid.d.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />

/// <reference path="../VigiglobeNamespaceManager.ts" />

var uuid : any = require('node-uuid');

class GetStatistics extends SourceItf {


	constructor(params : any, vigiglobeNamespaceManager : VigiglobeNamespaceManager) {
		super(params, vigiglobeNamespaceManager);
	}

	public run() {
		var self = this;

		var fail = function(error) {
			Logger.error(error);
		};

		var success = function(result) {
			Logger.debug(result);
		};

		
	}
}