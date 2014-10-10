7digital-gracenote-radio
========================

Radio streaming with 7digital and Gracenote integration.

The matching of 7digita-Gracenote is on the US catalogue so you need to always pass the &country=US parameter to all the calls to 7digital.

Example: http://api.7digital.com/1.2/artist/chart?oauth_consumer_key=YOUR_KEY_HERE&country=US

Pre-requisites: [nodejs + npm](http://nodejs.org)

To install run: 
```bash
npm install
bower install
```

Configure the following environment variables:
```bash
export GRACENOTE_CLIENT_ID="YOUR-CLIENT-ID"
export SEVENDIGITAL_CONSUMER_KEY="YOUR-CONSUMER-KEY"
export SEVENDIGITAL_CONSUMER_SECRET="YOUR-CONSUMER-SECRET"
```

To run the server: 
```bash
npm start
```

A new server will be executed on http://localhost:3000
