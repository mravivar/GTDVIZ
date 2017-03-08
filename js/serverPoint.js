var express = require('express')
var app = express()
var DBHelper=require('./DBHelper');

app.use('/js', express.static(__dirname + '/js'));

app.get('/test', function (req, res) {
  console.log('came to test Call!');
  res.send('Hello World!')
})
app.get('/', function(req, res){
  console.log('Supplying the index file');
    res.sendFile('index.html', { root: __dirname } );
});

app.get('/getData', function (req, res) {
  console.log('getData() called.');
  DBHelper.aggregateEventsByYear(function(docs){
      res.send(docs)
      console.log('response sent');
  });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
