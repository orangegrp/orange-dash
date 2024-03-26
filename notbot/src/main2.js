const Discord = require('discord.js');
require("dotenv").config();
const nvt = require('node-virustotal');
const express = require('express');
const app = express();
app.use(express.json());
const bot = new Discord.Client();

var myip;
fetch("https://api.ipify.org/").then(res => res.text()).then(res => { myip = res.split(":")[0]; console.log("My ip address is: " + myip) });

app.use(express.static('src/notbot_good-bot'));
const defaultTimedInstance = nvt.makeAPI();
defaultTimedInstance.setKey("08051e9908c555d1b469b119f01242e9fb92e212778189764f63275c5c4ce7be")

var msgCallbacks = []

app.get('/notbot/fetchservers', (req, res) => {
    if (emptyOrNull(req.query.email) || emptyOrNull(req.query.session)) res.sendStatus(400)
    else {
        checkSession(req.query.email, req.get('user-agent').toString().substring(0, 64), req.query.session, (result) => {
            if (result) {
                checkPerms(req.query.email, perms => {
                    if (perms === true) res.send(bot.guilds.cache.toJSON())
                    else if (perms == "error") res.sendStatus(500)
                    else {
                        const resp = []
                        console.log(perms)
                        bot.guilds.cache.toJSON().forEach(guild => {
                            console.log(guild.id)
                            if (perms.includes(guild.id)) resp.push(guild)
                        })
                        res.send(resp)
                    }
                })
            }
            else res.sendStatus(401)
        });
    }

})

app.get('/notbot/fetchchannels', (req, res) => {
    if (emptyOrNull(req.query.email) || emptyOrNull(req.query.session)) res.sendStatus(400)
    else {
        checkSession(req.query.email, req.get('user-agent').toString().substring(0, 64), req.query.session, (result) => {
            if (result)
            {
                checkPerms(req.query.email, perms => {
                    if (perms === true) res.send(bot.guilds.cache.get(req.query.server).channels.cache.toJSON())
                    else if (perms == "error") res.sendStatus(500)
                    else {
                        if (perms.includes(req.query.server)) res.send(bot.guilds.cache.get(req.query.server).channels.cache.toJSON())
                        else res.sendStatus(403)
                    }
                })
            }
            else res.sendStatus(401)
        });
    }
})

app.get('/notbot/fetchmessages', (req, res) => {
    if (emptyOrNull(req.query.email) || emptyOrNull(req.query.session)) res.sendStatus(400)
    else {
        checkSession(req.query.email, req.get('user-agent').toString().substring(0, 64), req.query.session, (result) => {
            if (result) {
                var settings = {}
                if (req.query.before != null) settings.before = req.query.before
                if (req.query.after != null) settings.after = req.query.after
                bot.channels.fetch(req.query.channel)
                .then(channel => {
                    channel.messages.fetch(settings)
                    .then(messages => {
                        //console.log(messages)
                        const msgs = JSON.parse(JSON.stringify(messages))
                        /*console.log(msgs)
                        for (var i in msgs) {
                            const msg = msgs[i];
                            if (msg.attachments.length > 0) {
                                for (var ii in msg.attachments) {
                                    const att = msg.attachments[ii]
                                    console.log(att)
                                    msgs[i].attachments[ii].url = messages.get(msg.id).attachments.get(att.id).proxyURL;
                                    console.log(att)
                                }
                            }
                        }
                        */
                        res.send(msgs)
                    });
                })
            }
            else res.sendStatus(401)
        });
    }
})


app.get('/notbot/fetchmessagesnew', (req, res) => {
    if (emptyOrNull(req.query.email) || emptyOrNull(req.query.session)) res.sendStatus(400)
    else {
        checkSession(req.query.email, req.get('user-agent').toString().substring(0, 64), req.query.session, (result) => {
            if (result) {
                var done = false
                var callback = async function() {
                    if (done) return;
                    done = true
                    bot.channels.fetch(req.query.channel)
                    .then(channel => {
                        channel.messages.fetch({ "after": req.query.after })
                        .then(messages => {
                            res.send(messages)
                        });
                    })
                }
                msgCallbacks.push(callback)
                setTimeout(callback, 25000)
            }
            else res.sendStatus(401)
        });
    }
})

app.get('/notbot/fetchuser', (req, res) => {
    if (emptyOrNull(req.query.email) || emptyOrNull(req.query.session)) res.sendStatus(400)
    else {
        checkSession(req.query.email, req.get('user-agent').toString().substring(0, 64), req.query.session, (result) => {
            if (result) {
                bot.users.fetch(req.query.id)
                .then(user => {
                    res.send(user)
                })
                .catch(err => {
                    res.sendStatus(404)
                });
            }
            else res.sendStatus(401)
        });
    }
})

app.get('/notbot/fetchwebhook', (req, res) => {
    if (emptyOrNull(req.query.email) || emptyOrNull(req.query.session)) res.sendStatus(400)
    else {
        checkSession(req.query.email, req.get('user-agent').toString().substring(0, 64), req.query.session, (result) => {
            if (result) {
                bot.channels.fetch(req.query.channel)
                .then(channel => {
                    channel.messages.fetch(req.query.id)
                    .then(msg => {
                        res.send(msg.author)
                    })
                })
            }
            else res.sendStatus(401)
        });
    }
})

app.get('/notbot/fetchinternal', (req, res) => {
    if (emptyOrNull(req.query.email) || emptyOrNull(req.query.session)) res.sendStatus(400)
    else {
        checkSession(req.query.email, req.get('user-agent').toString().substring(0, 64), req.query.session, (result) => {
            if (result) {
                res.send({ "id": req.query.id, "author" : "unknown"});
            }
            else res.sendStatus(401)
        });
    }
})

app.post('/notbot/sendmessage', function(request, response) {
    if (emptyOrNull(request.body.email) || emptyOrNull(request.body.session)) response.sendStatus(400)
    else {
        checkSession(request.body.email, request.get('user-agent').toString().substring(0, 64), request.body.session, (result) => {
            if (result) {
                console.log(request.body.channel)
                console.log(request.body.message)
                bot.channels.cache.get(request.body.channel).send(request.body.message);
                response.sendStatus(200)
            }
            else res.sendStatus(401)
        });
    }
});

function checkPerms(email, callback) {
    callback(true);
}

String.prototype.replaceLast = function (what, replacement) {
    var pcs = this.split(what);
    var lastPc = pcs.pop();
    return pcs.join(what) + replacement + lastPc;
};

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

function emptyOrNull(str) {
    return str == "" || str == null || str == undefined
}
function checkSession(email, useragent, session, cb) {
    cb(true)
}

async function doMsgCalls() {
    while (msgCallbacks.length > 0) {
        msgCallbacks.shift()()
    }
}

bot.on('message', msg => {
    doMsgCalls();
});

bot.login(process.env.DISCORD_TOKEN);
app.listen(8001);