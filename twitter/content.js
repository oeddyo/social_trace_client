console.log("ha")

$(document).on('DOMNodeInserted', function(e) {
    if (e.target.className=='js-account-summary account-summary js-actionable-user '){
        var jqueryItem = $(e.target)
        jqueryItem.find(".metadata.social-context").each(function(index, value){
            var res = $.ajax({
                type : "GET",
                url :"http://127.0.0.1:5000/get_condition?r=",
                success: function(result) {
                    //console.log(result)
                },
                async: false
            }).responseText;
            console.log("replacing ... ")
            $(value).replaceWith('<small class="metadata social-context">' + JSON.parse(res)['text'] + '</small>')
        });
        
        jqueryItem.one('click',  function(){ console.log("dian ge mao") } )
    }
});

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


/*
console.log("ready to enter")
$( window ).load(function() {   
    console.log("removing ... ")
    var numObjs = $(".metadata.social-context").length
    $(".metadata.social-context").remove().ready( function () {
        console.log("still exist? -> " + $(".metadata.social-context"))
        console.log("count = "+numObjs)
        for(var i = 0; i<numObjs; i++){
            alert("fuck you!")
            var res = $.ajax({
                type : "GET",
                url :"http://127.0.0.1:5000/get_condition?r="+i,
                success: function(result) {
                    //console.log(result)
                },
                async: false
            }).responseText;
            console.log("replacing ... "+i)
            console.log("before insert " + $(".account-group.js-recommend-link.js-user-profile-link.user-thumb").eq(i) )
            $(".account-group.js-recommend-link.js-user-profile-link.user-thumb").eq(i).after('<small class="metadata social-context">' + JSON.parse(res)['text'] + '</small>')
        }
        event.preventDefault()
    }
    )
})
*/
