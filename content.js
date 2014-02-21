localStorage.clear();

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var previousTime = -1;

preDataRecord = {
    'like': false,           //done
    'dislike': false,        //done
    'dwell_time': null,     //done
    'url': null,            //done
    'user_id': null,        //done
    'gender': null,         //done
    'geo': null             //
}


dataRecord = {
    'like': false,           //done
    'dislike': false,        //done
    'dwell_time': null,     //done
    'url': null,            //done
    'user_id': null,        //done
    'gender': null,         //done
    'geo': null             //
}

//BASE_URL = "http://ec2-174-129-119-33.compute-1.amazonaws.com"
BASE_URL = "http://127.0.0.1:5000"

$(document).on('click', '#watch-like', function () {
    dataRecord['like'] = true;
    //liked = true;

    console.log("like clicked")

})

$(document).on("click", "#watch-dislike", function(){
    dataRecord['dislike'] = true;
    //disliked = true;
    console.log("dislike clicked")
})


monitor = function () {
    dataRecord['url'] = window.location.href;


    addGenderModule = function () {
        var rawData = $.ajax({
            type: 'POST',
            url: BASE_URL + "/get_gender",
            data: JSON.stringify({"uri": window.location.href}),
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                rawData = result;

                dataRecord['gender'] = rawData.response

                myData = rawData.response
                myData = [
                    {"label": "male", "value": myData[0]},
                    {"label": "female", "value": myData[1]}
                ]
                $("#chart_cell").html('<div id="chart"><svg></svg></div>')
                $("#chart").css(
                    {
                        'height': '250px',
                        'width': '250px'
                    }
                )
                $("#gender_description_text").html('<div id="description_gender"><p>Gender of the users on this page:</p></div>').css({'font-size': 20})

                var myColors = ["#FF0000", "#0000FF"]
                d3.scale.myColors = function () {
                    return d3.scale.ordinal().range(myColors);
                };

                nv.addGraph(function () {
                    var chart = nv.models.pieChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .showLabels(false).donut(false).color(d3.scale.myColors().range()).showLegend(true);

                    d3.select("#chart svg")
                        .datum(myData)
                        .transition().duration(1200)
                        .call(chart);

                    return chart;
                });
            },
            async: false
        }).responseText;

    }

    addGeoLocation = function () {
        var rawData = $.ajax({
            type: 'GET',
            url: BASE_URL + "/get_geo",
            success: function (result) {
                console.log("hahaha" + result)
                dataRecord['geo'] = result.geo
                console.log("GEO " + result.geo)
                $("#geo_description_text").html('<br>People on this page from the same area with you:</br>').css({"font-size": 20})
                $("#geo_cell").html('<div id="description_geo"><br>' + result.geo + '%</br>').css({"font-size": 80})
            },
            async: false
        })
    }

    addTable = function () {
        $("#watch7-action-buttons").after('<table id="manipulate_content"> <tr><th id="gender_description_text" ></th> <th id="geo_description_text"></th> </tr> <tr><th id="chart_cell"></th> <th id="geo_cell"></th> </tr>')
    }

    addTable();
    addGenderModule();
    addGeoLocation();


    if (previousTime != -1){        //first time loading. ignore this record.
        var currentTime = new Date();        //Get the current time.
        var timeSpent = (currentTime - previousTime);        //Find out how long it's been.


        dataRecord['dwell_time'] = timeSpent
        previousTime = currentTime;
        console.log("You stayed " + timeSpent)

        $.ajax({
            type: 'POST',
            url: BASE_URL + "/store",
            data: JSON.stringify(preDataRecord),
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                rawData = result;
            },
            //async: false
        })

    } else{
        previousTime = new Date();
    }
    console.log("now data record = " + JSON.stringify(dataRecord))
    console.log("old record = " + JSON.stringify(preDataRecord))


}


process = function( callback){
    chrome.storage.local.get('machine-id', function (item) {
        storedMacId = item['machine-id'];
        if (!storedMacId) {
            //storedMacId = getIdFromServer()
            storedMacId = guid();
            chrome.storage.local.set({'machine-id': storedMacId});
        }
        console.log("user_id = " + storedMacId)
        macId = storedMacId;
        dataRecord['user_id'] = storedMacId

        callback()
    });
}



setInterval(function () {
    if ($("#manipulate_content").length == 0) {

        process( monitor)
        preDataRecord = jQuery.extend({},dataRecord);   //copy but not referencing

        dataRecord = {
            'like': false,           //done
            'dislike': false,        //done
            'dwell_time': null,     //done
            'url': null,            //done
            'user_id': null,        //done
            'gender': null,         //done
            'geo': null             //done
        }

    }
}, 1000); // check every second


//close tab goes here.
