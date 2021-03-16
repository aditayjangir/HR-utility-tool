import logging
from collections import defaultdict
import json
import datetime
from flask import Flask, render_template, jsonify, request, flash, url_for, session, redirect
from pip._vendor import requests
from flask_mysqldb import MySQL
from wtforms import Form, StringField, TextAreaField, PasswordField, validators, DateField, IntegerField
from passlib.hash import sha256_crypt
import os
from werkzeug.utils import secure_filename
app = Flask(__name__)

def json_connector(localLocation):
    return open(os.path.join("config",localLocation ), "r")

class mysql_server:
    def __init__(self):
        logging.info("connecting to json file")
        json_data = json_connector("mySqlConfig.json")
        serverDict = json.load(json_data)
        app.config["MYSQL_HOST"] = serverDict['HOST']
        app.config["MYSQL_USER"] = serverDict['USER']
        app.config["MYSQL_PASSWORD"] = serverDict['PASSWORD']
        app.config["MYSQL_DB"] = serverDict['DB']
        app.config["MYSQL_CURSORCLASS"] = serverDict['CURSORCLASS']
        logging.info("SQl Connected  Succesfully")

    def mysql_init(self):
        # init MySQL
        return MySQL(app)


class MyForm(Form):
    name = StringField("Name", [validators.Length(min=1, max=50)])
    lname = StringField("Lname", [validators.Length(min=1, max=25)])
    department = StringField("Department", [validators.Length(min=1, max=25)])
    designation = StringField(
        "Designation", [validators.Length(min=1, max=100)])
    country = StringField("country", [validators.Length(min=1, max=25)])
    currency = StringField("Currency", [validators.Length(min=1, max=25)])
    salary = StringField("Salary", [validators.Length(min=1, max=25)])
    joiningdate = StringField(
        'Joining Date', [validators.Length(min=1, max=12)])


def dateTime_handler(jsonObj):
    if isinstance(jsonObj, datetime.datetime):
        return jsonObj.isoformat()
    raise TypeError("Unknown Type")


@app.route('/insert', methods=['GET', 'POST'])
def insert():
    departmentDesigbation=json.load(json_connector("employeeFormData.json"))[0]
    companySite=json.load(json_connector("employeeFormData.json"))[1]
    logging.info("Showing Form")
    form = MyForm(request.form)
    logging.info("Validator Connected")
    if request.method == 'POST' and form.validate():
        try:
            logging.info("Validators are True")
            # Storing inputfield data 
            fname = form.name.data
            lname = form.lname.data
            department = form.department.data
            designation = form.designation.data
            branch = form.country.data
            currency = form.currency.data
            salary = form.salary.data
            joiningdate = form.joiningdate.data
            logging.info("Input flield data assigned")
            # Create cursor to execute data
            logging.info("Connecting with Database")
            cur = mysql.connection.cursor()
            logging.info("Inserting values in database")
            cur.execute("INSERT INTO data_form(1_name,2_lname,3_department,4_designation,5_joiningDate,6_branch,7_currency,8_salary) VALUE(%s,%s,%s,%s,%s,%s,%s,%s)",
                        (fname, lname, department, designation, joiningdate, branch, currency, salary))
            logging.info("value stored")
            # Commit to DB
            mysql.connection.commit()
            logging.info("Clossing connection with database")
            # close connection
            cur.close()
            logging.info("Data Recored")
            r = requests.get('http://127.0.0.1:5000/insert')
            if r.status_code >= 200 and r.status_code < 300:
                flash("Your data has been recorded", "success")
                return redirect(url_for('insert'))

        except Exception as e:
            logging.info("Data not Recorded")
            r = requests.get('http://127.0.0.1:5000/insert')
            if r.status_code >= 300:
                flash("Something is wrong !!! ", "danger")
                return redirect(url_for('insert'))
    if request.method == 'POST' and form.validate() == False:
        logging.info("Validators are Flase")
        flash('Looks like you miss somthing', "warning")
        return redirect(url_for('insert'))

    return render_template('employee_data.html', form=form,departmentDesigbation=departmentDesigbation,companySite=companySite)


@app.route("/")
def home_page():
    logging.info("Loading Home Page")
    return render_template("index.html")


@app.route("/request_insert")
def insert_page():
    logging.info("Redirecting to insert page")
    # url_for("*") here * indicate function of the route you want to access
    return jsonify({'redirect': url_for("insert")})


