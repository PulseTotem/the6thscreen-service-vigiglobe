/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/node-uuid.d.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/TagList.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/Tag.ts" />

/// <reference path="../VigiglobeNamespaceManager.ts" />

var uuid : any = require('node-uuid');
var moment : any = require('moment');

/**
 * Represents the Vigiglobe's GetWordCloud Source.
 *
 * @class GetWordCloud
 * @extends SourceItf
 */
class GetWordCloud extends SourceItf {


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

			var tagList:TagList = new TagList();

			var today = moment();
			today.milliseconds(0);
			today.seconds(0);
			today.minutes(0);
			today.hours(0);

			tagList.setId(today.format());
			tagList.setPriority(0);

			for(var tagWord in response.data) {
				var tagDesc = response.data[tagWord];

				var tag: Tag = new Tag();

				tag.setId(tagWord);
				tag.setName(tagWord);

				tag.setPopularity(tagDesc[0][1]);

				tag.setDurationToDisplay(parseInt(self.getParams().InfoDuration));

				tagList.addTag(tag);
			}

			tagList.setDurationToDisplay(parseInt(self.getParams().InfoDuration) * tagList.getTags().length);

			Logger.debug(tagList);

			self.getSourceNamespaceManager().sendNewInfoToClient(tagList);
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

		RestClient.get("http://api.vigiglo.be/api/statistics/v1/wordcloud?language=%5B%22fr%22%5D&granularity=day&limit=" + self.getParams().Limit + "&timeFrom=" + timeFrom + "&count=messages&project_id=" + projectId + "&kind=hashtags&timeTo=" + timeTo, success, fail);
	}
}