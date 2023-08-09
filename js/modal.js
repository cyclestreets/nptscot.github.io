// Declare Chart Values
var mode_commute_chart;

// Deinfe the modal

var zone_modal = document.getElementById("zone_modal");
// Get the <span> element that closes the modal
var span_modal = document.getElementsByClassName("closemodal")[0];

// When the user clicks on <span> (x), close the modal
span_modal.onclick = function() {
  zone_modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == zone_modal) {
	zone_modal.style.display = "none";
  }
};

// How map triggers the modal 
// On click open modal
map.on('click', 'data_zones', function(e) {
  
  // Block Modal when clicking on other layers
  let f = map.queryRenderedFeatures(e.point);
  f = f.filter(function (el) {
    return el.source != 'composite';
  });
  
  if (f.length == 1) {
    
    zone_modal.style.display = "block";
	
    var sub = e.features[0].properties;
  	var dataurl = 'https://www.wisemover.co.uk/json/' + sub.geo_code + '.json';
    var zonedata;
    $.getJSON(dataurl, function (json) {
        console.log( "downloaded zone json" );
        zonedata = json[0];
    })
      .done(function() {
        //Hide Spinner
        //$('#loader').hide();
        // Define Charts
  		  makeChartsModeshare(zonedata);
      })
      .fail(function() {
        alert("Failed to get data for this zone, please try refreshing the page");
      });
    
    //return;
  } 
	
});






makeChartsModeshare = function(sub){
  
  // Mode share by origin
  // Mode share by desitination
  // Baseline
  // GoDuch
  
  // 4 stacke bar makeChartsTransport
  // Travel to Work Modeshare
	if(mode_commute_chart){
		mode_commute_chart.destroy();
	}
  
  var bicycle = [
    sub.orig_bicycle_fastest_commute, 
    sub.orig_bicycle_go_dutch_fastest_commute, 
    sub.dest_bicycle_fastest_commute, 
    sub.dest_bicycle_go_dutch_fastest_commute
    ];
  
  var car_driver = [
    sub.orig_car_driver_fastest_commute, 
    sub.orig_car_driver_go_dutch_fastest_commute, 
    sub.dest_car_driver_fastest_commute, 
    sub.dest_car_driver_go_dutch_fastest_commute
    ];
    
  var car_passenger = [
    sub.orig_car_passenger_fastest_commute, 
    sub.orig_car_passenger_go_dutch_fastest_commute, 
    sub.dest_car_passenger_fastest_commute, 
    sub.dest_car_passenger_go_dutch_fastest_commute
    ];
    
  var public_transport = [
    sub.orig_public_transport_fastest_commute, 
    sub.orig_public_transport_go_dutch_fastest_commute, 
    sub.dest_public_transport_fastest_commute, 
    sub.dest_public_transport_go_dutch_fastest_commute
    ];
    
  var foot = [
    sub.orig_foot_fastest_commute, 
    sub.orig_foot_go_dutch_fastest_commute, 
    sub.dest_foot_fastest_commute, 
    sub.dest_foot_go_dutch_fastest_commute
    ];
    
  var other = [
    sub.orig_other_fastest_commute, 
    sub.orig_other_go_dutch_fastest_commute, 
    sub.dest_other_fastest_commute, 
    sub.dest_other_go_dutch_fastest_commute
    ];
  
  
  var mode_commute_ctx = document.getElementById('mode_commute_chart').getContext('2d');
	mode_commute_chart = new Chart(mode_commute_ctx, {
		type: 'bar',
		data: {
			labels: ['Leaving Baseline','Leaving Go Dutch','Arriving Baseline','Arriving Go Dutch'],
			datasets: [{
				label: 'Bicycle',
				data: bicycle,
				backgroundColor: 'rgba(51,160,44, 0.8)',
				borderColor: 'rgba(51,160,44, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Car driver',
				data: car_driver,
				backgroundColor: 'rgba(227,26,28, 0.8)',
				borderColor: 'rgba(227,26,28, 1)',
				borderWidth: 1,
				order: 5
			},
			{
				label: 'Car passenger',
				data: car_passenger,
				backgroundColor: 'rgba(251,154,153, 0.8)',
				borderColor: 'rgba(251,154,153, 1)',
				borderWidth: 1,
				order: 4
			},
			{
				label: 'Public transport',
				data: public_transport ,
				backgroundColor: 'rgba(56,108,176, 0.8)',
				borderColor: 'rgba(56,108,176, 1)',
				borderWidth: 1,
				order: 3
			},
			{
				label: 'Foot',
				data: foot,
				backgroundColor: 'rgba(178,223,138, 0.8)',
				borderColor: 'rgba(178,223,138, 1)',
				borderWidth: 1,
				order: 2
			},
			{
				label: 'Other',
				data: other,
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
				  scaleLabel: {
            display: true,
            labelString: 'Daily commuters'
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


