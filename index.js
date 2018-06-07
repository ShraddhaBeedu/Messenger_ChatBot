'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  request = require('request');
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


app.post('/', (req, res) => {
    console.log('FB PIng')
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
            let text_send = '';
	    if (event.message && event.message.text) {
		    let text = event.message.text
                    if(text === 'banana'){
		     text_send = 'I am happy';
		     }else{
                     text_send = 'I am not so happy';
                     }
                    sendTextMessage(sender,text_send)
                   // console.log('text recieved by ',text.substring(0,200))
		   // sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
	    }
    }
    res.sendStatus(200)
});

const token = "EAADFykc5934BAKdD1mXSDlUxCavZBNgNenNxUqnpZAxQJ33BDdUjUJsOrg9Dh2At2JqexlK93e24xWV3T0VMXsHh3kOr4iRgXfHd3Lw0xEnrmFBY2tAxDxzdkEK2PFwvqsRDApFUTBzgeh3ItEZBSVhnBZCABl5PyeSdj7WTd2vTyxIYmHYZA"

// Adds support for GET requests to our webhoo
app.get('/', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED,fb');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});


function sendTextMessage(sender, text) {
    
    console.log(text)
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token : token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

