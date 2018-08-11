var express   =     require("express");
var app =  express();
const PORT = process.env.PORT || 8000;
app.use(express.static(__dirname + '/public'));
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});
app.get('/app', function (req, res) {
 res.sendfile(__dirname + '/public/app.html');
});
app.listen(PORT);
console.log("Server started.");
