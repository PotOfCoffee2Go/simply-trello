# Simply-Trello
A basic interface to Trello boards, lists, and cards. 

## Why Simply-Trello
I wanted my programs to be able to report on Trello events that needed attention by the team assigned to the board.
 The handling of the cards from that point are done by team members through the regular Trello website.

Simply-trello is not intended to provide a full Trello API feature set - but to provide a simple, data driven way
 of getting a card onto Trello or add a comment to an existing card.

### So...
 I needed to be able to easily :

* Create/update a board and the board's lists
* Add a card to a board's list
* Add/update the description for a board and card
* Add a comment to a card
* Delete a card from a board's list

Already simply-trello has a good start by using the great [node-trello](https://www.npmjs.com/package/node-trello)
 module on npm as the core interface to Trello. Please visit the site if want information about the magic happening
 under the hood.

## Quick start
I assume you already have [nodejs](http://nodejs.org/) installed and a [Trello](https://trello.com) account :)

### Install

`npm install simply-trello`

### Trello Key and Token
Your will need your Trello Key and a Token to use simply-trello.

* Browse to [https://trello.com/1/appKey/generate](https://trello.com/1/appKey/generate) that will display your Key. <br />     (the `Secret` is not needed for simply-trello).
* In the following link change `yourKey` with the key from above<br />
    `https://trello.com/1/connect?key=yourKey&name=Simply Trello&response_type=token&expiration=never&scope=read,write`<br /> (and can change the name `Simply Trello` to whatever you want.)
* `Accept` the token request and your token will be displayed

### Quick Code

Create a `try-simply-trello.js` file with the following code.  You will need to replace yourKey and yourToken with...
 you guessed it... your Key and Token. Run it `node try-simply-trello.js`

    var simplyTrello = require('simply-trello');

    simplyTrello.send (
        {key: 'yourKey', token: 'yourToken'},
        {
            path: {
                board: 'Simply Trello API Example',
                list: 'From simply-trello Example Code',
                card: 'The first example card from simply trello!'
            },
            content: {
                cardComment: 'A good friend helps you when you fall. A best friend laughs in your face and trips you again!',
            }
        }
    );

Go to [https://trello.com](https://trello.com) The `Simply Trello API Example` board should now show up on your list
 of Trello boards. Open up the board and should see a list named `From simply-trello Example Code` with a card
 `The first example card from simply trello!` which also has a comment.


## More info

The `example.js` program in `./node_modules/simply-trello` will create a Trello board that looks like
 [https://trello.com/b/Rgl3w4pO/simply-trello-api-example](https://trello.com/b/Rgl3w4pO/simply-trello-api-example).

Open the program `example.js` in an editor and change `yourKey` and `yourToken` to the real key/token.

    /* Right around line 20 */
    var userAuth = {
        key: 'yourKey',
        token: 'yourToken'
    };

Open a command window in `./node_modules/simply-trello` directory you installed simply-trello.

* Type `node example.js`

Browse to [https://trello.com](https://trello.com) and you should see a `Simply Trello API Example` board in your list
 of Trello boards. The console will display the requests and responses with Trello.

## Boards, Lists, and Cards

By examining and experimenting with `example.js` you should be able to get the idea of how to implement simply-trello
 into you own code.

Each card is accessed by a path that is composed of the board, the current list in which the card is
 contained, and the card itself. The board, list, and card are defined in the required 'path' object passed to
 simply-trello. Optionally, boards can have a description and cards can have a description as well as a comment.
 This information is provided in the 'content' object.

The `var trello` object contains two subobjects, `path` and `content`. The path has the board, list, and card names
 which are used to locate the card on Trello.

    var trello = {
        path: {
            board: 'Simply Trello API Example',
            list: 'From simply-trello',
            card: 'The first card from simply trello!'
        },

The `content` has the description and card comment texts. The content object also contains a flag that is
 used if you wish to delete the card.

        content: {
            boardDesc: 'This board was created from the simply-trello program',
            cardDesc: 'The first card is always the toughest',
            cardComment: 'A good friend helps you when you fall. A best friend laughs in your face and trips you again!',
            cardRemove: false
        }
    };

The `userAuth` and `trello` objects are passed to the `simplyTrello.send` function which sets up and executes the
 sequence of Trello API commands required to create or update the board, list, and card given in the path -
 as well as update descriptions and comment if given. To add multiple comments to a card the `simplyTrello.send`
 would have to be called again with the new comment.

    var simplyTrello = require('./simply-trello');
    simplyTrello.send (userAuth, trello, function (err, result) {
        console.log(util.inspect(result, {depth: null}));
    });

### Comments
You only need to provide the information in the `content` that you wish to update. A common task is to add a comment to
 an existing card. The `path` must always contain the board, list, and card but in this case only the `cardComment`
 field is required in the `content` object. The comment will be added to the existing comments on the card.

    content: {
        cardComment: 'A good friend helps you when you fall. A best friend laughs in your face and trips you again!',
    }

### Descriptions
Similar to card comments a description of the board and/or card can be given in the `content` object. The contents of
 the description field will replace the current description, if any.

### Removing a card
If the `content` object `cardRemove` field is present and set to true, the card will be removed from the board.

    content: {
        cardRemove: true
    }

## Result of Trello requests and responses

Because the Trello API calls are asynchronous, a callback can be provided in the call to `simplyTrello.send`
 along with the customary nodejs `err` error parameter and a `result` object which is a JSON representation of
 the requests and responses with trello. The `example.js` program displays the result on the console.

## What's next
Two features that are needed but not currently available are to be able to locate which list a card is in, and to be
 able to move a card from one list to another - these will be implemented in the future - which should complete the
 core feature set for simply-trello


 Enjoy! :)

