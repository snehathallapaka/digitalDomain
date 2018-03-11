'use strict';
var express  = require('express');
require('dotenv/config');
const nconf = require('nconf');
const rethinkdbdash = require('rethinkdbdash');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


const max_limit = 50000;


const port = nconf.get('app_port');
server.listen(port);

nconf
    .argv({ parseValues: true })
    .env({ parseValues: true, lowerCase: true })
    .defaults({
        rethink_database: 'hackathon',
        rethink_port: 28015,
        crate_port: 4200,
        app_port: 8080
    })
    .required([
        'rethink_database',
        'rethink_host',
        'rethink_port',
        'crate_host',
        'crate_port',
        'app_port'
    ]);

// Connect to databases
const r = rethinkdbdash({
    db: nconf.get('rethink_database'),
    servers: [
        { host: nconf.get('rethink_host'), port: nconf.get('rethink_port') }
    ],
    ssl: { rejectUnauthorized: false }
});


var connection = null;
r.connect( function(err, conn) {
    if (err) throw err;
    connection = conn;
});

app.use(express.static('client', {index:'/views/index.html'}));

app.use(function(req,res, next){
    if(/^\/v1\//.test(req.url)) {
        next();
    } else {
        res.sendFile(__dirname + '/client/views/index.html');
    }
});

const router = new express.Router();

router.get('/os',function (req,res) {
    r.table('logs').pluck({req: {headers: "user-agent"}}).distinct().run(connection,function (err,entries) {
        res.json({data:entries});
        res.status(200)
    })
});

app.use('/v1/analytics',router);

io.on('connection', function (socket) {
    socket.on('message-channel', function (data) {
        console.log(data);
    });

    r.table('logs').changes().run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.each(function (err, row) {
            if (err) throw err;
            console.log(JSON.stringify(row, null, 2));
            io.emit('newLog', row);
        });
    });
});