@app.route('/fetchall')
def fetchall():
    try:
        departmentDesigbation=json.load(json_connector("employeeFormData.json"))[0]
        companySite=json.load(json_connector("employeeFormData.json"))[1]
        logging.info("Connecting to sql(for fetching table data")
        cursor = mysql.connection.cursor()
        logging.info("Executing Query")
        cursor.execute("SELECT * from data_form")
        logging.info("Query Executed")
        mysql.connection.commit()
        logging.info("Storing Fetch Data")
        result = cursor.fetchall()
        logging.info("Loads and Dumps the data")
        responce = json.loads(json.dumps({
            "statusCode": 200,
            "body": json.loads(json.dumps(result, indent=4, sort_keys=True, default=str))
        }))
        logging.info("stored")
        cursor.close()
        logging.info("Rendering Template")
        return render_template("employee_data_Tabular_form.html", dataDict=responce,departmentDesigbation=departmentDesigbation,companySite=companySite)
    except Exception as e:
        logging.info("except")
        responce = json.loads(json.dumps({
            "statusCode": 500,
            "body": "ServerException:"+str(e)
        }))
        return render_template("employee_data_Tabular_form.html", dataDict=responce)


@app.route("/delete_data", methods=["POST"])
def delete_data():
    try:
        logging.info("Storing ajax responce data to be deleted")
        deleteRowId = dict((key, request.form.getlist(key) if len(request.form.getlist(
            key)) > 1 else request.form.getlist(key)[0]) for key in request.form.keys())
        empId=str()
        for delete in deleteRowId:
            empId = delete
        cursor = mysql.connection.cursor()
        logging.info("Executing delete query"+empId)
        logging.info("Executing delete query")
        query="DELETE from data_form where 0_employee_id = %s"
        cursor.execute(query,(empId,))
        mysql.connection.commit()
        cursor.close()
        logging.info("row deleted successfully")
        return redirect(url_for("fetchall"))
    except Exception as e:
        return json.dumps({
            "statusCode": 500,
            "body": "ServerException:"+str(e)
        })


@app.route("/edited_data", methods=["POST"])
def edited_data():
    try:
        logging.info("Storing ajax responce data to be updated")
        EditedData = dict((key, request.form.getlist(key) if len(request.form.getlist(
            key)) > 1 else request.form.getlist(key)[0]) for key in request.form.keys())
        logging.info('Changing data from json to dict')
        reviseData = str()
        for data in EditedData:
            reviseData = data
        reviseData = (json.loads(reviseData))
        logging.info(reviseData)
        logging.info("Implementing Updating Query")
        for updates in reviseData["Edited"]:
            queryStr = str()
            logging.info("Storing Query in string")
            queryStr = "UPDATE data_form SET " + \
                updates["key"]+" = '"+str(updates["value"]) + \
                "' WHERE 0_employee_id ='" + str(reviseData["Primary key"])+"'"
            logging.info("Query stored in string")
            cursor = mysql.connection.cursor()
            logging.info("Executing Query")
            cursor.execute(queryStr)
            logging.info("Query executed")
            mysql.connection.commit()
            logging.info("cell Updated successfully")
            cursor.close()
        logging.info("redirecting to fetchall")
        return redirect(url_for("fetchall"))
    except Exception as e:
        return json.dumps({
            "statusCode": 500,
            "body": "ServerException:"+str(e)
        })


@app.route("/update_query", methods=["POST"])
def update_query():
    try:
        logging.info("Storig update query data")
        query = dict((key, request.form.getlist(key) if len(request.form.getlist(
            key)) > 1 else request.form.getlist(key)[0]) for key in request.form.keys())
        queryString = str()
        for que in query:
            queryString = que
        cursor = mysql.connection.cursor()
        logging.info("Query Executing")
        cursor.execute(queryString)
        logging.info("query Executed")
        mysql.connection.commit()
        logging.info("row update successfully")
        cursor.close()
        return redirect(url_for("fetchall"))
    except Exception as e:
        logging.info("Except")
        return json.dumps({
            "statusCode": 500,
            "body": "ServerException:"+str(e)
        })


if __name__ == '__main__':
    logging.basicConfig(filename='./app.log', filemode='a', level=logging.DEBUG,
                        format='%(asctime)s - %(levelname)s - %(message)s', datefmt='%m-%d-%y %H:%M:%S')

    create_db = mysql_server()
    logging.info("db_created")
    mysql = create_db.mysql_init()
    logging.info("mysql initated")
    app.secret_key = "secret123"
    app.run(debug=True)
