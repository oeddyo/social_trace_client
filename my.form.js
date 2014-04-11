//BASE_URL = "http://ec2-174-129-119-33.compute-1.amazonaws.com"
//BASE_URL = "http://127.0.0.1:5000"


function submitForm() {
    chrome.storage.local.get('user_id',
        function (result) {
            if (!('user_id' in result)) {
                storedMacId = my_guid();
                chrome.storage.local.set({'user_id': storedMacId});
            } else {
                storedMacId = result['user_id']
            }
            var options = {
                type: 'POST',
                beforeSubmit: validate,
                success: function (responseText, statusText, xhr, $form) {
                    chrome.storage.local.set({'survey': responseText})
                    $('#myForm').html("<p>Thanks! You are done!</p> <p>Please keep the extension for one month, and we will contact you via email for compensations!</p>")
                    console.log("Submit successfully!")
                },
                url: BASE_URL + "/store_survey",
                data: {"user_id": storedMacId, "time": new Date()},
                error: function (e) {
                    console.log(e)
                }
            }

            chrome.storage.local.get('survey', function (result) {
                if (!('survey' in result)) {
                    console.log("survey not in result")
                    $('#myForm').submit(function () {
                            $(this).ajaxSubmit(options);
                            return false;
                        }
                    )
                } else {
                    console.log("survey in result")
                    window.location.href = "another.html";
                }
            })
        }
    );
}

$(document).ready(function () {
    // bind 'myForm' and provide a simple callback function
    submitForm()
    $('#watch_video').on('click', function () {
        chrome.tabs.create({url: "https://www.youtube.com/watch?v=Udl1tJSENgI"})
        return false;
    });


});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function validate(formData, jqForm, options) {
    // formData is an array of objects representing the name and value of each field
    // that will be sent to the server;  it takes the following form:
    //
    // [
    //     { name:  username, value: valueOfUsernameInput },
    //     { name:  password, value: valueOfPasswordInput }
    // ]
    //
    // To validate, we can examine the contents of this array to see if the
    // username and password fields have values.  If either value evaluates
    // to false then we return false from this method.

    if (!validateEmail(formData[0].value)) {
        $("#warning").html('<font color="red">Please enter a valid email address. Note fake email address would result into no reward"</font>')
        return false;
    }

    zip = formData[1].value
    console.log("zip = " + zip)
    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
    if (!isValidZip) {
        $("#warning").html('<font color="red">Please enter valid zip code</font>')
        return false
    }

    gender = formData[2].value
    if (gender.length < 4) {
        $("warning").html('<font color="red">Please choose your gender</font>')
        return false
    }
    console.log("In validate. Ready to submit...")
}
