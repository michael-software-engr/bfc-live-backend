
import express from 'express';
import path from 'path';

import dotenv from 'dotenv';

import Twit from 'twit';
import bodyParser from 'body-parser';

dotenv.config();

let app = express();

/* eslint-disable key-spacing */
const twitter = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms:           60 * 1000,  // optional HTTP request timeout to apply to all requests.
});
/* eslint-enable */

app.set('port', (process.env.PORT || 5000));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('pages/index');
});

app.get('/api/tweet', (req, res) => {
  console.log({ origin: req.headers, body: req.body });
  const tweet = `Hello ${Math.random()}`;

  twitter.post('statuses/update', { status: tweet }, (err, data, response) => {
    if (err) throw Error(err);
    console.log({ data, response });

    res.header('Content-Type', 'application/json');
    res.json(JSON.stringify({ tweet, success: true }));
  });
});

app.post('/api/tweet', (req, res) => {
  console.log({ origin: req.headers, body: req.body });
  const tweet = `${req.body.tweet} ${Math.random()}`;

  twitter.post('statuses/update', { status: tweet }, (err, data, response) => {
    if (err) throw Error(err);
    console.log({ data, response });

    res.header('Content-Type', 'application/json');
    res.json(JSON.stringify({ tweet, success: true }));
  });
});

app.listen(app.get('port'), () => {
  console.log('# ... Node app is running on port', app.get('port'));
});
