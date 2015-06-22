/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/node-uuid.d.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />

/// <reference path="../VigiglobeNamespaceManager.ts" />

var uuid : any = require('node-uuid');
var moment : any = require('moment');

/**
 * Represents the Vigiglobe's GetStatistics Source.
 *
 * @class GetStatistics
 * @extends SourceItf
 */
class GetStatistics extends SourceItf {


	/**
	 * Constructor.
	 *
	 * @param {JSON Object} params - Source's Params.
	 * @param {VigiglobeNamespaceManager} vigiglobeNamespaceManager - SourceNamespaceManager attached to Source.
	 */
	constructor(params : any, vigiglobeNamespaceManager : VigiglobeNamespaceManager) {
		super(params, vigiglobeNamespaceManager);
	}

	/**
	 * Run the source.
	 *
	 * @method run
	 */
	run() {
		var self = this;

		var fail = function(error) {
			Logger.error(error);
		};

		var success = function(result) {
			Logger.debug(result);
		};

		var today = moment();
		today.milliseconds(0);
		today.seconds(0);
		today.minutes(0);
		today.hours(0);

		var timeFrom = encodeURIComponent(today.format());

		today.seconds(59);
		today.minutes(59);
		today.hours(23);

		var timeTo = encodeURIComponent(today.format());

		var projectId = self.getParams().VigiglobeProjectId;

		RestClient.get("http://api.vigiglo.be/api/statistics/v1/volume?language=%5B%22fr%22%5D&granularity=day&timeFrom=" + timeFrom + "&count=messages&project_id=" + projectId + "&timeTo=" + timeTo, success, fail);
	}
}