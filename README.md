# simply-trello
A basic interface to Trello boards, lists, and cards. 

I wanted my programs to be able to report on Trello events that needed attention by the team assigned to the board.
 The handling of the board/lists/cards from that point are done by team members through the regular Trello website.

Simply-trello is not intended to provide a full Trello API feature set - but to provide a simple way of getting
 a card onto Trello.

### So...
 I needed to be able to :

* Create/update a board and the board's lists
* Add a card to a board's list
* Add/update the description for a board and card
* Add a comment to a card
* Delete a card from a board's list

Two features that are needed but not currently available the ability to locate which list a card is in, and moving
 a card from one list to another - these will be implemented in the future - which should complete the feature set
 for simply-trello (maybe in another project `complex-trello` will add setting colors and such :)

Already simply-trello has a good start by using the great [node-trello](https://www.npmjs.com/package/node-trello)
 module on npm as the core interface to Trello.

## Quick start
The `example.js` program in the project home directory will create a Trello board that looks like
 [https://trello.com/b/Rgl3w4pO/simply-trello-api-example](https://trello.com/b/Rgl3w4pO/simply-trello-api-example).

I assume you already have [nodejs](http://nodejs.org/) installed and a [Trello](https://trello.com) account :)

Fork or download code from github at [Simply-Trello](https://github.com/PotOfCoffee2Go/simply-trello)

Your will need your Trello Key and a Token to use simply-trello.

* Browse to [https://trello.com/1/appKey/generate](https://trello.com/1/appKey/generate) that will display your Key. <br />     (the `Secret` is not needed for simply-trello).
* In the following link change `yourKey` with the key from above<br />
    https://trello.com/1/connect?key=**yourKey**&name=Simply Trello&response_type=token&expiration=never&scope=read,write<br /> (and can change the name `Simply Trello` to whatever you want.)
* `Accept` the token request and your token will be displayed

Open the program `example.js` in an editor and change `yourKey` and `yourToken` to the real key/token

    /* Right around line 20 */
    var userAuth = {
        key: 'yourKey',
        token: 'yourToken'
    };

Open a command window in the home directory you put simply-trello. 

* Type `npm install`
* Type `node example.js`

Browse to [https://trello.com](https://trello.com) and should see a `Simply Trello API Example` board in your list
 of Trello boards.

## Boards, Lists, and Cards

By examining and experimenting with `example.js` you should be able to get the idea of how to implement simply-trello
 into you own code.

Each card is accessed by a path that is composed of the board that contains it, the current list in which the card is
 contained, and the card itself. The board, list, and card are defined in the required 'path' object passed to
 simply-trello. Optionally, boards can have a description and cards can have a description and as well as comments.
 This information is provided in the 'content' object.

The `var tello` object contains two subobjects, `path` and `content`. The path has the board, list, and card names
 which are used to locate the card on Trello.

    path: {
        board: 'Simply Trello API Example',
        list: 'From simply-trello',
        card: 'The first card from simply trello!'
    },

While the content had the description and card comment texts. The content object also contains the flag that can
 be used to delete the card.

    content: {
        boardDesc: 'This board was created from the simply-trello program on github at https://github.com/PotOfCoffee2Go/simply-trello',
        cardDesc: 'The first card is always the toughest',
        cardComment: 'A good friend helps you when you fall. A best friend laughs in your face and trips you again!',
        cardRemove: false
    }

The userAuth and trello objects are passed to the `trelloapi` function which sets up and executes the sequence of
 Trello API commands required to create or update the board, list, and card given in the path - as well as update
 descriptions and comment if given. To add multiple comments to a card the `trelloapi` would have to be called
 again with the new comment.


    require('./trello/trelloapi')(userAuth, trello, function (err, result) {
        console.log(util.inspect(result, {depth: null}));
    });

Because the Trello API calls are asynconous a callback can be provided which returns an object containing the request/response information that simply-trello preformed with Trello.
