/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/scripts/server/SourceNamespaceManager.ts" />

/// <reference path="./sources/GetStatistics.ts" />
/// <reference path="./sources/GetWordCloud.ts" />

class VigiglobeNamespaceManager extends SourceNamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);
	    this.addListenerToSocket('GetStatistics', function(params : any, self : VigiglobeNamespaceManager) { (new GetStatistics(params, self)) });
		this.addListenerToSocket('GetWordCloud', function(params : any, self : VigiglobeNamespaceManager) { (new GetWordCloud(params, self)) });
    }
}