//BASE_URL = "http://ec2-174-129-119-33.compute-1.amazonaws.com"
//BASE_URL = "http://127.0.0.1:5000"


dataRecord = {
    'like': false,           //done
    'dislike': false,        //done
    'dwell_time': null,     //done
    'url': null,            //done
    'user_id': null,        //done
    'gender': null,         //done
    'geo': null,             //
    'social_media': null,
    'condition': null,
    'participant': null,
    'time': null,
    'login': null
}

surveyTaken = false

$(document).on('click', '#watch-like', function () {
    dataRecord['like'] = true;
    console.log("like clicked")
})

$(document).on("click", "#watch-dislike", function () {
    dataRecord['dislike'] = true;
    console.log("dislike clicked")
})

var socialMediaList = [
    ".share-service-icon.share-service-icon-facebook",
    ".share-service-icon.share-service-icon-twitter",
    ".share-service-icon.share-service-icon-googleplus",
    ".share-service-icon.share-service-icon-blogger",
    ".share-service-icon.share-service-icon-reddit",
    ".share-service-icon.share-service-icon-tumblr",
    ".share-service-icon.share-service-icon-pinterest",
    ".share-service-icon.share-service-icon-linkedin"
]

for (var i = 0; i < socialMediaList.length; i++) {
    socialMedia = socialMediaList[i]
    $(document).on('click', socialMedia, function (e) {
        className = e.target.className
        name = className.slice(1 + className.lastIndexOf("-"), className.length)
        dataRecord.social_media = name
    })
}

monitor = function (user_id) {
    dataRecord['url'] = window.location.href;
    addInfoModule = function () {
        var rawData = $.ajax({
            type: 'POST',
            url: BASE_URL + "/get_page_config",
            data: JSON.stringify({"uri": window.location.href, "user_id": user_id}),
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                rawData = result;
                console.log("printing before send " + rawData)
                if (rawData.response == "Need Survey") {
                    //resubmit local info to server
                    chrome.storage.local.get('survey', function (result) {
                        console.log("local copy of survey = ", result.survey)
                        $.ajax({
                            type: 'POST',
                            url: BASE_URL + "/store_survey",
                            data: JSON.stringify(result.survey),
                            crossDomain: true,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (result) {
                                rawData = result;
                                console.log("update successfully")
                            }
                        })
                    })
                    return;
                }
                dataRecord['gender'] = rawData.gender
                dataRecord['geo'] = result.geo

                if ($("#yt-masthead-user-displayname") == null || $("#yt-masthead-user-displayname").length==0){
                    dataRecord['login'] = false;
                }else{
                    dataRecord['login'] = true;
                }

                condition = rawData.condition
                gender = rawData.gender

                dataRecord['condition'] = condition

                if (condition == 'location') {
                    $("#watch7-action-buttons").after('<div id="geo_cell" class="manipulate_content"></div>')
                    console.log("adding location bar")
                    addLocationChart(rawData.geo)
                } else if (condition == 'control') {
                    $("#watch7-action-buttons").after('<div id="empty_cell" class="manipulate_content"></div>')
                    console.log("adding empty cell")
                } else if (condition == "gender_more" || condition == "gender_normal" || condition == 'gender_less') {
                    $("#watch7-action-buttons").after('<div id="gender_cell" class="manipulate_content"></div>')
                    console.log("adding gender bar")
                    addGenderChart(rawData.gender.scale, rawData.gender)
                }

            },
            error: function (jqXHR, exception) {
                console.log(exception)
            },
            async: false
        }).responseText;

    }
    addInfoModule();
}

var storedMacId = "";
process = function (callback) {
    chrome.storage.local.get('user_id',
        function (result) {
            if (!('user_id' in result)) {
                storedMacId = my_guid();
                chrome.storage.local.set({'user_id': storedMacId});
            } else {
                storedMacId = result['user_id']
            }
            dataRecord['user_id'] = storedMacId
            callback(storedMacId)
        });
}

window.onbeforeunload = function (evt) {
    console.log("Closing window...")
    var currentTime = new Date().getTime();        //Get the current time.
    var timeSpent = (currentTime - previousTime);        //Find out how long it's been.
    dataRecord['time'] = previousTime
    previousTime = currentTime;
    dataRecord['dwell_time'] = timeSpent
    chrome.extension.sendRequest({ msg: "saveRecordInBackground", dataRecord: dataRecord});
    console.log("Finished sending command to background")
}


var previousTime;
$(document).ready(function () {
    // check survey whenever a page is loaded
    chrome.storage.local.get('survey',
        function (result) {
            if (!('survey' in result)) {
                chrome.extension.sendRequest({ msg: "startFunc" });
            } else {
                previousTime = new Date().getTime()
                process(monitor)   //first time
                condition = result.survey.condition
                setInterval(function () {
                    // begin adding elements if it's 1) not control condition. 2) In Youtube watch page. 3)Not added yet
                    if ($(".manipulate_content").length == 0 && window.location.href.indexOf("watch\?v=") != -1) {
                        //Per Mor's request, we DONOT transmit User info each time
                        //dataRecord['participant'] = result.survey

                        process(monitor)

                        var currentTime = new Date().getTime();        //Get the current time.
                        var timeSpent = (currentTime - previousTime);        //Find out how long it's been.
                        previousTime = currentTime;

                        dataRecord['dwell_time'] = timeSpent
                        dataRecord['time'] = currentTime
                        console.log("You stayed " + timeSpent)
                        console.log("now data record = " + JSON.stringify(dataRecord))

                        //only post for records more than 2 seconds. Since less than 2 seconds are noise.
                        if (timeSpent > 2000) {
                            $.ajax({
                                type: 'POST',
                                url: BASE_URL + "/store_record",
                                data: JSON.stringify(dataRecord),
                                crossDomain: true,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (result) {
                                    rawData = result;
                                }
                                //async: false
                            })
                        } else {
                            console.log('junk... abandoning')
                        }

                        dataRecord = {
                            'like': false,           //done
                            'dislike': false,        //done
                            'dwell_time': null,     //done
                            'url': null,            //done
                            'user_id': null,        //done
                            'gender': null,         //done
                            'geo': null,            //done
                            'social_media': null,
                            'condition': null,
                            'participant': null,
                            'time':null,
                            'login': null
                        }
                    }
                }, 1000); // check every second
            }
        });
})

