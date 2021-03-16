function populate_department_ele(departments) {
    var departmentSel = document.getElementById("department");
    //select department
    for (var department in departments) {
        departmentSel.options[departmentSel.options.length] = new Option(department);
    }
}
function populate_designation_ele(departments) {
    var departmentSel = document.getElementById("department");
    var designationSel = document.getElementById("designation");
    //empty designation
    designationSel.length = 1;
    selectedDepartment = departments[departmentSel.value];
    selectedDepartment.forEach(function (designation) {
        designationSel.options[designationSel.options.length] = new Option(designation, designation)
    });
}
function populate_location_ele(locations) {
    var branchSel = document.getElementById("country");
    for (var location in locations) {

        branchSel.options[branchSel.options.length] = new Option(location);
    }
}
function populate_currency_ele(locations) {
    var branchSel = document.getElementById("country");
    var currencySel = document.getElementById("currency");
    //empty currency
    currencySel.length = 0;
    currency = locations[branchSel.value];
    //display correct values
    //select currency
    currencySel.options[currencySel.options.length] = new Option(currency, currency)
}

