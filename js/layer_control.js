function switch_style(){
  var styleName = displayRadioValue(document.getElementById("basemapform"));
  var styleCurrent = map.getStyle().name;
  if(styleCurrent != styleName){
    console.log("Restyling from " + styleCurrent +" to "+ styleName);
    map.setStyle('tiles/style_' + styleName + '.json');
  }
  
  map.once('idle', function() {
    // Add Data Sources
    addDataSources();

    // Reload layers
    toggleLayer('rnet'); // Start with the rnet on
    toggleLayer('data_zones');
    toggleLayer('la');
    toggleLayer('wards');
    toggleLayer('holyrood');
    toggleLayer('schools');
    switch_placenames();
    
    // Sliders 
    quietnessSlider.noUiSlider.on('update', function(){
      switch_rnet()
    })
    gradientlider.noUiSlider.on('update', function(){
      switch_rnet()
    })
    cycleSlider.noUiSlider.on('update', function(){
      switch_rnet()
    })
  
  });
}

function addDataSources () {
  console.log("Adding sources");
  
  // Define sources
  // #!# Move to central definition JSON
  // #!# Cases with path have inconsistent naming which would be good to align, then remove 'path' support
  const serverUrl = 'https://nptscot.blob.core.windows.net/pmtiles/';
  const editionDate = '2023-12-17';
  const sources = [
    ['rnet', {dateBased: true, localUrl: 'utilitytrips/'}],
    ['rnet-simplified', {path: 'rnet_simplified', dateBased: true}],
    ['dasymetric', {path: 'dasymetric-simplified', dateBased: true}],
    ['data_zones', {dateBased: true}],
    ['schools', {dateBased: true}],
    ['la'],
    ['wards'],
    ['holyrood'],
    ['wards'],
    ['scot_regions'],
    ['placenames'],
  ];
  
  const enableLocal = false;  // Temporarily set to true to switch to localUrl cases below
  
  // Add sources
  sources.forEach (source => {
    const [sourceId, attributes = {}] = source;
    
    // Construct the URL
    let url = 'pmtiles://';
    if (enableLocal && attributes.localUrl) {
      url += attributes.localUrl;
    } else {
      url += serverUrl;
      url += (attributes.path || sourceId);
    }
    url += (attributes.dateBased ? '-' + editionDate : '');
    url += '.pmtiles';
    
    // Add the source, if it does not already exist
    if (!map.getSource(sourceId)){
      map.addSource(sourceId, {
        'type': 'vector',
        'url': url,
      });
    }
  });
}


