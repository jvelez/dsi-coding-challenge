$(document).ready(function()
{
	//MAP RELATED VARS
	var map;
	var city_location = [];
	
	//MAP INITIALIZATION FUNCTION
	function initialize_map()
	{
		map = new google.maps.Map(document.getElementById('map'), 
		{
			center: new google.maps.LatLng(41.60054,-93.60911),//Setting Initial Position
			zoom: 10
		});
	}

	//CENTER MAP ON NEW LOCATION
	function new_map_location(nlat,nlon)
	{
		map = new google.maps.Map(document.getElementById('map'), 
		{
			center: new google.maps.LatLng(nlat,nlon),//Setting Initial Position
			zoom: 10
		});
	}

	google.maps.event.addDomListener(window, 'load', initialize_map);
	
	//REQUEST CITY DATA AND GENERATE RESULTS
	function get_city_data(str) 
	{
		//GENERATE REQUEST
		console.log('search: ' + str);
		var substring_match = document.getElementById('substring_match_checkbox').checked;
		var request = "http://127.0.0.1:5000/" + ((substring_match)? ("cities?like="+str) : ("cities/"+str));
		console.log(request);
		
		//SEND REQUEST
		$.getJSON(request, function(data)
		{
			//TEMP VARS
			var city = "";
			var state = "";
			var country = "";
			var alt_names = "";
			var lat = "";
			var lon = "";
			var target = "";
			var content = "";
			var result = "";
			city_location = [];
			
			//RETRIEVE DATA FOR EACH CITY AND GENERATE RESULTS
			for(var i=0; i<data["cities"].length && i<25; i++)
			{
				//GET CITY DATA
				city = data["cities"][i].city;
				state = data["cities"][i].state;
				country = data["cities"][i].country;
				lat = data["cities"][i].latitude;
				lon = data["cities"][i].longitude;
				alt_names = data["cities"][i]["alternate_names"];
				city_location.push([lat,lon]);
				
				//CHECK IF THERE IS MORE THAN 1 ALT NAME AND GENERATE A COLLAPSIBLE LIST TO DISPLAY THEM
				if(alt_names.length>1)
				{
					content = "";
					for(var j=0; j<alt_names.length; j++)
					{
						content += alt_names[j]+"<br>";
					}
					target = "altn"+i;
					alt_names = "<button class=\"btn btn-primary btn-outline-dark btn-sm\" type=\"button\" data-toggle=\"collapse\" data-target=\"#"+target+"\" aria-expanded=\"false\" aria-controls=\""+target+"\">";
					alt_names += "List</button><div class=\"collapse\" id=\""+target+"\"><div class=\"card card-body\">"+content+"</div></div>";
				}
				
				//GENERATE RESULT CONTENT
				content  = "<b>City:</b>"+city+"<br>";
				content += "<b>State:</b>"+state+"<br>";
				content += "<b>Country:</b>"+country+"<br>";
				content += "<b>Alternative Names:</b>"+alt_names+"<br>";
				content += "<b>Latitude:</b>"+lat+"<br>";
				content += "<b>Longitude:</b>"+lon+"<br>";
				
				//GENERATE RESULT
				target = "city"+i;
				result += "<button class=\"btn btn-primary btn-block btn-outline-info mapview\" type=\"button\" data-toggle=\"collapse\" data-target=\"#"+target+"\" aria-expanded=\"false\" aria-controls=\"";
				result += target+"\" id=\""+i+"\">"+city+"</button><div class=\"collapse\" id=\""+target+"\"><div class=\"card card-body\">"+content+"</div></div>";
			}
			
			//UPDATE HTML TO DISPLAY RESULTS
			document.getElementById('results').innerHTML = result;
		});
	}

	//SEND A REQUEST WHILE TYPING
	$('#searchbox').keyup(function()
	{
		get_city_data($('#searchbox').focus().val());
	});
	
	//SET MAP LOCATION ON CLICK
	$(document).on('click','.mapview', function()
	{
		var id = $(this).attr('id');
		new_map_location(city_location[id][0],city_location[id][1]);
	});
});

