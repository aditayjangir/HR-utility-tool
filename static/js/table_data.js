let myTable = document.querySelector('#table');
var headers = ['Employee ID', 'Name', 'Last Name', 'Department', 'Designation', 'Joining Date', 'branch', 'currency', 'salary'];

// Show table
function show_table(data, departmentsDict, companySiteDict) {
    data = JSON.parse(data);
    if (data.statusCode === 200) {
        var employees = data.body;
        let table = document.createElement('table');
        let headerRow = document.createElement('tr');

        // Creating header of the table
        headers.forEach(headerText => {
            let header = document.createElement('th');
            let textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        });
        // Putting data into cells
        table.appendChild(headerRow);
        let rowIdNo = 0;
        employees.forEach(emp => {
            rowNo = employees[rowIdNo]["0_employee_id"];
            let cellNo = 0;
            let row = document.createElement('tr');
            // Creating edit button
            let btn = document.createElement('button');
            let rowId = "row_" + rowNo;
            // Adding attributes to the edit button
            row.setAttribute('id', rowId);
            btn.setAttribute('id', 'editBtn' + rowNo);
            btn.setAttribute('class', 'btn btn-outline-success');
            btn.setAttribute('type', 'submit');
            btn.setAttribute('onclick', 'editfn((' + rowId + '),(' + rowNo + '),(' + rowIdNo + '),(' + JSON.stringify(employees) + '),(' + JSON.stringify(departmentsDict) + '),(' + JSON.stringify(companySiteDict) + '));populate_department_ele((' + JSON.stringify(departmentsDict) + '),(' + rowNo + '));populate_location_ele((' + JSON.stringify(companySiteDict) + '),(' + rowNo + '))');
            btn.innerHTML = "Edit";
            rowIdNo = rowIdNo + 1;
            Object.values(emp).forEach(text => {
                cellNo = cellNo + 1;
                cellId = 'cell_' + rowNo + '_' + cellNo;
                let cell = document.createElement('td');
                // Adding attributes to the cell button
                cell.setAttribute("id", cellId);
                cell.setAttribute("required", "");
                let textNode = document.createTextNode(text);
                // Appending
                cell.appendChild(textNode);
                row.appendChild(cell);
            })
            row.appendChild(btn)

            table.appendChild(row);
        });

        myTable.appendChild(table);
    }
    else {
        // Converting string into object
        alert_message(404, data.body);
    }
}

