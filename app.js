// encodeST and decodeST are based on RegExp
// npm install express express-session multer qrcode-svg jsqr sharp  
const express = require('express');
// const express require('express';
const session = require('express-session');
const multer = require('multer');
const QRCode = require('qrcode-svg');
const jsQR = require('jsqr');
const sharp = require('sharp');

const PORT = 8080;
const HOST = '0.0.0.0';
const flag0 = 'Sorry, not this way';
const flag1ST = encodeQR(flag0);

function encodeQR(data){
  return new QRCode(msg=data, dim='1024', ecl='H').svg();
}

async function decodeQR(svg){
  try{
    const {data, info} = await sharp(new Buffer(svg)).ensureAlpha().raw().toBuffer({resolveWithObject: true});
    const output = await jsQR(new Uint8ClampedArray(data.buffer), info.width, info.height);
    return output.data;
  }catch(e){
    return null;
  }
}

const app = express();
app.use(session({
  secret: 'ssss', 
  resave: false, 
  saveUninitialized: false, 
  cookie: {maxAge: 60000}
}));
const upload = multer({dest: '/tmp/'})

app.get('/', upload.none(), (req, res) => {
  res.send(`
    <html>
    <head>
      <title>ST Code Challenge</title>
    </head>
    <body>
      <h1>ST Code Challenge</h1>
      <h2>/flag1</h2>
      <p>Can you read the flag require(ST Code?</p>
      <h2>/flag2</h2>
      <p>Can you generate ST Code to read the flag?</p>
      <h2>/source</h2>
      <p>Show source of this file</p>
    </body>
    </html>
  `);
});

app.get('/flag1', upload.none(), (req, res) => {
  res.setHeader('content-type', 'image/svg+xml');
  res.send(flag1ST);
});

app.get('/flag2', upload.none(), (req, res) => {
  res.setHeader('content-type', 'image/svg+xml');
  res.send(encodeQR(req.query.qrcode));
});

app.get('/flag3', upload.none(), (req, res) => {
  res.setHeader('content-type', 'text/plain');
  res.send(req.query.qrcode);
});

app.get('/flag', (req, res) => {
  res.setHeader('content-type', 'image/svg+xml');
  res.send(encodeQR(req.query.qrcode));
});


app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