function switch_placenames () {
  var checkBox = document.getElementById('placenamescheckbox');
  console.log("Switching place names")
  
  if (map.getLayer("motorway junction numbers")) map.removeLayer("motorway junction numbers");
  if (map.getLayer("small settlement names")) map.removeLayer("small settlement names");
  if (map.getLayer("suburban area names")) map.removeLayer("suburban area names");
  if (map.getLayer("village and hamlet names")) map.removeLayer("village and hamlet names");
  if (map.getLayer("town names")) map.removeLayer("town names");
  if (map.getLayer("city names")) map.removeLayer("city names");
  if (map.getLayer("national park names")) map.removeLayer("national park names");
  if (map.getLayer("capital city names")) map.removeLayer("capital city names");
  if (map.getLayer("country names")) map.removeLayer("country names");
  
  if (checkBox.checked === true) {
    map.addLayer({
      "id": "motorway junction numbers",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 13,
      "filter": ["match", ["get", "type"], ["Motorway Junctions"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          13,
          11,
          16,
          16,
          22,
          30
        ],
        "text-font": ["Source Sans Pro Regular"]
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 10
      }
    });
    
    map.addLayer({
      "id": "small settlement names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 5,
      "filter": ["match", ["get", "type"], ["Small Settlements"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 12, 9, 14, 11],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
        "text-halo-blur": 1
      }
    });
    
    map.addLayer({
      "id": "suburban area names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 10,
      "filter": ["match", ["get", "type"], ["Suburban Area"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10.5, 14, 14],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1,
        "text-padding": ["interpolate", ["linear"], ["zoom"], 10, 10, 14, 2]
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
        "text-halo-blur": 1,
        "text-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 14, 1]
      }
    });
    
    map.addLayer({
      "id": "village and hamlet names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 5,
      "filter": ["match", ["get", "type"], ["Village", "Hamlet"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 9, 9, 14, 15],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1,
        "text-padding": 2
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
        "text-halo-blur": 1,
        "text-opacity": 1
      }
    });
    
    map.addLayer({
      "id": "town names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 5,
      "filter": ["match", ["get", "type"], ["Town"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 7, 10, 14, 18],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1,
        "text-padding": 2
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "text-opacity": 1
      }
    });
    
    map.addLayer({
      "id": "city names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 5,
      "filter": ["match", ["get", "type"], ["City"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 6, 10, 14, 20],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1,
        "text-padding": 2,
        "text-letter-spacing": 0.05
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "text-opacity": 1
      }
    });
    
    map.addLayer({
      "id": "national park names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 5,
      "filter": ["match", ["get", "type"], ["National Park"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 6, 8, 14, 15],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1,
        "text-padding": 2,
        "text-letter-spacing": 0.06
      },
      "paint": {
        "text-color": "rgba(134, 134, 134, 1)",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "text-opacity": 0.8
      }
    });
    
    map.addLayer({
      "id": "capital city names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 5,
      "filter": ["match", ["get", "type"], ["Capital"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 5, 10.5, 14, 22],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1,
        "text-padding": 2,
        "text-letter-spacing": 0.1,
        "text-transform": "uppercase"
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "text-opacity": 1
      }
    });
    
    map.addLayer({
      "id": "country names",
      "type": "symbol",
      "source": "placenames",
      "source-layer": "names",
      "minzoom": 5,
      "maxzoom": 10,
      "filter": ["match", ["get", "type"], ["Country"], true, false],
      "layout": {
        "text-field": ["to-string", ["get", "name"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 5, 18, 10, 35],
        "text-font": ["Source Sans Pro Regular"],
        "text-line-height": 1,
        "text-padding": 2,
        "text-letter-spacing": 0.3,
        "text-transform": "uppercase"
      },
      "paint": {
        "text-color": "#55595c",
        "text-halo-color": "#f1efec",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "text-opacity": 0.35
      }
    });
  }

}


function toggleLayer(layerName) {
  console.log("Toggling layer " + layerName)
  var checkBox = document.getElementById(layerName.concat('checkbox'));
  // If the checkbox is checked add the layer to the map
  if (checkBox.checked === true) {
    if (map.getLayer(layerName)) map.removeLayer(layerName);
    switch (layerName) {
      case 'rnet':
        switch_rnet();
        break;
      case 'routes':
        switch_routes();
        break;
      case 'data_zones':
        switch_data_zones();
        break;
      case 'schools':
        map.addLayer({
            'id': 'schools',
            'type': 'circle',
            'source': 'schools',
            'source-layer': 'schools',
            'paint': {
              "circle-color": [
          			'match',
          			['get', 'SchoolType'],
          			'Primary','#313695',
          			'Secondary','#a50026',
          			/* other */ '#43f22c'
          			],
              // make circles larger as the user zooms
              'circle-radius': {
                'base': 5,
                'stops': [
                  [8, 6],
                  [22, 180]
                ]
              },
            } 
        },'placeholder_name');
        break;
      case 'la':
        map.addLayer({
            'id': 'la',
            'type': 'line',
            'source': 'la',
            'source-layer': 'la',
            'paint': {
              'line-color': 'rgba(107, 7, 7, 1)',
              'line-width': 2
            } 
        },'placeholder_name');
        break;
      case 'wards':
        map.addLayer({
            'id': 'wards',
            'type': 'line',
            'source': 'wards',
            'source-layer': 'wards',
            'paint': {
              'line-color': 'rgba(32, 107, 7, 1)',
              'line-width': 2
            }
        },'placeholder_name');
        break;
      case 'scot_regions':
        map.addLayer({
            'id': 'scot_regions',
            'type': 'line',
            'source': 'scot_regions',
            'source-layer': 'scot_regions',
            'paint': {
              'line-color': 'rgba(186, 177, 6, 1)',
              'line-width': 2
            }
        },'placeholder_name');
        break;
      case 'holyrood':
        map.addLayer({
            'id': 'holyrood',
            'type': 'line',
            'source': 'holyrood',
            'source-layer': 'holyrood',
            'paint': {
              'line-color': 'rgba(83, 123, 252, 1)',
              'line-width': 2
            }
        },'placeholder_name');
        break;
      default:
        console.log('unknown layer selected');
    }
  } else {
    if (map.getLayer(layerName)) map.removeLayer(layerName);
    if (layerName === 'data_zones'){
      //if (map.getLayer('dasymetric')) map.removeLayer('dasymetric');
      switch_data_zones();
    }
  }
}

function switch_rnet() {  
  console.log("Updating rnet")
  var checkBox = document.getElementById('rnetcheckbox');
  var layerPurpose = document.getElementById("rnet_purpose_input").value;
  var layerScenario = document.getElementById("rnet_scenario_input").value;
  var layerColour = document.getElementById("rnet_colour_input").value;
  var layerType = document.getElementById("rnet_type_input").value;
  var sliderQuietness_min = Number(quietnessSlider.noUiSlider.get()[0]);
  var sliderQuietness_max = Number(quietnessSlider.noUiSlider.get()[1]);
  var sliderGradient_min = Number(gradientlider.noUiSlider.get()[0]);
  var sliderGradient_max = Number(gradientlider.noUiSlider.get()[1]);
  var sliderFlow_min = Number(cycleSlider.noUiSlider.get()[0]);
  var sliderFlow_max = Number(cycleSlider.noUiSlider.get()[1]);
  var simplifiedmode = document.getElementById('rnetsimplifiedcheckbox');
  
  if(sliderGradient_max == 10){
    sliderGradient_max = 35
  }

  // Width
  //var layerWidth = document.getElementById("rnet_width_input").value;
  // TODO: Add line width toggle, and link 
  
  var layerWidth2 = layerPurpose + "_" + layerType + "_" + layerScenario;
  
  // Update the Legend - Do this even if map layer is off
  switch(layerColour) {
    case 'none':
      //cycleSlider.noUiSlider.disable();
      document.getElementById("linecolourlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #304ce7"></span>&nbsp</div>
      	</div>`;
      break;
    case 'Quietness':
      //cycleSlider.noUiSlider.disable();
      document.getElementById("linecolourlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #882255"></span>0-25</div>
        <div class="lb"><span style="background-color: #CC6677"></span>25-50</div>
        <div class="lb"><span style="background-color: #44AA99"></span>50-75</div>
        <div class="lb"><span style="background-color: #117733"></span>75-100</div>
      	</div>`;
      break;
    case 'Gradient':
        //cycleSlider.noUiSlider.disable();
        document.getElementById("linecolourlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #59ee19"></span>0-3</div>
        <div class="lb"><span style="background-color: #37a009"></span>3-5</div>
        <div class="lb"><span style="background-color: #FFC300"></span>5-7</div>
        <div class="lb"><span style="background-color: #C70039"></span>7-10</div>
        <div class="lb"><span style="background-color: #581845"></span>10+</div>
      	</div>`;
      break;
    default:
      //cycleSlider.noUiSlider.enable();
      document.getElementById("linecolourlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #9C9C9C"></span>1</div>
        <div class="lb"><span style="background-color: #FFFF73"></span>50</div>
        <div class="lb"><span style="background-color: #AFFF00"></span>100</div>
        <div class="lb"><span style="background-color: #00FFFF"></span>250</div>
        <div class="lb"><span style="background-color: #30B0FF"></span>500</div>
        <div class="lb"><span style="background-color: #2E5FFF"></span>1000</div>
        <div class="lb"><span style="background-color: #0000FF"></span>2000</div>
        <div class="lb"><span style="background-color: #FF00C5"></span>3000+</div>
      	</div>`;
  }
  
  // Update the map if enabled
  if (checkBox.checked === true) {
    if (map.getLayer('rnet')) map.removeLayer('rnet');
    
    // Make the parts of the style
    if (simplifiedmode.checked === true) {
      var style_head = {
        "id": "rnet",
        "type": "line",
        "source": "rnet-simplified",
        "source-layer": "rnet"
      };
    } else {
      var style_head = {
        "id": "rnet",
        "type": "line",
        "source": "rnet",
        "source-layer": "rnet"
      };
    }

    // Only filter cyclists if scenario set
      var style_filter = {
        'filter': ["all",
              ['<=', layerPurpose + "_" + layerType + "_" + layerScenario, sliderFlow_max],
              ['>=', layerPurpose + "_" + layerType + "_" + layerScenario, sliderFlow_min],
              ['<=', "Quietness", sliderQuietness_max],
              ['>=', "Quietness", sliderQuietness_min],
              ['<=', "Gradient", sliderGradient_max],
              ['>=', "Gradient", sliderGradient_min]
           ],
      };

    // Define line colour
    switch (layerColour) {
      case 'none':
        var style_line_colour = {
          "line-color": "#304ce7"
        };
        break;
      case 'Quietness':
        var style_line_colour = {
          "line-color": ["step", ["get", "Quietness"],
            "#882255", 25,
            "#CC6677", 50,
            "#44AA99", 75,
            "#117733", 101,
            "#000000"]
          
        };
        break;
      case 'Gradient':
        var style_line_colour = {
          "line-color": ["step", ["get", "Gradient"],
              "#59ee19", 3,
              "#37a009", 5,
              "#FFC300", 7,
              "#C70039", 10,
              "#581845", 100,
              "#000000"]
        };
        break;
      default:
        var style_line_colour = {
          "line-color": ["step", ["get", layerPurpose + "_" + layerType + "_" + layerScenario],
              "rgba(0,0,0,0)", 1,
              "#9C9C9C", 50,
              "#FFFF73", 100,
              "#AFFF00", 250,
              "#00FFFF", 500,
              "#30B0FF", 1000,
              "#2E5FFF", 2000,
              "#0000FF", 3000,
              "#FF00C5"],
        };
    };
    
    // Define Line Width
    // Implments the formula y = (3 / (1 + exp(-3*(x/1000 - 1.6))) + 0.3)
    // For working this out I deserve a ****ing medal
    var style_line_width = {
          "line-width": [
                "interpolate", 
                ["linear"], 
                ["zoom"],
                12, ["*", 2.1, ["+", 0.3, ["/", 3, ["+", 1, ["^", 2.718, ["-", 2.94, ["*", ["get", layerWidth2], 0.0021]]]]]]],
                14, ["*", 5.25,["+", 0.3, ["/", 3, ["+", 1, ["^", 2.718, ["-", 2.94, ["*", ["get", layerWidth2], 0.0021]]]]]]],
                15, ["*", 7.5, ["+", 0.3, ["/", 3, ["+", 1, ["^", 2.718, ["-", 2.94, ["*", ["get", layerWidth2], 0.0021]]]]]]],
                16, ["*", 18,  ["+", 0.3, ["/", 3, ["+", 1, ["^", 2.718, ["-", 2.94, ["*", ["get", layerWidth2], 0.0021]]]]]]],
                18, ["*", 52.5,["+", 0.3, ["/", 3, ["+", 1, ["^", 2.718, ["-", 2.94, ["*", ["get", layerWidth2], 0.0021]]]]]]],
            ],
        };
    
    var style_paint = {"paint" : {...style_line_colour, ...style_line_width}};
    var style_combined = {...style_head, ...style_filter, ...style_paint};
    map.addLayer(style_combined,'placeholder_name');
    
  } else {
    if (map.getLayer("rnet")) map.removeLayer("rnet");
  }
}

function switch_data_zones() {
  var checkBox = document.getElementById('data_zonescheckbox');
  var layerId = document.getElementById("data_zone_input").value;
  var daysymetricmode = document.getElementById('dasymetriccheckbox');
  
  // Update the Legend - Do this even if map layer is off
  switch(layerId) {
    case 'SIMD2020v2_Decile':
      document.getElementById("dzlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #a50026"></span>1st</div>
        <div class="lb"><span style="background-color: #d73027"></span>2nd</div>
        <div class="lb"><span style="background-color: #f46d43"></span>3rd</div>
        <div class="lb"><span style="background-color: #fdae61"></span>4th</div>
        <div class="lb"><span style="background-color: #fee090"></span>5th</div>
        <div class="lb"><span style="background-color: #e0f3f8"></span>6th</div>
        <div class="lb"><span style="background-color: #abd9e9"></span>7th</div>
        <div class="lb"><span style="background-color: #74add1"></span>8th</div>
        <div class="lb"><span style="background-color: #4575b4"></span>9th</div>
        <div class="lb"><span style="background-color: #313695"></span>10th</div>
      	</div>`;
      break;
    case 'population_density':
      document.getElementById("dzlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #edf8fb"></span>10</div>
        <div class="lb"><span style="background-color: #bfd3e6"></span>50</div>
        <div class="lb"><span style="background-color: #9ebcda"></span>100</div>
        <div class="lb"><span style="background-color: #8c96c6"></span>150</div>
        <div class="lb"><span style="background-color: #8856a7"></span>200</div>
        <div class="lb"><span style="background-color: #810f7c"></span>600</div>
      	</div>`;
      break;
    case 'broadband':
        document.getElementById("dzlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #fff7ec"></span>0%</div>
        <div class="lb"><span style="background-color: #fee8c8"></span>2%</div>
        <div class="lb"><span style="background-color: #fdd49e"></span>5%</div>
        <div class="lb"><span style="background-color: #fdbb84"></span>10%</div>
        <div class="lb"><span style="background-color: #d7301f"></span>50%</div>
        <div class="lb"><span style="background-color: #7f0000"></span>100%</div>
      	</div>`;
      break;
    case 'pcycle':
        document.getElementById("dzlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #A50026"></span>0-1</div>
        <div class="lb"><span style="background-color: #D73027"></span>2-3</div>
        <div class="lb"><span style="background-color: #F46D43"></span>4-6</div>
        <div class="lb"><span style="background-color: #FDAE61"></span>7-9</div>
        <div class="lb"><span style="background-color: #FEE090"></span>10-14</div>
        <div class="lb"><span style="background-color: #ffffbf"></span>15-19</div>
        <div class="lb"><span style="background-color: #C6DBEF"></span>20-24</div>
        <div class="lb"><span style="background-color: #ABD9E9"></span>25-29</div>
        <div class="lb"><span style="background-color: #74ADD1"></span>30-39</div>
        <div class="lb"><span style="background-color: #4575B4"></span>>40</div>
      	</div>`;
      break;
    case 'pcycle_go_dutch':
        document.getElementById("dzlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #A50026"></span>0-1</div>
        <div class="lb"><span style="background-color: #D73027"></span>2-3</div>
        <div class="lb"><span style="background-color: #F46D43"></span>4-6</div>
        <div class="lb"><span style="background-color: #FDAE61"></span>7-9</div>
        <div class="lb"><span style="background-color: #FEE090"></span>10-14</div>
        <div class="lb"><span style="background-color: #ffffbf"></span>15-19</div>
        <div class="lb"><span style="background-color: #C6DBEF"></span>20-24</div>
        <div class="lb"><span style="background-color: #ABD9E9"></span>25-29</div>
        <div class="lb"><span style="background-color: #74ADD1"></span>30-39</div>
        <div class="lb"><span style="background-color: #4575B4"></span>>40</div>
      	</div>`;
      break;
    default:
      document.getElementById("dzlegend").innerHTML = `<div class="l_r">
        <div class="lb"><span style="background-color: #053061"></span>3</div>
        <div class="lb"><span style="background-color: #2166ac"></span>5</div>
        <div class="lb"><span style="background-color: #4393c3"></span>7</div>
        <div class="lb"><span style="background-color: #92c5de"></span>10</div>
        <div class="lb"><span style="background-color: #f7f7f7"></span>15</div>
        <div class="lb"><span style="background-color: #f4a582"></span>30</div>
        <div class="lb"><span style="background-color: #b2182b"></span>60</div>
        <div class="lb"><span style="background-color: #67001f"></span>200</div>
      	</div>`;

  }
  
  var style_head_dy = {
      'id': 'dasymetric',
      'type': 'fill-extrusion',
      'source': 'dasymetric',
      'source-layer': 'dasymetric'
  };
  var style_head_dz = {
      'id': 'data_zones',
      'type': 'fill',
      'source': 'data_zones',
      'source-layer': 'data_zones'
  };
  var style_ex_dy = {
      'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12,
              1,
              15,
              8
            ]
  };
  
  if (checkBox.checked === true) {
    if (map.getLayer('data_zones')) map.removeLayer('data_zones');
    if (map.getLayer('dasymetric')) map.removeLayer('dasymetric');
    
    if (daysymetricmode.checked === true) {
      var fillopacity = 0.1
    } else {
      var fillopacity = 0.8
    }
    
    switch (layerId) {
      case 'SIMD2020v2_Decile':
        var style_col = [
              '#a50026', 1.1,
              '#d73027', 2.1,
              '#f46d43', 3.1,
              '#fdae61', 4.1,
              '#fee090', 5.1,
              '#e0f3f8', 6.1,
              '#abd9e9', 7.1,
              '#74add1', 8.1,
              '#4575b4', 9.1,
              '#313695', 10.1,
              '#000000'
        ];
        break;
      case 'population_density':
        var style_col = [
              '#edf8fb', 10,
              '#bfd3e6', 50,
              '#9ebcda', 100,
              '#8c96c6', 150,
              '#8856a7', 200,
              '#810f7c', 600,
              '#000000'
        ];
        break;
      case 'broadband':
        var style_col = [
              '#fff7ec', 0.01,
              '#fee8c8', 2,
              '#fdd49e', 5,
              '#fdbb84', 10,
              '#d7301f', 50,
              '#7f0000', 100,
              '#000000'
        ];
        break;
        
      case 'pcycle':
        var style_col = [
              '#A50026', 2,
              '#D73027', 4,
              '#F46D43', 7,
              '#FDAE61', 10,
              '#FEE090', 15,
              '#ffffbf', 20,
              '#C6DBEF', 25,
              '#ABD9E9', 30,
              '#74ADD1', 40,
              '#4575B4', 100,
              '#000000'
        ];
        break;
      case 'pcycle_go_dutch':
        var style_col = [
              '#A50026', 2,
              '#D73027', 4,
              '#F46D43', 7,
              '#FDAE61', 10,
              '#FEE090', 15,
              '#ffffbf', 20,
              '#C6DBEF', 25,
              '#ABD9E9', 30,
              '#74ADD1', 40,
              '#4575B4', 100,
              '#000000'
        ];
        break;
      default:
        var style_col = [
              '#053061', 3,
              '#2166ac', 5,
              '#4393c3', 7,
              '#92c5de', 10,
              '#f7f7f7', 15,
              '#f4a582', 30,
              '#b2182b', 60,
              '#67001f', 200,
              '#000000'
        ];
      }
    
    
    if (daysymetricmode.checked === true) {
      var style_paint_dy = {'paint' : { 'fill-extrusion-color': ['step', ['get', layerId ], ...style_col], ...style_ex_dy}};
      var style_combined_dy = {...style_head_dy, ...style_paint_dy};
    } else {
      var style_paint_dy = {'paint' : { 'fill-extrusion-color': '#9c9898', ...style_ex_dy}};
      var style_combined_dy = {...style_head_dy, ...style_paint_dy};
    }
    
    map.addLayer(style_combined_dy, 'roads 0 Guided Busway Casing');
    
    var style_paint_dz = {'paint' : { 'fill-color': ['step', ['get', layerId ], ...style_col], 'fill-opacity': fillopacity,'fill-outline-color': '#000000'}};
    var style_combined_dz = {...style_head_dz, ...style_paint_dz};
    map.addLayer(style_combined_dz, 'roads 0 Guided Busway Casing');
  } else {
    console.log("off");
    if (map.getLayer("data_zones")) map.removeLayer("data_zones");
    
    // put buildings on when layer is off
    if (map.getLayer('dasymetric')) map.removeLayer('dasymetric');
    
    var styleName = displayRadioValue(document.getElementById("basemapform"));
    switch (styleName) {
      case 'greyscale_nobuild':
        var style_paint_dy = {'paint' : { 'fill-extrusion-color': '#d1cfcf', ...style_ex_dy}};
        var style_combined_dy = {...style_head_dy, ...style_paint_dy};
        map.addLayer(style_combined_dy, 'roads 0 Guided Busway Casing');
        break;
      case 'google_nobuild':
        var style_paint_dy = {'paint' : { 'fill-extrusion-color': '#f0eded', ...style_ex_dy}};
        var style_combined_dy = {...style_head_dy, ...style_paint_dy};
        map.addLayer(style_combined_dy, 'roads 0 Guided Busway Casing');
        break;
      case 'dark_nobuild':
        var style_paint_dy = {'paint' : { 'fill-extrusion-color': '#000000', ...style_ex_dy}};
        var style_combined_dy = {...style_head_dy, ...style_paint_dy};
        map.addLayer(style_combined_dy, 'roads 0 Guided Busway Casing');
        break;
      default:
        // No buildings on raster
    }
    
  }
}

// First load setup
map.on('load', function() {
  switch_style();
});
