/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/scripts/server/SourceServer.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./VigiglobeNamespaceManager.ts" />



/**
 * Represents the The 6th Screen Vigiglobe' Service.
 *
 * @class Vigiglobe
 * @extends SourceServer
 */
class Vigiglobe extends SourceServer {



    /**
     * Constructor.
     *
     * @param {number} listeningPort - Server's listening port..
     * @param {Array<string>} arguments - Server's command line arguments.
     */
    constructor(listeningPort : number, arguments : Array<string>) {
        super(listeningPort, arguments);

        this.init();
    }

    /**
     * Method to init the Vigiglobe server.
     *
     * @method init
     */
    init() {
        var self = this;

        this.addNamespace("Vigiglobe", VigiglobeNamespaceManager);
    }
}

/**
 * Server's Vigiglobe listening port.
 *
 * @property _VigiglobeListeningPort
 * @type number
 * @private
 */
var _VigiglobeListeningPort : number = process.env.PORT || 6011;

/**
 * Server's Vigiglobe command line arguments.
 *
 * @property _VigiglobeArguments
 * @type Array<string>
 * @private
 */
var _VigiglobeArguments : Array<string> = process.argv;

var serverInstance = new Vigiglobe(_VigiglobeListeningPort, _VigiglobeArguments);
serverInstance.run();