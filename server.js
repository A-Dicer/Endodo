//----------------------------- Requirements --------------------------------------------
const express     = require("express");
const bodyParser  = require("body-parser");
const routes      = require("./routes");


//------------------------------- Express -----------------------------------------------
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("client/build"));
app.use(routes);


//----------------------------- Start Server --------------------------------------------
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, function(err) { 
  if (err) console.log(err); 
  else console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`); 
});

