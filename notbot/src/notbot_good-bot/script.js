var serversDiv, channelsDiv, roomNameDiv, channelNameDiv
var servers = [], channels = [], categories = [], oldchannels = [], usercache = []
var currentserver = null
var loop1 = { "currentchannel": null, "loadingMessages": false, "loadingHistory": false, "latestMessage": null, "oldestMessage": null, "cachedmessages": [], "div": null, "failMsg": null, "req1": null, "req2": null, "req3": null, "timeout1": null, "timeout2": null, "timeout3": null }
var loop2 = { "currentchannel": null, "loadingMessages": false, "loadingHistory": false, "latestMessage": null, "oldestMessage": null, "cachedmessages": [], "div": null, "failMsg": null, "req1": null, "req2": null, "req3": null, "timeout1": null, "timeout2": null, "timeout3": null  }
var authString = ""
var nextDelay = 50
var cookie = null
var stop = false
var resizeTimer = 0
var touchstart =  { "x": 0, "y": 0, "started": false, "wrong": false, "moving": false }
var screen = { "x": 0, "y": 0, "scrollX": 0, "nowX": 0 }
var frame;
var touchSupport = false

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };


function accessCookie(cookieName)
{
  var name = cookieName + "=";
  var allCookieArray = document.cookie.split(';');
  for(var i=0; i<allCookieArray.length; i++)
  {
    var temp = allCookieArray[i].trim();
    if (temp.indexOf(name)==0)
    return temp.substring(name.length,temp.length);
     }
    return "";
}

