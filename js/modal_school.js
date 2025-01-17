// Declare Chart Values
var primaryChart;
var secondaryChart;
// Deinfe the modal

var school_modal = document.getElementById("school_modal");
// Get the <span> element that closes the modal
var span_modal = document.getElementsByClassName("closeschoolmodal")[0];

// When the user clicks on <span> (x), close the modal
span_modal.onclick = function() {
  school_modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == school_modal) {
	school_modal.style.display = "none";
  }
};

// How map triggers the modal 
// On click open modal
map.on('click', 'schools', function(e) {
  
  console.log("Click on schools")
  
  // Block Modal when clicking on other layers
  let f = map.queryRenderedFeatures(e.point);
  var layersToExclude = ['composite', 'dasymetric','placenames'];

  f = f.filter(function (el) {
    return !layersToExclude.includes(el.source);
    //return el.source != 'composite';
  });
  
  //console.log(f[0].sourceLayer)
  
  
  if (f[0].sourceLayer == "schools") {
    
    school_modal.style.display = "block";
	
    var sub = e.features[0].properties;
  	var dataurl = 'https://nptscot.blob.core.windows.net/json/School/' + sub.SeedCode + '.json';
    var schooldata;
    $.getJSON(dataurl, function (json) {
        console.log( "downloaded school json" );
        schooldata = json[0];
    })
      .done(function() {
        //Hide Spinner
        //$('#loader').hide();
        document.getElementById("school-modal-title").innerHTML = "<h2>" + sub.SchoolName + "</h2>";
        // Define Charts
  		  makeChartsModeshareSchool(schooldata);
      })
      .fail(function() {
        alert("Failed to get data for this school, please try refreshing the page");
      });
    
    //return;
  } 
	
});

makeChartsModeshareSchool = function(sub){
  
  function createArray(prefix, suffixes) {
    return suffixes.map(suffix => sub[prefix + suffix]);
  }
  
  var suffixes = [
    '', 
    '_go_dutch_fastest',
    '_ebike_fastest',
    '_go_dutch_quietest',
    '_ebike_quietest'
  ];
  
  // School Primary Destination
  var bicycle_primary = createArray('schl_primary_dest_bicycle', suffixes);
  var foot_primary = createArray('schl_primary_dest_foot', suffixes);
  var car_primary = createArray('schl_primary_dest_car', suffixes);
  var public_transport_primary = createArray('schl_primary_dest_public_transport', suffixes);
  var other_primary = createArray('schl_primary_dest_other', suffixes);
  
  // School Secondary Destination
  var bicycle_secondary = createArray('schl_secondary_dest_bicycle', suffixes);
  var foot_secondary = createArray('schl_secondary_dest_foot', suffixes);
  var car_secondary = createArray('schl_secondary_dest_car', suffixes);
  var public_transport_secondary = createArray('schl_secondary_dest_public_transport', suffixes);
  var other_secondary = createArray('schl_secondary_dest_other', suffixes);
  
  // Travel to School Modeshare
	if(primaryChart){primaryChart.destroy();}
	if(secondaryChart){secondaryChart.destroy();}
	
	var primaryctx = document.getElementById('primaryChart').getContext('2d');
	var secondaryctx = document.getElementById('secondaryChart').getContext('2d');
	
	primaryChart = new Chart(primaryctx, {
		type: 'bar',
		data: {
			labels: ['Baseline',
			         'Go Dutch (Fastest)','Ebike (Fastest)',
			         'Go Dutch (Quietest)','Ebike (Quietest)'],
			datasets: [{
				label: 'Bicycle',
				data: bicycle_primary,
				backgroundColor: 'rgba(51,160,44, 0.8)',
				borderColor: 'rgba(51,160,44, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Car',
				data: car_primary,
				backgroundColor: 'rgba(227,26,28, 0.8)',
				borderColor: 'rgba(227,26,28, 1)',
				borderWidth: 1,
				order: 5
			},
			{
				label: 'Public transport',
				data: public_transport_primary ,
				backgroundColor: 'rgba(56,108,176, 0.8)',
				borderColor: 'rgba(56,108,176, 1)',
				borderWidth: 1,
				order: 3
			},
			{
				label: 'Foot',
				data: foot_primary,
				backgroundColor: 'rgba(178,223,138, 0.8)',
				borderColor: 'rgba(178,223,138, 1)',
				borderWidth: 1,
				order: 2
			},
			{
				label: 'Other',
				data: other_primary,
				backgroundColor: 'rgba(166,206,227, 0.8)',
				borderColor: 'rgba(166,206,227, 1)',
				borderWidth: 1,
				order: 6
			}
			
			]
		},
		options: {
			scales: {
				y: {
				  stacked: true,
				  title: {
            display: true,
            text: 'Number of Children'
          },
				  scaleLabel: {
            display: true
          },
					ticks: {
						beginAtZero: true,
						
					}
				},
				x: {
				  stacked: true
				},
			},
			responsive: true,
			maintainAspectRatio: false
		}
	});
	
	secondaryChart = new Chart(secondaryctx, {
		type: 'bar',
		data: {
			labels: ['Baseline',
			         'Go Dutch (Fastest)','Ebike (Fastest)',
			         'Go Dutch (Quietest)','Ebike (Quietest)'],
			datasets: [{
				label: 'Bicycle',
				data: bicycle_secondary,
				backgroundColor: 'rgba(51,160,44, 0.8)',
				borderColor: 'rgba(51,160,44, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Car',
				data: car_secondary,
				backgroundColor: 'rgba(227,26,28, 0.8)',
				borderColor: 'rgba(227,26,28, 1)',
				borderWidth: 1,
				order: 5
			},
			{
				label: 'Public transport',
				data: public_transport_secondary ,
				backgroundColor: 'rgba(56,108,176, 0.8)',
				borderColor: 'rgba(56,108,176, 1)',
				borderWidth: 1,
				order: 3
			},
			{
				label: 'Foot',
				data: foot_secondary,
				backgroundColor: 'rgba(178,223,138, 0.8)',
				borderColor: 'rgba(178,223,138, 1)',
				borderWidth: 1,
				order: 2
			},
			{
				label: 'Other',
				data: other_secondary,
				backgroundColor: 'rgba(166,206,227, 0.8)',
				borderColor: 'rgba(166,206,227, 1)',
				borderWidth: 1,
				order: 6
			}
			
			]
		},
		options: {
			scales: {
				y: {
				  stacked: true,
				  title: {
            display: true,
            text: 'Number of Children'
          },
				  scaleLabel: {
            display: true
          },
					ticks: {
						beginAtZero: true,
						
					}
				},
				x: {
				  stacked: true
				},
			},
			responsive: true,
			maintainAspectRatio: false
		}
	});
	
};
