//BASE_URL = "http://ec2-174-129-119-33.compute-1.amazonaws.com"

function createNotification() {
    //var opt = {type: "basic",title: "Thanks!",message: " (On the up-right corner of your chrome)",iconUrl: "icon.png"}
    var opt = {type: "image", title: "Thanks!", message: "You've successfull", imageUrl: chrome.runtime.getURL("icon.png")}
    var options = null;

    options = {
        type: "image",
        title: "Installation Successfully",
        message: "You've successfully installed the extension for the experiment! Please fill out the survey by clicking the bear icon in the tool bar"
    }
    options.imageUrl = chrome.runtime.getURL("/images/instruction.png");
    options.iconUrl = "icon.png"    // This is a must...

    chrome.notifications.create("abc", options, function () {
        console.log("suc" + "a")
    });
}

chrome.storage.local.get('survey', function (result) {
    if (!('survey' in result)) {
        createNotification();
    }
})


chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.msg == "startFunc") notifySurvey();
    }
);

var notifyInterval = 5
var countDown = notifyInterval;
function notifySurvey() {
    console.log("CountDown = " + countDown)
    var options = null;
    options = {
        type: "image",
        title: "Please take the survey!",
        priority: 2,
        message: "You've successfully installed the extension for the experiment! But we need your finishing the survey to proceed the experiment. Please fill out the survey by clicking the bear icon in the tool bar"
    }
    options.imageUrl = chrome.runtime.getURL("/images/instruction.png");
    options.iconUrl = "icon.png"    // This is a must...
    countDown = countDown - 1;  //every five times annoy the user once.
    if (countDown == 0) {
        chrome.notifications.clear('abc', function () {
        })
        chrome.notifications.create("abc", options, function () {
            console.log("Should pop now!" + "a")
        });
        countDown = notifyInterval;
    }
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.msg == "saveRecordInBackground") {
            console.log("received")
            dataRecord = request.dataRecord
            chrome.storage.local.get('survey',
                function (result) {
                    if('survey' in result){
                        previousTime = new Date()
                        condition = result.survey.condition
                        dataRecord['participant'] = result.survey
                        $.ajax({
                            type: 'POST',
                            url: BASE_URL + "/store_record",
                            data: JSON.stringify(dataRecord),
                            crossDomain: true,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (result) {
                                rawData = result;
                            },
                            async: false
                        })
                    }
                })

        }
    }
);