function init() {
    cookie = accessCookie("auth")
    try { cookie = JSON.parse(cookie) }
    catch { cookie = $.QueryString }
    //if (cookie == null || cookie == undefined || cookie.email == "" || cookie.email == null || cookie.email == undefined || cookie.session == "" || cookie.session == null || cookie.session == undefined) { showLogin(); return; }
    //authString = `&email=${cookie.email}&session=${cookie.session}`
    authString = `&email=${"hi"}&session=${"hi"}`
    /*$.ajax({
        type: "POST",
        url: "https://api.topias.xyz/checksession?a=a",
        data: JSON.stringify({ "email": cookie.email, "sessionID": cookie.session }),
        dataType: "JSON",
        contentType: 'application/json',
        success: function(res) {
            console.log("session valid!")
            _init()
        },
        error: function(res) {
            console.log(res)
            showLogin()
            //document.location = "https://topias.xyz/login/?returnpath=" + document.location
        }
    });*/
    _init()
}
function logOut() {
    $.ajax({
        type: "POST",
        url: "https://api.topias.xyz/logout",
        data: JSON.stringify({ "email": cookie.email, "sessionID": cookie.session }),
        dataType: "JSON",
        contentType: 'application/json',
        success: function(res) {
            location.reload();
            /*
            serversDiv, channelsDiv, roomNameDiv, channelNameDiv
            servers = [], channels = [], categories = [], oldchannels = [], usercache = []
            currentserver = null
            if (loop1.req1 != null) { loop1.req1.abort() }
            if (loop1.req2 != null) { loop1.req2.abort() }
            if (loop1.req3 != null) { loop1.req3.abort() }
            if (loop2.req1 != null) { loop2.req1.abort() }
            if (loop2.req2 != null) { loop2.req2.abort() }
            if (loop2.req3 != null) { loop2.req3.abort() }
            if (loop1.timeout1 != null) { clearTimeout(loop1.timeout1); loop1.timeout1 = null }
            if (loop1.timeout2 != null) { clearTimeout(loop1.timeout2); loop1.timeout2 = null }
            if (loop1.timeout3 != null) { clearTimeout(loop1.timeout3); loop1.timeout3 = null }
            if (loop2.timeout1 != null) { clearTimeout(loop2.timeout1); loop2.timeout1 = null }
            if (loop2.timeout2 != null) { clearTimeout(loop2.timeout2); loop2.timeout2 = null }
            if (loop2.timeout3 != null) { clearTimeout(loop2.timeout3); loop2.timeout3 = null }
            serversDiv.innerHTML = ""
            channelsDiv.innerHTML = ""
            roomNameDiv.innerHTML = ""
            channelNameDiv.innerHTML = ""
            loop1.div.innerHTML = ""
            loop1 = { "currentchannel": null, "loadingMessages": false, "loadingHistory": false, "latestMessage": null, "oldestMessage": null, "cachedmessages": [], "div": null, "failMsg": null, "req1": null, "req2": null, "req3": null, "timeout1": null, "timeout2": null, "timeout3": null }
            loop2 = { "currentchannel": "796014313637675042", "loadingMessages": false, "loadingHistory": false, "latestMessage": null, "oldestMessage": null, "cachedmessages": [], "div": null, "failMsg": null, "req1": null, "req2": null, "req3": null, "timeout1": null, "timeout2": null, "timeout3": null  }
            authString = ""
            nextDelay = 50
            var cookie = null
            stop = true
            showLoading()
            init()
            */
        },
        error: function(error) {
            console.log(error)
        }
    });
}
function showLoading() {
    $("#loading-wrapper").html('<div id="loadingtext" style="top: calc(50% - 14px); left: calc(50% - 51px); position: absolute; z-index: 60; color: whitesmoke; font-size: 25px;">Loading...</div>')
    $("#loading-wrapper").show()
}
async function showError() {

}
function showLogin() {
    $("#loading-wrapper").css("background-color", "#101020")
    $("#loading-wrapper").css("opacity", "1")
    $("#loading-wrapper").show()
    $.ajax({
		url: "https://topias.xyz/login/",
		success: function(result){
            $("#loading-wrapper").html(result);
            noLoginRedirect = true
            afterLogin = function() {
                showLoading()
                init()
            }
        },
        error: function() {
            showError()
        }
	});
}
function _init() {
    updateServers()
    serversDiv = document.getElementsByClassName("servers")[0]
    channelsDiv = document.getElementsByClassName("channels")[0]
    roomNameDiv = document.getElementsByClassName("server-name")[0]
    channelNameDiv = document.getElementsByClassName("channel-name-big")[0]
    frame = document.getElementsByClassName("frame")[0]
    loop1.div = document.getElementsByClassName("chat")[0]
    loop2.div = document.getElementsByClassName("chat")[1]
    loop1.failMsg = failMsg
    loop2.failMsg = failMsg2

    stop = false
    updateSlow()
    updateFast()
    $('#textbox').off()
    $("#textbox").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if ($("#textbox").val().length > 0) {
                sendMessage($("#textbox").val(), loop1)    
                $("#textbox").val("")
                loop1.div.scrollTop = loop1.div.scrollHeight;
            }
        }
    });   
    $('#textboxinternal').off()
    $("#textboxinternal").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if ($("#textboxinternal").val().length > 0) {
                sendMessage($("#textboxinternal").val(), loop2)    
                $("#textboxinternal").val("")
                loop2.div.scrollTop = loop2.div.scrollHeight;
            }
        }
    }); 
    $('#chat').off()
    $('#chat').on('scroll', function() {
        var scrollTop = $(this).scrollTop();
        if (scrollTop <= 500) {
            if (!loop1.loadingHistory) { loop1.loadingHistory = true; moreMessages(loop1); }
        }
    });
    $('#chatinternal').off()
    $('#chatinternal').on('scroll', function() {
        var scrollTop = $(this).scrollTop();
        if (scrollTop <= 500) {
            if (!loop2.loadingHistory) { loop2.loadingHistory = true; moreMessages(loop2); }
        }
    });
    $(window).off()
    $(window).on("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize(window.innerWidth, window.innerHeight)
        }, 100);
    });
    window.addEventListener('touchstart', function(e) {
        touchSupport = true
        resize(window.innerWidth, window.innerHeight)
        if (!touchstart.moving) {
            console.log("event start")
            var touch = e.touches[0];
            touchstart.wrong = false
            touchstart.started = false
            touchstart.x = touch.pageX
            touchstart.y = touch.pageY
            touchstart.lastTime = Date.now()
            touchstart.lastPos = touch.pageX
            touchstart.speed = 0
        }
    }, { capture: false, passive: false });
    window.addEventListener('touchmove', function(e) {
        if (!touchstart.wrong && !touchstart.moving) {
            var touch = e.touches[0]
            if (touchstart.started) {
                e.preventDefault();
                screen.nowX = touch.pageX - touchstart.x
                frame.style.left = clamp(screen.scrollX + screen.nowX, -screen.x * 1.4, 0) + "px"
                var now = Date.now()
                timeDiff = now - touchstart.lastTime
                touchstart.lastTime = now
                touchstart.speed = average(touchstart.speed, timeDiff == 0 ? touchstart.speed : (touch.pageX - touchstart.lastPos) / timeDiff)
                touchstart.lastPos = touch.pageX
            }
            else if (Math.abs(touchstart.x - touch.pageX) > screen.x * 0.05) {
                if (Math.abs(touchstart.y - touch.pageY) < screen.x * 0.1) { touchstart.started = true; touchstart.x = touch.pageX; touchstart.y = touch.pageY }
                else if (Math.abs(touchstart.y - touch.pageY) > screen.x * 0.1) { touchstart.wrong = true }
            }
        }
    }, { capture: false, passive: false });
    window.addEventListener('touchend', function(e) {
        if (!touchstart.wrong && !touchstart.moving && touchstart.started) {
            var touch = e.touches[0];
            screen.scrollX += screen.nowX
            target = clamp(screen.scrollX + screen.nowX, -screen.x * 1.4, 0)
            touchstart.started = false
            touchstart.wrong = false
            var diffarr = [Math.abs(screen.scrollX + touchstart.speed * 100), Math.abs(screen.scrollX + screen.x * 0.7 + touchstart.speed * 100), Math.abs(screen.scrollX + screen.x * 1.4 + touchstart.speed * 100)]
            var posarr = [0, screen.x * -0.7,  screen.x * -1.4]
            screen.scrollX = posarr[diffarr.indexOf(Math.min(...diffarr))]
            touchstart.moving = true
            smooth(target, screen.scrollX, touchstart.speed)
            touchstart.speed = 0
        }
    }, { capture: false, passive: false });
    channels[loop2.currentchannel] = { "element" : null, "name" : null, "messages" : [] }
    getMessages(loop2)
    $("#loading-wrapper").css("background-color", "black")
    $("#loading-wrapper").css("opacity", "0.6")
    $("#loading-wrapper").hide()
    resize(window.innerWidth, window.innerHeight)
}