// Edit btn
function editfn(selectedRowId, editBtnIdNo, editRowNo, employeeDict, departments, locations) {
    departments = JSON.stringify(departments)
    locations = JSON.stringify(locations)
    employeeDataString = JSON.stringify(employeeDict);
    selectedRowId.setAttribute("contenteditable", "true");
    editRowId = selectedRowId.getAttribute("id")
    // Creating save button
    savebtn = document.createElement('button');
    // Adding attributes to the save button
    savebtn.innerHTML = "Update";
    selectedRowId.appendChild(savebtn);
    savebtn.setAttribute('id', 'save' + editBtnIdNo);
    savebtn.setAttribute('class', 'btn btn-outline-success');
    savebtn.setAttribute('type', 'submit');
    savebtn.setAttribute('onclick', 'savefn((' + editRowId + '),(' + editBtnIdNo + '),(' + editRowNo + '),(' + employeeDataString + '))');
    savebtn.style.display = "block";

    // Creating delete button
    deletebtn = document.createElement('button');
    // Adding attributes to the delete button
    deletebtn.innerHTML = "Delete";
    selectedRowId.appendChild(deletebtn);
    deletebtn.setAttribute('id', 'delete' + editBtnIdNo);
    deletebtn.setAttribute('class', 'btn btn-outline-success');
    deletebtn.setAttribute('type', 'submit');
    deletebtn.setAttribute('onclick', 'deletefn((' + editBtnIdNo + '),(' + editBtnIdNo + '),(' + editRowId + '))');
    deletebtn.style.display = "block";

    // Creating cancel button
    cancelbtn = document.createElement('button');
    // Default value of cells
    departmentDefaultCell = document.getElementById("cell_" + editBtnIdNo + "_4");
    departmentDefaultCell = JSON.stringify(departmentDefaultCell.innerHTML)

    designationDefaultCell = document.getElementById("cell_" + editBtnIdNo + "_5");
    designationDefaultCell = JSON.stringify(designationDefaultCell.innerHTML)

    countryDefaultCell = document.getElementById("cell_" + editBtnIdNo + "_7");
    countryDefaultCell = JSON.stringify(countryDefaultCell.innerHTML)

    currencyDefaultCell = document.getElementById("cell_" + editBtnIdNo + "_8");
    currencyDefaultCell = JSON.stringify(currencyDefaultCell.innerHTML)
    // Adding attributes to the cancel button
    cancelbtn.innerHTML = "Cancel";
    selectedRowId.appendChild(cancelbtn);
    cancelbtn.setAttribute('id', 'cancel' + editBtnIdNo);
    cancelbtn.setAttribute('class', 'btn btn-outline-success');
    cancelbtn.setAttribute('type', 'submit');
    cancelbtn.setAttribute('onclick', 'cancelfn((' + editRowId + '),(' + editBtnIdNo + '),(' + departmentDefaultCell + '),(' + designationDefaultCell + '),(' + countryDefaultCell + '),(' + currencyDefaultCell + '))');
    cancelbtn.setAttribute('style', 'display:block');

    // Creating Department Dropdwn 
    let department = document.getElementById("cell_" + editBtnIdNo + "_4");
    department.setAttribute("required", "");
    let departmentDesignationDOM = document.createElement('select');
    departmentDesignationDOM.setAttribute("required", "");
    departmentDesignationDOM.setAttribute("id", "department_" + editBtnIdNo + "_4");
    departmentDesignationDOM.setAttribute('onchange', 'populate_designation_ele(' + departments + ',' + editBtnIdNo + ')');
    department.appendChild(departmentDesignationDOM)

    // Creating Designation Dropdown
    let designation = document.getElementById("cell_" + editBtnIdNo + "_5");
    designation.setAttribute("required", "");
    let designationDOM = document.createElement('select');
    designationDOM.setAttribute("required", "");
    designationDOM.setAttribute("id", "designation_" + editBtnIdNo + "_5");
    designation.appendChild(designationDOM)

    // Creating country Dropdwn 
    let country = document.getElementById("cell_" + editBtnIdNo + "_7");
    country.setAttribute("required", "");
    let countryDOM = document.createElement('select');
    countryDOM.setAttribute("required", "");
    countryDOM.setAttribute("id", "country_" + editBtnIdNo + "_7");
    countryDOM.setAttribute('onchange', 'populate_currency_ele(' + locations + ',' + editBtnIdNo + ')');
    country.appendChild(countryDOM)

    // Creating currency Dropdown
    let currency = document.getElementById("cell_" + editBtnIdNo + "_8");
    currency.setAttribute("required", "");
    let currencyDOM = document.createElement('select');
    currencyDOM.setAttribute("required", "");
    currencyDOM.setAttribute("id", "currency_" + editBtnIdNo + "_8");
    currency.appendChild(currencyDOM)

    // Hiding edit button
    let hideEdit = document.getElementById('editBtn' + editBtnIdNo);
    hideEdit.style.display = "none";

}

// cancel btn
function cancelfn(selectedRowId, idNo, departmentDefaultCell, designationDefaultCell, countryDefaultCell, currencyDefaultCell) {
    // cells Default values
    column_4 = document.getElementById("cell_" + idNo + "_4");
    column_4.innerHTML = departmentDefaultCell

    column_5 = document.getElementById("cell_" + idNo + "_5");
    column_5.innerHTML = designationDefaultCell

    column_7 = document.getElementById("cell_" + idNo + "_7");
    column_7.innerHTML = countryDefaultCell

    column_8 = document.getElementById("cell_" + idNo + "_8");
    column_8.innerHTML = currencyDefaultCell

    //  Unhide the edit button
    let unhideEdit = document.getElementById('editBtn' + idNo);
    unhideEdit.style.display = "block";
    // remove save button 
    let hideSave = document.getElementById('save' + idNo);
    hideSave.remove();
    // remove delete button 
    let hideDelete = document.getElementById('delete' + idNo);
    hideDelete.remove();
    // remove cancel button
    let hideCancel = document.getElementById('cancel' + idNo);
    hideCancel.remove();
    selectedRowId.setAttribute("contenteditable", "false");
}

