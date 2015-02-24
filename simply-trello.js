/**
 * Created by PotOfCoffee2Go on 2/20/2015.
 */
"use strict";

/**
 * The Trello module executes the callbacks which you provide.
 * The declaration of the callback is callback(err, entry, callbacklist)
 *   the 'err' is normal nodejs style error handling
 *   the 'entry' object contains ids and info to the requested Trello board, list, and card
 *   the 'callbacklist' is an array of callbacks to be processed
 *
 *  Most of the time your callback will call :
 *   SubmitBoardRequest(...); // Trello API board request https://trello.com/docs/api/board/index.html
 *   SubmitListRequest(...);  // Trello API list request  https://trello.com/docs/api/list/index.html
 *   SubmitCardRequest(...);  // Trello API card request  https://trello.com/docs/api/card/index.html
 *   NextCallback(...);       // to continue on to the next callback in the callbacklist
 *
 * Insure your callback functions call NextCallback(...) to continue sending requests to Trello
 * SubmitBoardRequest, SubmitListRequest, and SubmitCardRequest call NextCallback automatically for you!
 */

module.exports = function (userAuth, trello, cb) {
    var util = require('util');

    /* List of actions that will be performed on Trello */
    var callbacklist = [];

    /* Results that were performed on Trello */
    var result = {};

    /* Check that we got everything we need to send to Trello */
    if (typeof userAuth == 'undefined' ||
            typeof userAuth.key == 'undefined' ||
            typeof userAuth.token == 'undefined') {
        throw new Error('login credentials required');
    }

    if (typeof trello == 'undefined' ||
            typeof trello.path == 'undefined') {
        throw new Error('Trello card and sub-object path required');
    }

    if (typeof trello.path.board == 'undefined' ||
            typeof trello.path.list == 'undefined' ||
            typeof trello.path.card == 'undefined') {
        throw new Error('Trello card path to board, list, and card required');
    }

    /* Don't need a content, but will make it empty */
    trello.content =  trello.content || {};

    /* Update of the board description */
    if (typeof trello.content.boardDesc != 'undefined') {
        callbacklist.push(function (err, entry, cbl) {
            var request = {
                method: 'PUT',
                endpoint: '/desc',
                arguments: {
                    value: trello.content.boardDesc
                }
            };
            trelloInterface.SubmitBoardRequest(request, entry, function (err, entry) {
                result.boardDesc = {
                    request: entry.lastRequest,
                    response: entry.lastResponse
                };
                trelloInterface.NextCallback(err, entry, cbl);
            });
        });
    }

    /* Update of the card description */
    if (typeof trello.content.cardDesc != 'undefined') {
        callbacklist.push(function (err, entry, cbl) {
            var request = {
                method: 'PUT',
                endpoint: '/desc',
                arguments: {
                    value: trello.content.cardDesc
                }
            };
            trelloInterface.SubmitCardRequest(request, entry, function (err, entry) {
                result.cardDesc = {
                    request: entry.lastRequest,
                    response: entry.lastResponse
                };
                trelloInterface.NextCallback(err, entry, cbl);
            });
        });
    }

    /* Add card comment */
    if (typeof trello.content.cardComment != 'undefined') {
        callbacklist.push(function (err, entry, cbl) {
            var request = {
                method: 'POST',
                endpoint: '/actions/comments',
                arguments: {
                    text: trello.content.cardComment
                }
            };
            trelloInterface.SubmitCardRequest(request, entry, function (err, entry) {
                result.cardComment = {
                    request: entry.lastRequest,
                    response: entry.lastResponse
                };
                trelloInterface.NextCallback(err, entry, cbl);
            });
        });
    }

    /* Remove card */
    if (typeof trello.content.cardRemove != 'undefined' && trello.content.cardRemove === true) {
        var cardNameToDelete = trello.path.card;

        callbacklist.push(function (err, entry, cbl) {
            // Delete card - see https://trello.com/docs/api/card/index.html#delete-1-cards-card-id-or-shortlink
            var deleteCard = {
                name: cardNameToDelete, // Not used by Trello - but I want it in the result
                id: '',
                method: 'DELETE'
            };

            // Find the id of the card from the list see https://trello.com/docs/api/list/index.html#get-1-lists-idlist-cards
            var findCard = {
                method: 'GET',
                endpoint: '/cards',
                arguments: {
                    fields: 'name,idList,idBoard'
                }
            };
            trelloInterface.SubmitListRequest(findCard, entry, function (err, entry) {
                var deleteSent = false;
                for (var i = 0; i < entry.lastResponse.length && deleteSent === false; i++) {
                    if (entry.lastResponse[i].name === cardNameToDelete) {
                        deleteCard.id = entry.lastResponse[i].id;
                        deleteSent = true;
                        trelloInterface.SubmitCardRequest(deleteCard, entry, function (err, entry) {
                            result.cardRemove = {
                                request: entry.lastRequest,
                                response: entry.lastResponse
                            };
                            trelloInterface.NextCallback(err, entry, cbl);
                        })
                    }
                }
                if (deleteSent === false) {
                    result.cardRemove = {
                        request: deleteCard,
                        response: {message: 'Card not found'}
                    };
                    trelloInterface.NextCallback(err, entry, cbl);
                }
            });
        });
    }

    /* End the callback chain with the callers callback */
    if (typeof cb === 'function') {
        callbacklist.push(function (err, entry, finalcb) {
            if (err) {
                result.error = {
                    message: err.message,
                    stack: err.stack
                };

            }
            cb(err, result);
        });
    }

    // Login to Trello
    var trelloInterface = require('./trello/trello.js').Login(userAuth.key, userAuth.token);

    // Process the requests for this Trello card
    trelloInterface.Entry(trello.path, callbacklist);

};
