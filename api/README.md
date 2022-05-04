# BACKEND - RESTful APIs

Built with Node.js, Express and MongoDB database. It can be integrated with other systems via the APIs.

## Licence

The Backend has been built based on micro MVC core by Trung Huynh  

## Install required packages

`$ sudo npm install`

## Populate sameple data

User data need to populated first via API <http://localhost:8282/User/seed>

## Development mode

`$ nodemon`  
API inerfaces can be accessed from <http://localhost:8282>

## Production mode

Should use [pm2 commands](https://pm2.keymetrics.io/docs/usage/process-management/) to run the backend app.  
`$ pm2 start /path-to/server.js --name "SIT Community"`
