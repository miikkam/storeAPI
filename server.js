const express = require('express');
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express()
app.set('port', (process.env.PORT || 80));
app.use(bodyParser.json());

const postings = require('./routes/postings')
const users = require('./routes/users')


passport.use(new BasicStrategy(
    function(username, password, done) {
     
        console.log(username + ' ' + password);
        let user = users.userlist.find(user => (user.username === username) && (bcrypt.compareSync(password, user.password))); 
        if(user != undefined) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    }
  ));

const secretKey = require('./keys.json')
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let jwtValidationOptions = {}
jwtValidationOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtValidationOptions.secretOrKey = secretKey.jwtSignKey;


passport.use(new JwtStrategy(jwtValidationOptions, function(jwt_payload, done) {
  
  const user = users.userlist.find(u => u.username === jwt_payload.user)
  done(null, user);

}));

/*
app.get('/logintest', passport.authenticate('basic', {session: false }), (req, res) => {

  res.send('Hello hello')
});
*/

app.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {

  const payloadData = {
    foo: 'bar',
    hops: 'pops',
    user: req.user.username
  };

  const token = jwt.sign(payloadData, secretKey.jwtSignKey);

  res.json({ token: token })
  
})

app.get('/jwtSecured', passport.authenticate('jwt', {session: false}), (req, res) => {

  res.json({ status: "Ok, toimii", user: req.user.username});

})  

app.use('/postings', postings)
app.use('/users', users)


module.exports = {
  start: function() {
    app.listen(app.get('port'), function() {
      console.log('Node app is running on port', app.get('port'));
    });
  },
  close: function() {
      serverInstance.close();
  }


}