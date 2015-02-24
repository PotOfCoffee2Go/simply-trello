/**
 * Created by PotOfCoffee2Go on 2/20/2015.
 */

"use strict";

var util = require('util');

/**
 * The Trello interface requires your Key and a token
 * In a web browser go to 'https://trello.com/1/appKey/generate' that will display yourKey
 * Change 'yourKey' in the link below with your Key, then in a web browser go to
 *   'https://trello.com/1/connect?key=yourKey&name=Simply Trello&response_type=token&expiration=never&scope=read,write'
 *   accept it - and it will display a token
 * Use yourKey and the token below
 *
 * @type {{key: string, token: string}}
 */
var userAuth = {
    key: 'yourKey',
    token: 'yourToken'
};

var trello = {
    /**
     * These fields are required and are the card path - board->list->card
     * If the board->list->card does not exist it will be created
     * @type {{board: string, list: string, card: string}}
     */
    path: {
        board: 'Simply Trello API Example',
        list: 'From simply-trello',
        card: 'The first card from simply trello!'
    },

    /**
     * All these fields are optional - if present then :
     *  boardDesc will change the board's description
     *  cardDesc will add or change the cards description
     *  cardComment will add a comment to the card
     *  cardRemove true will delete the card from Trello
     * @type {{boardDesc: string, cardDesc: string, cardComment: string, cardRemove: boolean}}
     */
    content: {
        boardDesc: 'This board was created from the simply-trello program on github at https://github.com/PotOfCoffee2Go/simply-trello',
        cardDesc: 'The first card is always the toughest',
        cardComment: 'A good friend helps you when you fall. A best friend laughs in your face and trips you again!',
        cardRemove: false
    }
};

/**
 * Create or update the Trello card
 * @returns JSON object of interaction with Trello for each 'content' activity done on card
 */
require('./simply-trello')(userAuth, trello, function (err, result) {
    console.log(util.inspect(result, {depth: null}));
});
