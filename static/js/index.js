//this script is requesting redirect for form page
function request_page() {
    $.ajax({
        url: "/request_insert",
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            window.location.href = response.redirect
        }
    });
}
function request_employee_data() {
    $.ajax({
        url: "fetchall",
        type: "GET",
        contentType: 'application/json',
        dataType: 'json',
        error: function (error) {
            alert_message(500,error);
        }
    });
}

// message clear
function message_clear() {
    colourAlert = document.getElementById("alert");
    colourAlert.setAttribute("class", "");
    message = document.getElementById("message");
    message.innerHTML = "";
    cross = document.getElementById("cross");
    cross.innerHTML = "";
}

// Alert message
function alert_message(statusCode, messages) {
    messages = messages;
    if (statusCode >= 300 && statusCode < 500) {
        yellowAlert = document.getElementById("alert");
        cross = document.getElementById("cross");
        cross.innerHTML = "&times;";
        cross.setAttribute("onclick", "message_clear()");
        message = document.getElementById("message");
        message.innerHTML = messages;
        yellowAlert.setAttribute("class", "alert alert-warning alert-dismissible");
    }

    else if (statusCode >= 200 && statusCode < 300) {
        greenAlert = document.getElementById("alert");
        cross = document.getElementById("cross");
        cross.innerHTML = "&times;";
        cross.setAttribute("onclick", "message_clear()");
        message = document.getElementById("message");
        message.innerHTML = messages;
        greenAlert.setAttribute("class", "alert alert-success alert-dismissible");
    }
    else {
        redAlert = document.getElementById("alert");
        cross = document.getElementById("cross");
        cross.innerHTML = "&times;";
        cross.setAttribute("onclick", "message_clear()");
        message = document.getElementById("message");
        message.innerHTML = messages;
        redAlert.setAttribute("class", "alert alert-danger alert-dismissible fade show");
    }
}