const functions = require('firebase-functions');
const { https } = require('firebase-functions');
const next = require('next');
const path = require('path');

const nextjsDistDir = path.join('..', '.next');

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
});
const nextjsHandle = nextjsServer.getRequestHandler();

exports.nextjs = https.onRequest((req, res) => {
  return nextjsServer.prepare()
    .then(() => nextjsHandle(req, res))
    .catch(error => {
      console.error('Error during request handling:', error);
      res.status(500).send('Internal Server Error');
    });
});
