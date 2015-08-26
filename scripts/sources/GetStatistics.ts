/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/node-uuid.d.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/CounterList.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/Counter.ts" />

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

		this.run();
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
			var response = result.data();

			var counterList:CounterList = new CounterList();

			counterList.setId(uuid.v1());
			counterList.setPriority(0);

			if(typeof(response.data) != "undefined" && typeof(response.data.messages) != "undefined") {

				response.data.messages.forEach(function (counterDesc) {
					var counter:Counter = new Counter();

					counter.setId(counterDesc[0]);
					counter.setValue(counterDesc[1])

					counter.setDurationToDisplay(parseInt(self.getParams().InfoDuration));

					counterList.addCounter(counter);
				});

				counterList.setDurationToDisplay(parseInt(self.getParams().InfoDuration) * response.data.length);

				Logger.debug(counterList);

				self.getSourceNamespaceManager().sendNewInfoToClient(counterList);
			} else { // Something to do ???
				Logger.error("Invalid response message from Vigiglobe API.");
			}
		};

		var today = moment();
		today.utcOffset(0);

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

		Logger.info("get : " + "http://api.vigiglo.be/api/statistics/v1/volume?language=%5B%22fr%22%5D&granularity=day&timeFrom=" + timeFrom + "&count=messages&project_id=" + projectId + "&timeTo=" + timeTo);

		RestClient.get("http://api.vigiglo.be/api/statistics/v1/volume?language=%5B%22fr%22%5D&granularity=day&timeFrom=" + timeFrom + "&count=messages&project_id=" + projectId + "&timeTo=" + timeTo, success, fail);
	}
}