// Save btn
function savefn(selectedRowId, idNo, editRowNo, empDict) {
    // Save Department
    departmentCell = document.getElementById("cell_" + idNo + "_4");
    department = document.getElementById("department_" + idNo + "_4").value;

    departmentCell.innerHTML = department;

    // Save Designation
    designationCell = document.getElementById("cell_" + idNo + "_5");
    designation = document.getElementById("designation_" + idNo + "_5").value;

    designationCell.innerHTML = designation;

    // Save Country
    countryCell = document.getElementById("cell_" + idNo + "_7");
    country = document.getElementById("country_" + idNo + "_7").value;

    countryCell.innerHTML = country;

    // Save Currency
    currencyCell = document.getElementById("cell_" + idNo + "_8");
    currency = document.getElementById("currency_" + idNo + "_8").value;
    currencyCell.innerHTML = currency;

    // Selecting the dict from list of dict that is to be compared
    let editedData = [];
    let primaryKey = idNo;
    let selectedRow = empDict[editRowNo];
    for (i = 0; i < 9; i++) {
        // Itterating the values of employee dict
        let editEleChecker = (Object.values(selectedRow)[i]);
        // Itterating the keys/header of employee dict
        let editEleHeader = (Object.keys(selectedRow)[i]);
        // selecting the cell of the table
        var theContent = $('#cell_' + idNo + '_' + (i + 1));
        // Saving the edited value of the cell in localStorage
        var editedContent = theContent.html();
        // localStorage.newContent = editedContent;
        // converting string employee id in to int
        if (i === 0) {
            editedContent = parseInt(editedContent);
        }
        // Comparing the edited value with value stored in sql dict
        if (editEleChecker !== editedContent) {
            if (editedContent !== "") {
                // append header(editEleHeader) and cell(editedContent) in dict
                editedData.push({
                    key: editEleHeader,
                    value: editedContent
                });
            }
            else {
                alert_message(406, "Please fill all the cell's");
                return (-1);
            }
        }
    }
    // Converting json format data into string
    let jsonEditedData = JSON.stringify({ "Primary key": primaryKey, "Edited": editedData })
    if (editedData.length === 0) {
        alert_message(424, "No change applied!");
    }
    else {
        $.ajax({
            url: "/edited_data",
            type: "POST",
            data: jsonEditedData,
            error: function (error) {
                alert_message(500, error);
            }
        }).done(function () {
            window.location.href = '/fetchall';
        });
    }
    //  Unhide the edit button
    let unhideEdit = document.getElementById('editBtn' + idNo);
    unhideEdit.style.display = "block";
    // remove save button 
    let hideSave = document.getElementById('save' + idNo);
    hideSave.remove();
    // remove delete button 
    let hideDelete = document.getElementById('delete' + idNo);
    hideDelete.remove();
    // remove cancel button
    let hideCancel = document.getElementById('cancel' + idNo);
    hideCancel.remove();
    selectedRowId.setAttribute("contenteditable", "false");
}


// delete row
function deletefn(deleteRowId, idNo, selectedRowId) {
    //  Unhide the edit button
    let unhideEdit = document.getElementById('editBtn' + idNo);
    unhideEdit.style.display = "block";
    // remove save button 
    let hideSave = document.getElementById('save' + idNo);
    hideSave.remove();
    // remove delete button 
    let hideDelete = document.getElementById('delete' + idNo);
    hideDelete.remove();
    // remove cancel button
    let hideCancel = document.getElementById('cancel' + idNo);
    hideCancel.remove();
    selectedRowId.setAttribute("contenteditable", "false");
    deleteRowId = JSON.stringify(deleteRowId)
    $.ajax({
        url: "/delete_data",
        type: "POST",
        data: deleteRowId,
        error: function (error) {
            alert_message(500, error);
        }
    }).done(function () {
        window.location.href = '/fetchall';
    });

}


// filter data by name
function search_by_name() {
    // Declare variables
    var input, filter, table, tr, td, itr, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (itr = 0; itr < tr.length; itr++) {
        td = tr[itr].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[itr].style.display = "";
            } else {
                tr[itr].style.display = "none";
            }
        }
    }
}


$('#updateBtn').click(function () {
    var query = $("#sqlUpdate").val()
    var result = query.split(" ")
    if (result[0] === "INSERT" || result[0] === "insert" || result[0] === "Insert") {
        console.log(result);
        alert_message(403, "This functionality is not allowed");
        return (-1);

    } else {
        $.ajax({
            url: "/update_query",
            type: "POST",
            data: query,
            success: function (responce) {
                responces = JSON.parse(responce)
                alert_message(responces.statusCode, "Something is wrong with query!!!");
            },
            error: function (error) {
                alert_message(500, error);
            }
        });
    }
})

function populate_department_ele(departments, rowNo) {
    var departmentSel = document.getElementById("department_" + rowNo + "_4");
    //select department
    for (var department in departments) {
        departmentSel.options[departmentSel.options.length] = new Option(department);
    }
}

function populate_designation_ele(departments, rowNo) {
    var departmentSel = document.getElementById("department_" + rowNo + "_4");
    var designationSel = document.getElementById("designation_" + rowNo + "_5");
    //empty designation
    designationSel.length = 1;
    selectedDepartment = departments[departmentSel.value];
    selectedDepartment.forEach(function (designation) {
        designationSel.options[designationSel.options.length] = new Option(designation, designation)
    });
}
function populate_location_ele(locations, rowNo) {
    var branchSel = document.getElementById("country_" + rowNo + "_7");
    for (var location in locations) {

        branchSel.options[branchSel.options.length] = new Option(location);
    }
}
function populate_currency_ele(locations, rowNo) {
    var branchSel = document.getElementById("country_" + rowNo + "_7");
    var currencySel = document.getElementById("currency_" + rowNo + "_8");
    //empty currency
    currencySel.length = 0;
    currency = locations[branchSel.value];
    //display correct values
    //select currency
    currencySel.options[currencySel.options.length] = new Option(currency, currency)
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