async function smooth(current, target, speed) {
    var dir = (target - current >= 0) ? 1 : -1
    var done = false
    while (!done) {
        await sleep(15)
        current += Math.abs(current - target) * dir * 0.2 + speed * 10
        speed *= 0.95
        if (((target - current) * dir) <= 5) { done = true; current = target; }
        frame.style.left = current + "px"
    }
    touchstart.moving = false
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

function average(avg, value) {
    avg -= avg / 5;
    avg += value / 5;
    return avg;
}

async function resize(width, height) {
    if (screen.x != width || screen.y != height) {
        if (width * 1.3 < height && mobileCheck() || touchSupport) {
            screen = { "x": width, "y": height, "scrollX": 0, "nowX": 0 }
            //$(".frame").css("overflow-x", "scroll")
            $(".servers").css("width", width * 0.7 / 4).css("left", "0px")
            $(".channel-wrapper").css("width", width * 0.7 / 4 * 3).css("left", width * 0.7 / 4 + "px")
            $(".chat-wrapper").css("width", width + "px").css("left", width * 0.7 + "px")
            $(".internal-chat-wrapper").css("width", width * 0.7 + "px").css("left", width * 1.7 + "px")
            $(".server").css("height", "calc(17.5vw - 15px)")
        }
    }
}

async function updateSlow() {
    while (true) {
        if (stop) break;
        await sleep(10000)
        updateServers()
        updateChannels()
    }
}

async function updateFast() {
    while (true) {
        if (stop) break;
        await sleep(nextDelay)
        if (loop1.currentchannel != null && !loop1.loadingMessages) {
            loop1.loadingMessages = true;
            checkMessages(loop1)
        }
        if (!loop2.loadingMessages) {
            loop2.loadingMessages = true;
            checkMessages(loop2)
        }
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function openServer(id) {
    if (servers[id] != null) {
        if (loop1.req1 != null) { loop1.req1.abort() }
        if (loop1.req2 != null) { loop1.req2.abort() }
        if (loop1.req3 != null) { loop1.req3.abort() }
        currentserver = id
        loop1.currentchannel = null
        loop1.div.innerHTML = ""
        channelNameDiv.innerHTML = ""
        oldchannels = []
        loop1.cachedmessages = []
        messages = []
        channels = []
        roomNameDiv.innerHTML = servers[id].tooltip.innerHTML
        updateChannels()
    }
}

function openChannel(id) {
    if (channels[id] != null) {
        if (loop1.req1 != null) { loop1.req1.abort() }
        if (loop1.req2 != null) { loop1.req2.abort() }
        if (loop1.req3 != null) { loop1.req3.abort() }
        loop1.currentchannel = id
        loop1.div.innerHTML = ""
        loop1.cachedmessages = []
        channelNameDiv.innerHTML = channels[id].name.innerHTML
        loop1.loadingMessages = true; showLoading()
        getMessages(loop1)
    }
}

async function getMessages(loop) {
    if (loop.currentchannel != null) {
        if (loop.timeout1 != null) {
            clearTimeout(loop.timeout1)
            loop.timeout1 = null
        }
        loop.req1 = $.getJSON(apiurl + "/notbot/fetchmessages?channel=" + loop.currentchannel + authString + "&random=" + Math.random() * 100, function(data) {
            data.reverse().forEach(message => {
                if (loop.cachedmessages[message.id] != true) {
                    createMessage(message, false, loop)
                }
            });
            loop.loadingMessages = false; if (stop) return; $('#loading-wrapper').hide(); $('#loading-wrappertext').html("Loading...")
            setTimeout(function() { loop.div.scrollTop = loop.div.scrollHeight; }, 100);
            setTimeout(function() { loop.div.scrollTop = loop.div.scrollHeight; }, 500);
        }).fail(loop.failMsg);
        loop.timeout1 = setTimeout(function(){ loop.req1.abort(); }, 5000);
    }
}
function failMsg() {
    loop1.loadingMessages = false;
    if (stop) return
    $('#loading-wrappertext').html("Connection Lost. Reconnecting...")
    $('#loading-wrapper').show()
}
function failMsg2() {
    loop2.loadingMessages = false;
    if (stop) return
    $('#loading-wrappertext').html("Connection Lost. Reconnecting...")
    $('#loading-wrapper').show()
}
async function moreMessages(loop) {
    if (loop.timeout2 != null) {
        clearTimeout(loop.timeout2)
        loop.timeout2 = null
    }
    if (loop.currentchannel != null) {
        loop.req2 = $.getJSON(apiurl + "/notbot/fetchmessages?channel=" + loop.currentchannel + "&before=" + loop.oldestMessage + authString + "&random=" + Math.random() * 100, function(data) {
            data.forEach(message => {
                if (loop.cachedmessages[message.id] != true) {
                    createMessage(message, true, loop)
                }            
            });
            loop.loadingHistory = false; if (stop) return; $('#loading-wrapper').hide(); $('#loading-wrappertext').html("Loading...")
        }).fail(loop.failMsg);
        loop.timeout2 = setTimeout(function(){ loop.req2.abort(); }, 5000);
    }
}
async function checkMessages(loop) {
    if (loop.timeout3 != null) {
        clearTimeout(loop.timeout3)
        loop.timeout3 = null
    }
    if (loop.currentchannel != null) {
        loop.req3 = $.getJSON(apiurl + "/notbot/fetchmessagesnew?channel=" + loop.currentchannel + "&after=" + loop.latestMessage + authString + "&random=" + Math.random() * 100, function(data) {
            data.reverse().forEach(message => {
                if (loop.cachedmessages[message.id] != true) {
                    createMessage(message, false, loop)
                }            
            });
            loop.loadingMessages = false; if (stop) return; $('#loading-wrapper').hide(); $('#loading-wrappertext').html("Loading...")
        }).fail(loop.failMsg);
        loop.timeout3 = setTimeout(function(){ loop.req3.abort(); }, 30000);
    }
}

async function sendMessage(message, loop) {
    if (loop.currentchannel != null) {
        $.ajax
        ({
            type: "POST",
            url: apiurl + '/notbot/sendmessage',
            dataType: 'json',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify({ "message": message.split("\\n").join("\n"), "channel": loop.currentchannel, "email": authString.split("&email=")[1].split("&session=")[0], "session": authString.split("&session=")[1] }),
            success: function () {

            }
        });
    }
}

async function createMessage(message, top, loop) {
    var element = document.createElement("div")
    var name = document.createElement("div")
    var icon = document.createElement("img")
    var content = document.createElement("div")
    var textWrapper = document.createElement("div")
    content.className = "message-content"
    element.className = "message"
    name.className = "name"
    name.oncontextmenu = function() { $('#textbox').val($('#textbox').val() + "<@" + message.authorID + ">"); $('#textbox').focus(); return false; }
    icon.className = "user-icon"
    textWrapper.className = "message-wrapper"

    var msg = message.cleanContent.split("\n").join("<br>")

    var getPosition = function(string, subString, index) {
        var out = string.split(subString, index).join(subString).length;
        return out >= string.length ? -1 : out
    }
    var replaceAt = function(string, index, length, put) {
        return string.substr(0, index) + put + string.substr(index + length);
    }
    var doTempReplaces = function(string) {
        return string.split("*").join("\v\0\b").split("_").join("\v\b\0")
    }
    var doTempReplaces2 = function(string) {
        return string.split("\\*").join("\v\0\b").split("\\**").join("\v\0\b\v\0\b").split("\\***").join("\v\0\b\v\0\b\v\0\b").split("\\_").join("\v\b\0").split("\\__").join("\v\b\0\v\b\0")
    }
    var canceltempReplaces = function(string) {
        return string.split("\v\0\b").join("*").split("\v\b\0").join("_")
    }
    var doReplaces = function(string, from, start, end) {
        var done = false
        var replaceLength = from.length
        while (!done) {
            var startPos = getPosition(string, from, 1)
            if (startPos == -1) {
                return string
            }
            else {
                if (string.substr(startPos + replaceLength, getPosition(string, from, 2) - 1).replace(" ", "") == "") {
                    string = replaceAt(string, startPos, replaceLength, doTempReplaces(from))
                }
                else {
                    if (getPosition(string, from, 2) == -1) {
                        return string
                    }
                    else {
                        string = replaceAt(string, startPos, replaceLength, start)
                        string = replaceAt(string, getPosition(string, from, 1), replaceLength, end)
                    }
                }
            }
        }
    }
    var out = canceltempReplaces(doReplaces(doReplaces(doReplaces(doReplaces(doReplaces(doReplaces(doReplaces(doReplaces(doTempReplaces2(msg), "```", "<div class='codeblock'>", "</div>"), "`", "<p class=\"codeblock\">", "</p>"), "~~", "<s>", "</s>"), "__", "<u>", "</u>"), "_", "<i>", "</i>"), "***", "<i><b>", "</b></i>"), "**", "<b>", "</b>"), "*", "<i>", "</i>"))
    content.innerHTML = out
    //content.innerHTML = message.cleanContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
    element.appendChild(icon)
    textWrapper.appendChild(name)
    if (message.type != "GUILD_MEMBER_JOIN") textWrapper.appendChild(content)
    element.appendChild(textWrapper)
    name.innerHTML = "Loading..."
    icon.src = "loader.gif"
    if (loop.cachedmessages[message.id] == true) {
        return
    }
    if (top) { 
        loop.div.insertBefore(element, loop.div.firstChild)
        channels[loop.currentchannel].messages.push(message)
        if (loop.latestMessage == null) loop.latestMessage = message.id
        loop.oldestMessage = message.id
    }
    else {
        scroll = (loop.div.scrollHeight - loop.div.scrollTop - loop.div.clientHeight < 1)
        loop.div.appendChild(element)
        channels[loop.currentchannel].messages.unshift(message)
        if (scroll) loop.div.scrollTop = loop.div.scrollHeight;
        loop.latestMessage = message.id
        if (loop.oldestMessage == null) loop.oldestMessage = message.id
    }
    loop.cachedmessages[message.id] = true
    getUser(message.authorID, async function(user) {
        name.innerHTML = user.tag
        if (message.type == "GUILD_MEMBER_JOIN") name.innerHTML += " &nbsp;<span style='color: #00ff00'>Joined!</span>";
        icon.src = user.displayAvatarURL
        return
    }, message.webhookID, message.id, loop.currentchannel, message.type == "GUILD_MEMBER_JOIN");
}
async function getUser(id, callback, webID, msgID, channel, noUnknown) {
    if (webID != null) {
        $.ajax({
            url: apiurl + "/notbot/fetchwebhook?id=" + msgID + "&channel=" + channel + authString + "&random=" + Math.random() * 100,
            dataType: "json",
            success: function(data) {
                //usercache[id] = { "time": Math.floor((new Date()).getTime() / 1000), "user": data }
                callback({ "tag": data.username + " [WebHook]", "displayAvatarURL": data.displayAvatarURL })
            },
            error: function(event, error, exception) {
                callback({ "tag": error, "displayAvatarURL": "https://cdn.discordapp.com/embed/avatars/1.png" })
            }
        })
    }
    else {
        $.ajax({
            url: apiurl + "/notbot/fetchuser?id=" + id + authString + "&random=" + Math.random() * 100,
            dataType: "json",
            success: function(data) {
                if (data.id == 964949389938405426) {
                    var _data = data
                    $.ajax({
                        url: apiurl + "/notbot/fetchinternal?id=" + msgID + authString + "&random=" + Math.random() * 100,
                        dataType: "json",
                        success: function(data) {
                            if (noUnknown)  callback({ "tag": _data.tag, "displayAvatarURL": _data.displayAvatarURL })
                            else callback({ "tag": _data.tag + " &nbsp;<font size=2>" + data.author + "</font>", "displayAvatarURL": _data.displayAvatarURL })
                        },
                        error: function(event, error, exception) {
                            callback({ "tag": error, "displayAvatarURL": "https://cdn.discordapp.com/embed/avatars/1.png" })
                        }
                    })
                }
                else  {
                    usercache[id] = { "time": Math.floor((new Date()).getTime() / 1000), "user": data }
                    callback(data)
                }
            },
            error: function(event, error, exception) {
                callback({ "tag": error, "displayAvatarURL": "https://cdn.discordapp.com/embed/avatars/1.png" })
            }
        })
    }
}
function updateChannels() {
    if (currentserver != null) {
        $.getJSON(apiurl + "/notbot/fetchchannels?server=" + currentserver + authString + "&random=" + Math.random() * 100, function(data) {
            if (oldchannels != data) {
                channelsDiv.innerHTML = ""
                data = data.sort((a, b) => a - b)
                data.forEach(channel => {
                    if (channel.type == "category") createCategory(channel)
                    else if (channel.parentID == null) createChannel(channel)
                });
                data.forEach(channel => {
                    if ((channel.type == "text" || channel.type == "voice") && channel.parentID != null) createChannel(channel)
                });
                oldchannels = data
                $('#loading-wrapper').hide(); $('#loading-wrappertext').html("Loading...")
            }
        }).fail(failMsg);
    }
}
function createCategory(channel) {
    var element = document.createElement("div")
    var name = document.createElement("div")
    name.className = "category-name"
    element.className = "category"
    name.innerHTML = channel.name.toLowerCase()
    element.appendChild(name)
    channelsDiv.appendChild(element)
    categories[channel.id] = { "element" : element, "name" : name }
}
function createChannel(channel) {
    var element = document.createElement("div")
    var name = document.createElement("div")
    element.onclick = function() { openChannel(channel.id); }
    name.className = "channel-name"
    element.className = "channel"
    if (channel.type == "voice") name.innerHTML = "🔊" + channel.name
    else if (channel.type == "text") name.innerHTML = "<b>#</b> " + channel.name
    element.appendChild(name)
    if (channel.parentID != null) categories[channel.parentID].element.appendChild(element)
    else { element.className = "channel channel-wide"; channelsDiv.appendChild(element) }
    channels[channel.id] = { "element" : element, "name" : name, "messages" : [] }
}

function updateServers() {
    $.getJSON(apiurl + "/notbot/fetchservers" + "?random=" + Math.random() * 100 + authString, function(data) {
        data.forEach(server => {
            if (servers[server.id] != null) updateServerIcon(server)
            else createServerIcon(server)
        });
        $('#loading-wrapper').hide(); $('#loading-wrappertext').html("Loading...")
    }).fail(failMsg);
}
function updateServerIcon(server) {
    serverlocal = servers[server.id]
    if (server.iconURL != null) {
        if (server.iconURL != serverlocal.icon.src) {
            serverlocal.icon.src = server.iconURL
            serverlocal.nameAcronym.innerHTML = ""
        }
    }
    else {
        if (server.nameAcronym != serverlocal.nameAcronym.innerHTML) {
            serverlocal.icon.src = ""
            serverlocal.nameAcronym.innerHTML = server.nameAcronym
        }
    }
    if (server.name != serverlocal.tooltip.innerHTML) serverlocal.tooltip.innerHTML = server.name
}
function createServerIcon(server) {
    var element = document.createElement("div")
    var nameAcronym = document.createElement("div")
    var iconWrapper = document.createElement("div")
    var icon = document.createElement("img")
    var tooltip = document.createElement("nobr")
    element.onclick = function() { openServer(server.id); }
    nameAcronym.className = "server-acronym"
    iconWrapper.className = "icon-wrapper"
    tooltip.className = "tooltiptext"
    element.className = "server"
    icon.className = "server-icon"
    if (server.iconURL != null) icon.src = server.iconURL
    else { nameAcronym.innerHTML = server.nameAcronym; iconWrapper.appendChild(nameAcronym); }
    tooltip.innerHTML = server.name
    iconWrapper.appendChild(icon)
    element.appendChild(iconWrapper)
    element.appendChild(tooltip)
    serversDiv.appendChild(element)
    servers[server.id] = { "element" : element, "nameAcronym" : nameAcronym, "icon" : icon, "tooltip" : tooltip }
}
