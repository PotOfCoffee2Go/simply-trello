# simply-trello
A basic interface to Trello boards, lists, and cards. 

I wanted my programs to be able to report on Trello events that needed attention by the team assigned to the board. The handling of the board/lists/cards from that point are done by team members through the regular Trello website.

Simply-trello is not intended to provide a full Trello API feature set - but to provide a simple way of getting a card onto Trello.

### So...
 I needed to be able to :

* Create/update a board and the board's lists
* Add a card to a board's list
* Add/update the description for a board and card
* Add a comment to a card
* Delete a card from a board's list

A feature that is needed but not currently available is Moving a card from one list to another - but will be implemented in the future - which will complete the feature set for simply-trello (maybe in another project `complex-trello` will add setting colors and such :)

Already has a good start by using the great [node-trello](https://www.npmjs.com/package/node-trello) module on npm as the core interface to Trello.

## Quick start
The `example.js` program in the project home directory will create a Trello board that looks like [https://trello.com/b/Rgl3w4pO/simply-trello-api-example](https://trello.com/b/Rgl3w4pO/simply-trello-api-example).

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

Browse to [https://trello.com](https://trello.com) and should see a `Simply Trello API Example` board in your list of Trello boards.

