
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

getMachineID = function () {
    chrome.storage.local.get('machine-id', function(item){
        var storedMacId = item['machine-id'];
        console.log("tmp id = "+storedMacId)
        if(!storedMacId) {
            console.log("before get " + storedMacId)
            //storedMacId = getIdFromServer()
            storedMacId = guid();
            console.log("after get " + storedMacId)
            chrome.storage.local.set({'machine-id':storedMacId});

        }
        console.log("id = " + storedMacId)
        macId = storedMacId;
    });
}
getMachineID();



dataRecord = {
    'like': null,
    'dislike': null,
    'dwell_time': null,
    'url': null,
    'user_id': null,
    'gender': null,
    'geo': null
}

dataRecord['url'] = window.location.href;
dataRecord['url'] = getMachineID();
console.log( JSON.stringify(dataRecord) )


var startTime = new Date();        //Start the clock!
$(window).on('beforeunload', function() {
    var endTime = new Date();        //Get the current time.
    var timeSpent=(endTime - startTime);        //Find out how long it's been.
    dataRecord['dwell_time'] = timeSpent

})


//listeners
//click like
$("#watch-like").bind("click", function(){
    dataRecord['like'] = true;
})

//click dislike
$("#watch-dislike").bind("click", function(){
    dataRecord['dislike'] = true;
})







addGenderModule = function(){
    var rawData = $.ajax({
        type : 'POST',
        url :"http://127.0.0.1:5000/get_gender",
        data : JSON.stringify({"uri": window.location.href}),
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            console.log("wtf")
            rawData = result;
            myData = rawData.response
            myData = [{"label": "male", "value": myData[0]}, {"label":"female", "value":myData[1]}]
            $("#chart_cell").html('<div id="chart"><svg></svg></div>')
            $("#chart").css(
                {
                    'height':'250px',
                    'width': '250px'
                }
            )
            $("#gender_description_text").html('<div id="description_gender"><p>Gender of the users on this page:</p></div>').css({'font-size':20})

            var myColors = ["#FF0000", "#0000FF"]
            d3.scale.myColors = function() {
                return d3.scale.ordinal().range(myColors);
            };

            nv.addGraph(function() {
                var chart = nv.models.pieChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
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

addGeoLocation = function(){
    $("#geo_description_text").html('<br>People on this page from the same area with you:</br>').css({"font-size":20})
    $("#geo_cell").html('<div id="description_geo"><br>84%</br>').css({"font-size":80})
}

addTable = function(){
    $("#watch7-action-buttons").after('<table> <tr><th id="gender_description_text" ></th> <th id="geo_description_text"></th> </tr> <tr><th id="chart_cell"></th> <th id="geo_cell"></th> </tr>')
}




addTable();
addGenderModule();
addGeoLocation();



