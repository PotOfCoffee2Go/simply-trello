/**
 * Created by PotOfCoffee2Go on 12/6/2014.
 *
 * The Trello interface requires your Key and a token
 * In a web browser go to https://trello.com/1/appKey/generate
 *   that will display yourKey
 * Change 'yourKey' in the link below with your Key, then in a web browser go to
 *   https://trello.com/1/connect?key=yourKey&name=MyNodeProject&response_type=token&expiration=never&scope=read,write
 *   accept it - and it will display a token
 * Use yourKey and the token in the trello.Login function
 *   var trello = require('./trello.js').Login(trelloKey,trelloToken);
 *
 * The 'entry' object contains ids and info to the Trello board, list, and card record
 * 'entry' is constructed by passing the Trello board, list, and card names (path)
 *   along with optional content to update board/card description or add a card
 *
 * If the board->list->card given are not found they are created.
 *
 * The apiRequests is a callback function or an array of callback functions provided by the caller.
 * (If an array the callbacks are executed serially in sequence)
 * The prototype of the callback is callback(err,entry,callbacklist)
 */

(function () {
    "use strict";

    var util = require('util');
    var Trello = require("node-trello");

    var trello = null;

    /**
     * Log in to Trello
     * @param yourkey
     * @param token
     * @constructor
     */
    exports.Login = function (yourkey, token) {
        trello = new Trello(yourkey, token);
        return this;
    };

    /**
     * Append a function (or array of functions) to callback chain
     *
     * @param curList array
     * @param addList array or a function to append to curList
     * @returns {*}
     * @constructor
     */
    exports.AppendCallback = function (curList, addList) {
        if (addList) {
            // Append a regular callback
            if (typeof addList === 'function') {
                curList.push(addList);
            } // Append array of callbacks
            else if (addList.length) {
                curList = curList.concat(addList);
            }
        }
        return curList;
    };

    /**
     * Simple implementation to handle the callback chain
     *
     * @param err
     * @param entry
     * @param cbl
     * @returns {*}
     * @constructor
     */
    exports.NextCallback = function (err, entry, cbl) {
        if (cbl) {
            // Is a regular callback
            if (typeof cbl === 'function') {
                cbl(err, entry, null);
            } // Is callback list
            else if (cbl.length) {
                var nextFn = cbl.shift();
                nextFn(err, entry, cbl);
            }
        }
        return entry;
    };


    /**
     * Find (or Create) this card entry on Trello
     *  and run the given callback (array) that performs activities on the card
     *
     * The Entry object holds current information on the target board, list, and card
     * A record of all Trello API calls are also stored in the Entry object
     *
     * The cardPath is the name of board, list, and card which Trello API calls are directed
     * The callback list implement the Trello API calls.
     *
     * @param cardPath object {board: 'boardname', list: 'listname', card: 'cardname'}
     * @param cbl array callbacks to functions that call Trello API
     * @constructor
     */
    exports.Entry = function (cardPath, cbl) {
        this.board = {name: cardPath.board};
        this.list = {name: cardPath.list};
        this.card = {name: cardPath.card};
        this.requests = [];

        // Append callers callback (list) to callbacks that get (or create) Trello board, list, and card
        var trelloFnList = exports.AppendCallback([FindOrCreateBoard, FindOrCreateList, FindOrCreateCard], cbl);

        // Get the Trello entry and process it
        exports.NextCallback(null, this, trelloFnList);
    };

    /**
     * Finds (or creates) a Trello board
     *
     * @param err
     * @param entry
     * @param cbl
     * @constructor
     */
    function FindOrCreateBoard(err, entry, cbl) {
        var boardName = entry.board.name;

        trello.get('/1/members/me/boards', function (err, tdata) {
            if (err) throw err;
            for (var i = 0; i < tdata.length; i++) {
                if (tdata[i].name === boardName) {
                    entry.board = tdata[i];
                    exports.NextCallback(err, entry, cbl);
                    return;
                }
            }
            trello.post('/1/boards', {name: boardName}, function (err, tdata) {
                if (err) throw err;
                entry.board = tdata;
                exports.NextCallback(err, entry, cbl);
            })
        })
    }

    /**
     * Finds (or creates) a Trello List
     *
     * @param err
     * @param entry
     * @param cbl
     * @constructor
     */
    function FindOrCreateList(err, entry, cbl) {
        var boardId = entry.board.id;
        var listName = entry.list.name;

        trello.get('/1/boards/' + boardId + '/lists', function (err, tdata) {
            if (err) throw err;
            for (var i = 0; i < tdata.length; i++) {
                if (tdata[i].name === listName) {
                    entry.list = tdata[i];
                    exports.NextCallback(err, entry, cbl);
                    return;
                }
            }
            trello.post('/1/boards/' + boardId + '/lists', {name: listName}, function (err, tdata) {
                if (err) throw err;
                entry.list = tdata;
                exports.NextCallback(err, entry, cbl);
            })
        })
    }

    /**
     * Finds (or creates) a Trello Card
     *
     * @param err
     * @param entry
     * @param cbl
     * @constructor
     */
    function FindOrCreateCard(err, entry, cbl) {
        var listId = entry.list.id;
        var cardName = entry.card.name;

        trello.get('/1/lists/' + listId + '/cards', function (err, tdata) {
            if (err) throw err;
            for (var i = 0; i < tdata.length; i++) {
                if (tdata[i].name === cardName) {
                    entry.card = tdata[i];
                    exports.NextCallback(err, entry, cbl);
                    return;
                }
            }
            trello.post('/1/lists/' + listId + '/cards', {name: cardName}, function (err, tdata) {
                if (err) throw err;
                entry.card = tdata;
                exports.NextCallback(err, entry, cbl);
            })
        })
    }

    /**
     * Verify all required fields are in the Trello API request
     *
     * @param request object
     * @param entry object
     */
    function VerifyRequestInput(request, entry) {
        var typeName = request.type + 's';

        if (!request.type) {
            return new Error('request.type of board, list, or card required');
        }
        if (!request.method) {
            return new Error('request.method required - see https://trello.com/docs/api/' + typeName + ' for methods');
        }
        if (!request.endpoint) {
            request.endpoint = '/';
        }
        if (!request.arguments) {
            request.arguments = {};
        }
        request.method = request.method.toUpperCase();
        return null;
    }

    function StoreResponse(request, entry, tdata) {
        delete request.arguments.key; // Do not show the key and token
        delete request.arguments.token;
        entry.requests.push({request: request, response: tdata});
        entry.lastRequest = request;
        entry.lastResponse = tdata;
    }

    /**
     * Submits a Trello API request to either board, list, or card (type)
     *
     * @param request object
     * @param entry object
     * @param cbl array
     * @constructor
     */
    function SubmitRequest(request, entry, cbl) {
        var verifyErr = VerifyRequestInput(request, entry);

        if (verifyErr) {
            exports.NextCallback(verifyErr, entry, cbl);
            return;
        }

        var typeId = entry[request.type].id; // id of board, list, or card
        var typeApiName = request.type + 's';
        // If an id was given in the request - override the default
        if (request.id) {
            typeId = request.id;
        }

        request.endpoint = ('/1/' + typeApiName + '/' + typeId + '/' + request.endpoint).replace(/\/\//g, '/');

        if (request.method === 'GET') {
            trello.get(request.endpoint, request.arguments, function (err, tdata) {
                if (err) {
                    entry.requests.push({request: request, response: err});
                    exports.NextCallback(err, entry, cbl);
                    return;
                }
                StoreResponse(request, entry, tdata);
                exports.NextCallback(err, entry, cbl);
            })
        }
        else if (request.method === 'PUT') {
            trello.put(request.endpoint, request.arguments, function (err, tdata) {
                if (err) {
                    entry.requests.push({request: request, response: err});
                    exports.NextCallback(err, entry, cbl);
                    return;
                }
                StoreResponse(request, entry, tdata);
                exports.NextCallback(err, entry, cbl);
            })
        }
        else if (request.method === 'POST') {
            trello.post(request.endpoint, request.arguments, function (err, tdata) {
                if (err) {
                    entry.requests.push({request: request, response: err});
                    exports.NextCallback(err, entry, cbl);
                    return;
                }
                StoreResponse(request, entry, tdata);
                exports.NextCallback(err, entry, cbl);
            })
        }
        else if (request.method === 'DELETE') {
            trello.del(request.endpoint, request.arguments, function (err, tdata) {
                if (err) {
                    entry.requests.push({request: request, response: err});
                    exports.NextCallback(err, entry, cbl);
                    return;
                }
                StoreResponse(request, entry, tdata);
                exports.NextCallback(err, entry, cbl);
            })

        }

    }


    /**
     * Helper function - request is for the Trello board
     * Trello /1/boards request - see https://trello.com/docs/api/board/index.html
     * @param request object
     * @param entry object
     * @param cbl array
     */
    exports.SubmitBoardRequest = function (request, entry, cbl) {
        request.type = 'board';
        SubmitRequest(request, entry, cbl);
    };

    /**
     * Helper function - request is for the Trello list
     * Trello /1/lists request - see https://trello.com/docs/api/list/index.html
     * @param request
     * @param cbl
     * @constructor
     */
    exports.SubmitListRequest = function (request, entry, cbl) {
        request.type = 'list';
        SubmitRequest(request, entry, cbl);
    };

    /**
     * Helper function - request is for the Trello card
     * Trello /1/cards request - see https://trello.com/docs/api/card/index.html
     * @param request
     * @param cbl
     * @constructor
     */
    exports.SubmitCardRequest = function (request, entry, cbl) {
        request.type = 'card';
        SubmitRequest(request, entry, cbl);
    };


    function Display(entry, cbl) {
        console.log(util.inspect(entry, {showHidden: false, depth: null}));
        exports.NextCallback(err, entry, cbl);
    }


})();

