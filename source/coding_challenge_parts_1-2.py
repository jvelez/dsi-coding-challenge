#!flask/bin/python
from flask import Flask,request,json,jsonify
import operator

#APP_CONFIGURATIONS#######################################
app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
app.config['JSON_AS_ASCII'] = False
#-########################################################


#READ_FILE_DATA_##########################################
def read_file_data():
	file = open("canada_usa_cities.tsv",encoding='utf-8')
	lines = file.read().split('\n')
	linesx = []
	for line in lines:
		templine = line.split('\t')
		if(len(templine)==19):
			linesx.append(
			{
				"city":templine[1],
				"state":templine[10],
				"country":templine[8],
				"alternate_names":templine[3].split(","),
				"latitude":templine[4],
				"longitude":templine[5]
			})
	return linesx
#-########################################################


#SEND_RESPONSE_###########################################
def send_response(resp):
	response = jsonify(resp)
	response.headers.add('Access-Control-Allow-Origin','*')
	return(response)
#-########################################################


#GET_SUBSTRING_MATCH_CITIES_##############################
def get_substring_match(substring):
	cities = {"cities":[]}
	for c in cities_data:
		if substring in c["city"]:
			cities["cities"].append(c)
	return(send_response(cities))
#-########################################################


#GET_ALL_CITIES_##########################################
@app.route('/cities', methods=['GET'])
def get_cities():
	substring = request.args.get('like', None)
	if(substring):
		return get_substring_match(substring)
	else:
		return(send_response(cities_data))
#-########################################################


#GET_SINGLE_CITY_#########################################
@app.route('/cities/<city>', methods=['GET'])
def get_single_city(city):
	resp = {"cities":[]}
	for c in cities_data:
		if(c["city"]==city):
			resp["cities"].append(c)
	return(send_response(resp))
#-########################################################


#_START_THE_APP_##########################################
if __name__ == '__main__':
	cities_data = read_file_data()
	app.run(debug=True)
#_########################################################
