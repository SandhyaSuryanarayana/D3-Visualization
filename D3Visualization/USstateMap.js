var w = 960;
var h = 450;
active = d3.select(null);

var projection = d3.geoAlbersUsa()
  .scale(850)
  .translate([350, h/2]);

var geoGenerator = d3.geoPath()
  .projection(projection);

  /*var color = d3.scaleQuantize()
								.range(["rgb(237,248,233)","rgb(186,228,179)"]);*/

  d3.json("us-states.json").then (function(geojson) {

    d3.csv('us-cities_new.csv'). then(function(data){
      for (var i = 0; i < data.length; i++) {
				
        //Grab state name
        var dataState = data[i].place;
        //console.log(data[i].place)
    
        //Find the corresponding state inside the GeoJSON
        for (var j = 0; j < geojson.features.length; j++) {
        
          var jsonState = geojson.features[j].properties.name;

          if (dataState == jsonState) {
        
            //Make the value true if the states are equal.
            geojson.features[j].properties.value = true;
            
            //Stop looking through the JSON
            break;
            
          }
        }		
      }
      var u = d3.select('#content g.map')
      .selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attr('d', geoGenerator)
      .style("fill", function(d){
        var value = d.properties.value;
        if (value) {
          //If value exists…
          return "#80ccff";
        } else {
          //If value is undefined…
          return "#ccc";
        }
      })
      .attr('stroke','#ffffff')
      .attr('stroke-width','2')
      .on("click", clicked);
      
      u.on('mouseover', function(d){
            
      d3.select('#content .centroid')
        .style('display', 'inline')
        .attr('transform', 'translate(' + geoGenerator.centroid(d) + ')')

      d3.select('#content .txt')
        .attr('transform', 'translate(' + geoGenerator.centroid(d) + ')')
        .text(d.properties.name)
        .attr('font-size',"15px");
});
     
});
    function clicked(d) {
      if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this).classed("active", true);

var bounds = geoGenerator.bounds(d),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = 1 / Math.max(dx / w, dy / h),
    translate = [w / 2 - scale * x, h / 2 - scale * y];
      d3.select('g')
      .transition()
    .duration(800)
    .style('opacity',0.5)
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
    ;
}

function reset() {
active.classed("active", false);
active = d3.select(null);

d3.select('g').transition()
    .duration(200)
    .style('opacity',1)
    .style("stroke-width", "1.5px")
    .attr("transform", "");
}

});

function StateDescription(z) {
  if(z.toLowerCase()=="florida"){
  y=  "Florida, one of the most popular tourist destinations in the United States. Plan your adventures \
     \ in the Sunshine State with this list of the best places to visit in Florida:\
      \ #1 Orlando: At the heart of Florida's tourist industry is the city of Orlando, home to internationally \
       \ known theme parks like Walt Disney World, Universal Studios, and SeaWorld.  \
       \ #2 From the art deco architecture along Ocean Drive to the scantily clad beachgoers on South Beach, \
       \ this Miami offshoot attracts everyone from relaxed retirees to night owls.";
      }
      else if(z.toLowerCase()=="new york"){
        y= "New York state is home to the biggest city in the United States, sprawling national and state \
        \ parks, and beach communities that captivate both domestic and international travelers. \
        \ #1 New York City: A hub for culture, the arts, food and sightseeing \
        \ #2 Niagara Falls: The tumbling, frothy falls. The best way to see Niagara Falls is on a Maid of the Mist boat tour " 
      }
      else if (z.toLowerCase()=="colorado"){
        y = "Colorado's scenic terrain draws millions of travelers looking to get swept up in its natural splendor. \
        \ Best Places to Visit in Colorado includes: \
        \ #1 Breckenridge: Remnants of Breckenridge's history as a mining hub give the town an aesthetic that is simply darling.\
        \ When the powder melts, the verdant vegetation that floods the trails make Breck magical. \
        \ #2 Stemboat Springs: Here, travelers can take advantage of nearly 3,000 acres of skiable terrain."
      }
      else if (z.toLowerCase()=="california"){
        y = "The Golden State gets its name for a reason. California's diverse cultural and geographical offerings, \
        \ vibrant cities and critically acclaimed culinary scenes are truly the gold standard for travelers. \
        \ California's best vacation destinations include: #1 San Francisco: San Francisco brims with life everywhere you go.\
        \ the city's energy is downright electric. #2 Yosemite: One of the country's most popular national parks. \
        \ Yosemite offers every adventure activity you can possibly think of also, don't leave without exploring Glacier Point, Half Dome and Vernal Fall."
      }
  return y;
}

//Creating drop downs
function myFunction(){
var z = document.getElementById("StateDrpdwn").value;

d3.json("us-states.json").then (function(geojson) { 
      for (var j = 0; j < geojson.features.length; j++) {
        //console.log('z is'+z)
        var jsonState = geojson.features[j].properties.name;
          
        if (z==jsonState) {
            //console.log(dataState)
            //Copy the data value into the JSON
            geojson.features[j].properties.value = true;
            
            //Stop looking through the JSON
            break;
          }
      }
      
      document.getElementById("demo").innerHTML = StateDescription(z)

      d3.select('#content g.map')
      .selectAll('path')
      .data(geojson.features) 
      .attr('d', geoGenerator)
      .style("fill", function(d){
        var value = d.properties.value;
        if (value) {
          //If value exists…
          return "red";
        } else {
          //If value is undefined…
          return "#ccc";
        }
      })

  })
}


//EnterState function: Takes input from input field and changes the color of the new state
var Cities_temp = []
function EnterState() {
  var x = document.getElementById("myForm").elements[0].value;
  document.getElementById("demo").innerHTML = x;
  
  Cities_temp.push({place: x})
  console.log(Cities_temp)

  d3.json("us-states.json").then (function(geojson) { 
    d3.csv('us-cities_new.csv'). then(function(data){
      data = data.concat(Cities_temp);
      console.log(data)
      for (var i = 0; i < data.length; i++) {     
				
        //Grab state name
        var dataState = data[i].place;
    
        //Find the corresponding state inside the GeoJSON
        for (var j = 0; j < geojson.features.length; j++) {
        
          var jsonState = geojson.features[j].properties.name;

          if (dataState==jsonState) {
            //console.log(dataState)
            //Copy the data value into the JSON
            geojson.features[j].properties.value = true;
            
            //Stop looking through the JSON
            break;
          }
        }		
      }
      for (var j = 0; j < geojson.features.length; j++) {
        0
        var jsonState = geojson.features[j].properties.name;

        if (x==jsonState) {
          //Copy the data value into the JSON
          geojson.features[j].properties.value = true;

          //Stop looking through the JSON
          break;
        }
      }
   d3.select('#content g.map')
      .selectAll('path')
      .data(geojson.features) 
      .attr('d', geoGenerator)
      .style("fill", function(d){
        var value = d.properties.value;
        if (value) {
          //If value exists…
          return "#80ccff";
        } else {
          //If value is undefined…
          return "#ccc";
        }
      })
    })
  })
}


