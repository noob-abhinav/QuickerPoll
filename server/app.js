const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('./helpers/cors');
const PollRoute = require('./api/routes/PollRoute');
const app = express();
const path = require('path');


// Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '../client/build/index.html'));
// });

// middlewares
app.use(cors);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api/polls', PollRoute);
app.get('/getIP', getClientIP);

function getClientIP(req, res, next) {
  try {
    var IPs = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    if (IPs.indexOf(":") !== -1) {
      IPs = IPs.split(":")[IPs.split(":").length - 1]
    }

    return res.json({ IP: IPs.split(",")[0] });
  } catch (err) {
    return res.json({ message: 'got error' });
  }

}


// error handling
app.use((req, res, next) => {
  const error = new Error('404 not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: error.message
  })
});


// Server Side Routing
// If no API routes are hit, send the React app
app.use(express.static('client/build'));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

// const router = express.Router();
// app.get('/*', function(req, res) {
// 	res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

module.exports = app;