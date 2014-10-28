7digital-gracenote-radio
========================
[ ![Codeship Status for bettiolo/7digital-gracenote-radio](https://codeship.io/projects/607f09d0-40e2-0132-1a3f-265751b913a8/status)](https://codeship.io/projects/44002)

Radio streaming with 7digital and Gracenote integration.

## Pre-requisites

[nodejs + npm](http://nodejs.org)

## Running the server

To install run: 
```bash
npm install
```

Configure the following environment variables in production:
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

## Running the tests

Configure the following environment variables to run tests:
```bash
export GRACENOTE_TEST_USER_ID="YOUR-USER-ID"
```

There are two ways of running the tests:
- Option 1: Start the server with `npm start` and then run the tests with `npm test`
- Option 2: Run `./run-specs.sh`

The second option will run a local server, run the tests and kill the server and return.

## Deployment

The deployment happens automatically on every git push to this repository.

Codeship.io will:
- Wait for a push
- Create a new vm
- Clone the changes to the build agent
- Install `nodejs`
- Run `npm install`
- Run the tests
- Deploy to heroku
- Hit the api's status endpoint
