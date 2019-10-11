
//Scroller 1	
		var main = d3.select('#main1');
		var scrolly = main.select('#scrolly1');
		var figure = scrolly.select('#figure1');
		var article = scrolly.select('#article1');
		var step = article.selectAll('#step1');
        
		// initialize the scrollama
		var scroller = scrollama();
		// generic window resize listener event
		function handleResize() {
            
			// 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.75);
			step.style('height', stepH + 'px');
            var figureWidth = window.innerWidth *.5
            var figureHeight = figureWidth/1.35
			var figureMarginTop = (window.innerHeight - figureHeight) / 1.5  
         
            
			figure
				.style('height', figureHeight + 'px')
				.style('top', figureMarginTop + 'px');
			// 3. tell scrollama to update new element dimensions
			scroller.resize();
		};
        
		// scrollama event handlers
        
		function setupStickyfill() {
			d3.selectAll('.sticky').each(function () {
				Stickyfill.add(this);
			});
		};
    
        
        
function  handleStepEnter(resp){
    console.log(resp.index)
                         
        if (resp.index == 0 | resp.index == 1 ) {
                
            d3.selectAll("#color1").attr('opacity', .9)
                
            }
        else if(resp.index == 2){  
            d3.selectAll("#color1").attr('opacity', .1)
            d3.selectAll('.A31').attr('opacity', 1)
            d3.selectAll('.A36').attr('opacity', 1)
            }
            
        else if (resp.index == 3 ){
            d3.selectAll("#color1").attr('opacity', .9)
            d3.selectAll("#color2").attr('opacity', 0)
      
                
            }
            
            else if (resp.index == 4 | resp.index == 5){
            d3.selectAll("#color1").attr('opacity', 0)
            d3.selectAll("#color2").attr('opacity', .9)
            }
            
         }
        
          
        
        
		function init() {
			setupStickyfill();
			// 1. force a resize on load to ensure proper dimensions are sent to scrollama
			handleResize();
			// 2. setup the scroller passing options
			// 		this will also initialize trigger observations
			// 3. bind scrollama event handlers (this can be chained like below)
			scroller.setup({
				step: '#scrolly1 #article1 #step1',
				offset: 0.66,
				debug: false,
                progress: false
			})
				.onStepEnter(handleStepEnter)
			// setup resize event
			window.addEventListener('resize', handleResize);
		};


        
        
        
// ---------- the base map ----------
        
var plans_per_county = d3.map();
var issuers_per_county = d3.map();
var county_names = d3.map();        
var state_names = d3.map();
        
var color = d3.scaleLinear()
    .domain([-20,100, 200])
    .range(["white", "blue"]);

var color2 = d3.scaleLinear()
    .domain([1,2])
    .range(["red", "#FCFCFC"]);
        

var mapsvg = d3.select("#figure1")
     .append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 950 600")
    .attr('id', 'map')
    .classed("svg-content", true);

var path = d3.geoPath();


var promises = [
        d3.json("https://d3js.org/us-10m.v1.json"),
        d3.csv("plans_per_county.csv", function(d) { 
            plans_per_county.set(d.county_fips, +d.count_plans); 
            issuers_per_county.set(d.county_fips, +d.count_issuers);    
            county_names.set(d.county_fips, d.county_name);
            state_names.set(d.county_fips, d.state);
                                                    }
              )
        
        ]
        
 function drawBaseMap() {
     

     Promise.all(promises).then(ready)

     function ready([us]) {
       mapsvg.append("g")
             .classed("svg-content", true)
             .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000")
            .selectAll("path")
             .data(topojson.feature(us, us.objects.counties).features)
             .enter()
             .append("path")
             .attr("class", "countiesbasic")
         .attr('id', 'basemap')
        .attr("d", path)
        .append("title")
             .text(function(d) { return d.count_plans })
         .attr("z",1);

    
         mapsvg.append("g") .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000").append("path")

            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "states")
            .attr("d", path);
}
        };
  
  
        
function colorupdate1() {
     
     Promise.all(promises).then(ready)

     function ready([us]) {
       mapsvg.append("g")
             .classed("svg-content", true)
             .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000")
            .selectAll("path")
             .data(topojson.feature(us, us.objects.counties).features)
             .enter()
             .append("path")
               .on("mouseover", mouseovermap)
             .on("mouseleave", mouseleavemap)
            .attr("fill", function(d) { return color(plans_per_county.get(d.id)); })
            .attr("id", "color1")
            .attr("class", function(d) { return "A" + Math.floor(d.id/1000 ); })
  
         .attr("opacity", 0)
        .attr("d", path)
         .attr("z", 3);

    
         mapsvg.append("g") .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000").append("path")

            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("d", path)
                    .attr("class", "states")
         .attr('color', '#FFF');
       
     
     }
        };
        
        
        
        
function colorupdate2() {
     
     Promise.all(promises).then(ready)

     function ready([us]) {
       mapsvg.append("g")
             .classed("svg-content", true)
             .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000")
            .selectAll("path")
             .data(topojson.feature(us, us.objects.counties).features)
             .enter()
             .append("path")
             .attr("class", "counties")
            .attr("fill", function(d) { return color2(d.count_issuers = issuers_per_county.get(d.id) );})
            .attr("z", 2)
            .attr("id", 'color2')
         .attr("opacity", 0)
        .attr("d", path)
;

    
         mapsvg.append("g") .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000").append("path")

            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "states")
            .attr("d", path)
         .attr('color', '#FFF');
       
     
     }
        };
     
        
        
 var extramap = d3.select("#extramap")
     .append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 950 600")
    .attr('id', 'map')
    .classed("svg-content", true);
     
        

        
     
        
function map3() {
     
     Promise.all(promises).then(ready)

     function ready([us]) {
       extramap.append("g")
             .classed("svg-content", true)
             .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000")
            .selectAll("path")
             .data(topojson.feature(us, us.objects.counties).features)
             .enter()
             .append("path")
            .attr("fill", function(d) { return color(plans_per_county.get(d.id)); })  
         .attr("opacity", .9)
        .attr("d", path)
         .attr("z", 3);

    
         mapsvg.append("g") .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000").append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("d", path)
            .attr("class", "states")
             .attr('color', '#FFF');   
     
     }
        };
        

function map4() {
     
     Promise.all(promises).then(ready)

     function ready([us]) {
       extramap.append("g")
             .classed("svg-content", true)
             .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000")
            .selectAll("path")
             .data(topojson.feature(us, us.objects.counties).features)
             .enter()
             .append("path")
               .on("mouseover", mouseovermap)
             .on("mouseleave", mouseleavemap)
            .attr("fill", function(d) { return color2(d.count_issuers = issuers_per_county.get(d.id) ); })
            .attr("class", function(d) { return "AB" + d.id; })
  
         .attr("opacity", .3)
        .attr("d", path)
         .attr("z", 3);

    
         mapsvg.append("g") .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 2000 2000").append("path")

            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("d", path)
                    .attr("class", "states")
         .attr('color', '#FFF');
       
     
     }
        };   
  
function mouseovermap(d, i){
        
     d3.select(this)
      .attr("opacity", 1)
    

 
     
     d3.select("#countyname").text( county_names.get(d.id) + ", " + state_names.get(d.id)+":")
     d3.select("#issuers").text(  issuers_per_county.get(d.id) + " issuers")

     d3.select("#plans").text(  plans_per_county.get(d.id) + " plans")
   
         d3.select("#tooltip2")
         .style("top", d3.event.pageY + "px")
         .style("left", d3.event.pageX + "px")
          .style("visibility","visible");
   
  };
  
        
        
  function mouseleavemap(d) {
    d3.select(this).style("opacity", .3);
  d3.select("#tooltip2")
                .style("visibility","hidden");
  };   
        
        
        
        
//------------------------------------------------------------------
//Second Scroller          
        
		// using d3 for convenience
     
		var main2 = d3.select('#main2');
		var scrolly2 = main2.select('#scrolly2');
		var figure2 = scrolly2.select('#figure2');
		var article2 = scrolly2.select('#article2');
		var step2 = article2.selectAll('#step2');
        
		// initialize the scrollama
		var scroller2 = scrollama();
		// generic window resize listener event
        
		function handleResize2() {
			// 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.50);
            
			step2.style('height', stepH + 'px');
            var figureWidth = window.innerWidth *.5
            var figureHeight = figureWidth *.75
			var figureMarginTop = window.innerHeight*.25
            
			figure2
				.style('height', figureHeight + 'px')
				.style('top', figureMarginTop + 'px');
            
			// 3. tell scrollama to update new element dimensions
			scroller2.resize();
		};
        
		// scrollama event handlers

		function setupStickyfill() {
			d3.selectAll('.sticky').each(function () {
				Stickyfill.add(this);
			});
		};
        
        
    
        
  // ----- Draw Scatterplots
     
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;
     
var scattersvg = d3.select("#figure2")
     .append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 " + width + " " + height )
 //   .attr('id', 'scatter')
//    .classed("svg-content", true)
 
     
var countyfacts
 
var x
var y

function draw1() {
d3.csv("county_facts.csv")
       .then( 
       function(response) { 
              
      countyfacts = response;
     

 x = d3.scaleLinear()
    .domain([0,  d3.max(response, function(d) { return d.Min_PREMI27;})
            ])
    .range([ 0, width*.9 ]);
  scattersvg.append("g")
    .attr("transform", "translate(" +width*.06 + "," + .91*height + ")")
    .call(d3.axisBottom(x));
           
    scattersvg.append("text")             
      .attr("transform",
            "translate(" + (width*.55) + " ," + 
                           (height *.98) + ")")
      .style("text-anchor", "middle")
       .style("font-size", 24)
      .text("Minimum Monthly Premium ($)")
           .attr("id", "xtext")
           


 y = d3.scaleLinear()
    .domain([0, 
             d3.max(response, function(d) { return d.count_issuers; })*1.1
])
    .range([  height*.9, 0 ]);


scattersvg.append("g")
    .attr("transform", "translate(" +width*.06 + "," + .01*height + ")")
.selectAll("#dot")
    .data(response)
  .enter()
  .append("circle")
  .attr("cx", function(d) { return x( +d.Min_PREMI27)})
 .attr("cy", function(d) { return y(Math.random() + .25)})
   .attr("r", 5)
        .attr("opacity", .1)
    .attr("class", "dot")
    .attr("id", function(d) { return d.Region})
    
  });

}
     
     
     
     
 function  handleStepEnter2(resp){
     
            console.log(resp.index)

     if (resp.index == 0 ) {
         
        scattersvg.selectAll("#yax").remove()
        scattersvg.selectAll("#ytext").remove()
         
         d3.selectAll(".dot")
        .data(countyfacts)
        .transition()
            .attr("cy", function(d) { return y(Math.random() + .25)})
               }
     
     else if (resp.index == 1 ) {
           
        scattersvg.append("g")
         .attr("transform", "translate(" +width*.06 + "," + .01*height + ")")

      .call(d3.axisLeft(y))
           .attr("id", "yax");
  
    scattersvg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 1)
      .attr("x",0 - (height*.45))
      .attr("dy", "1em")
         .attr("font-size", 24)
      .style("text-anchor", "middle")
      .text("Issuers")
         .attr("id", "ytext");      

         
             d3.selectAll("#xtext").text("Minimum Monthly Premium ($)")
     
         
         d3.selectAll(".dot")
             .data(countyfacts)
             .transition()
             .attr("cx", function(d) { return x( d.Min_PREMI27) })
            .attr("cy", function(d) { return y( d.count_issuers) })
        }
     

                   
    else if (resp.index == 2) {
               
        d3.selectAll(".dot")
            .data(countyfacts)
            .transition()
            .attr("cx", function(d) { return x( d.Med_PREMI27) })    
        
        d3.selectAll("#xtext").text("Median Monthly Premium ($)")

        
     }
     
    else if (resp.index == 3) {
         
        d3.selectAll(".dot")
            .data(countyfacts)
            .transition()
            .attr("cx", function(d) { return x( d.Max_PREMI27) })
            .attr("fill", "black")
            .attr("opacity", .1)   
        
    d3.selectAll("#xtext").text("Maximum Monthly Premium ($)")

     }
     
       else if (resp.index == 4) {
         
        d3.selectAll(".dot")
            .data(countyfacts)
            .transition()
            .attr("cx", function(d) { return x( d.Max_PREMI27) })
            .attr("fill", "black")
            .attr("opacity", .1)     
               d3.selectAll("#xtext").text("Maximum Monthly Premium ($)")

           
     }
     
     
     else if (resp.index == 5) { 
     
         d3.selectAll(".dot")
             .attr("opacity", .01)
             .data(countyfacts)
             .transition()
             .attr("cx", function(d) { return x( d.Min_PREMI27) })
                
         d3.selectAll("#South")
             .attr("fill", "red")
             .attr("opacity", 1)
             .attr("z-index", 10)     
         
             d3.selectAll("#xtext").text("Minimum Monthly Premium ($)")

     }
     
     
     else if (resp.index == 6) { 
     
         d3.selectAll(".dot")
             .attr("opacity", .01)
             .attr("fill", "black")
             .data(countyfacts)
             .transition()
             .attr("cx", function(d) { return x( d.Min_PREMI27) })
             .attr("cy", function(d) { return y( d.count_issuers) })


        
         d3.selectAll("#West")
             .transition()
             .attr("fill", "blue")
             .attr("opacity", 1)
             .attr("z-index", 10)
     }
   }
        
 
     
        
        
		function init2() {
            drawBaseMap();
            colorupdate1();
            colorupdate2();
            init();
            map3();
            map4();
			setupStickyfill();
            draw1();
			// 1. force a resize on load to ensure proper dimensions are sent to scrollama
			handleResize2();
			// 2. setup the scroller passing options
			// 		this will also initialize trigger observations
			// 3. bind scrollama event handlers (this can be chained like below)
			scroller2.setup({
				step: '#scrolly2 #article2 #step2',
				offset: 0.66,
				debug: false,
                progress: false
			})
				.onStepEnter(handleStepEnter2)

			// setup resize event
			window.addEventListener('resize', handleResize2);

		};
		// kick things off
        
        
    
   // Third Scroller ---------------------
     
     //------------------------------------------------------------------
//Third Scroller          
        
		// using d3 for convenience
     
		var main3 = d3.select('#main3');
		var scrolly3 = main3.select('#scrolly3');
		var figure3 = scrolly3.select('#figure3');
		var article3 = scrolly3.select('#article3');
		var step3 = article3.selectAll('#step3');
        
		// initialize the scrollama
		var scroller3 = scrollama();
		// generic window resize listener event
        
		function handleResize3() {
			// 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.6);
            
			step3.style('height', stepH + 'px');
            var figureWidth = window.innerWidth *.5
            var figureHeight = figureWidth *.75
			var figureMarginTop = window.innerHeight*.27
            
			figure3
				.style('height', figureHeight + 'px')
				.style('top', figureMarginTop + 'px');
            
			// 3. tell scrollama to update new element dimensions
			scroller3.resize();
		};
        
		// scrollama event handlers

		function setupStickyfill() {
			d3.selectAll('.sticky').each(function () {
				Stickyfill.add(this);
			});
		};
        
        
// <---------------------->
var margin3 = {top: 10, right: 30, bottom: 30, left: 60},
    width3 = 1000 - margin.left - margin.right,
    height3 = 750 - margin.top - margin.bottom;
     
var scattersvg3 = d3.select("#figure3")
     .append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 " + width + " " + height )
 //   .attr('id', 'scatter')
//    .classed("svg-content", true)
 
     
var silverplans = [];
 
var x3
var y3


function draw3() {
d3.csv("silverplans.csv")
       .then( 
       function(response) { 
        console.log(response[0]);
        
      silverplans = response;
     

 x3 = d3.scaleLinear()
    .domain([-.1, 80.1
            ])
    .range([ 0, width3*.9 ]);

 y3 = d3.scaleLinear()
    .domain([-.1,  86.1
])
    .range([  height3*.9, 0 ]);


scattersvg3.append("g")
    .attr("class", "plans")
    .selectAll(".dot3")
    .data(response)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x3(d.xint )})
    .attr("cy", function(d) { return y3(d.yint)})
    .attr("r", Math.sqrt(height3*width3/6830)/3.14)
    .attr("transform", "translate(" +width*.05 + "," + .05*height + ")")
    .attr("opacity", 0)
    .attr("class", function(d) {return d.ST + " " + d.deductible_value + " dot3"})
    .attr("id", function(d) { return d.ER_Deductible}).exit().remove()
    
  });

}
       
var x4
var y4
     
var countyplans    
     
function draw4() {
     d3.csv("county_facts.csv")
       .then( 
            function(response) { 
            console.log(response[0]);
        
      countyplans = response;
     

 x4 = d3.scaleLinear()
    .domain([-2, 60.1])
    .range([ 0, width3*.9 ]);

 y4 = d3.scaleLinear()
    .domain([-2,  66.1])
    .range([  height3*.9, 0 ]);


scattersvg3.append("g")
    .attr("class", "counties")
    .selectAll(".dot4")
    .data(response)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x4(d.xint1 )})
    .attr("cy", function(d) { return y4(d.yint1)})
    .attr("r", Math.sqrt(height3*width3/(3500))/3.14)
    .attr("transform", "translate(" +width*.05 + "," + .05*height + ")")
    .attr("opacity", 0)
    .attr("class", function(d) {return d.ST + "1" + " " + "A"+d.Min_Med_Deduct  + " dot4"})
    .attr("id", function(d) { return "A" + d.ER_COUNTY_NO_CHOICE }).exit().remove()
    
scattersvg3.append("text").attr("x", function() {return x4(54)}).attr("y", function() {return y4(62)}).text("78.7%").attr("opacity",0)       
scattersvg3.append("text").attr("x", function() {return x4(20)}).attr("y", function() {return y4(62)}).text("52.0%").attr("opacity",0) 
      
scattersvg3.append("text")
    .attr("x", function() {return x4(47)}).attr("y", function() {return y4(-2)})
    .text("Single Issuer Districts")
    .attr("opacity",0)
           .attr("transform", "translate(" +width*.05 + "," + .05*height + ")")

scattersvg3.append("text")
    .attr("x", function() {return x4(10)})
    .attr("y", function() {return y4(-2)})
    .text("Multi-Issuer Districts").attr("opacity",0)   
    .attr("transform", "translate(" +width*.05 + "," + .05*height + ")")
           
  });
}
       
     
     
     
     
function  handleStepEnter3(resp){
     
            console.log(resp.index)
    
    if (resp.index == 0 ) {
        d3.selectAll(".dot3").attr("fill", "black").attr("opacity", 0)
               }

    if (resp.index == 1 ) {
        d3.selectAll(".dot3").attr("fill", "black").attr("opacity", .7)
        }
    
    else if (resp.index == 2 ) {
        d3.selectAll(".dot3").attr("opacity", .7)
        d3.selectAll("#FullDeductible").attr("fill", "red")
          }
                 
    else if (resp.index == 3) {
        d3.selectAll(".dot3").attr("opacity", .1)
        d3.selectAll(".SC").attr("opacity", .7)   
     }  
     
    else if (resp.index == 4) {         
        d3.selectAll(".dot3").attr("opacity", .1)
        d3.selectAll(".greaterthan4000").attr("opacity", .7)       
     }
     
       
     else if (resp.index == 5) { 
         d3.selectAll(".dot3").attr("opacity", .1)
         d3.selectAll(".greaterthan4000").attr("opacity", .7)
         d3.selectAll("#FullDeductible").attr("fill", "red")
         d3.selectAll(".dot4").attr("opacity", 0)  
     }
     
     
    else if (resp.index == 6) { 
        d3.selectAll(".dot3").attr("opacity", 0)
        d3.selectAll(".dot4").attr("fill", "black").attr("opacity", .7)
     }     
    
    else if (resp.index == 7) {
        
         d3.selectAll(".dot4")
            .data(countyplans)
            .transition()
            .attr("cx", function(d) { return x4(d.xint1 )})
            .attr("cy", function(d) { return y4(d.yint1)})
        
        d3.selectAll("#A1").attr("fill", "red")

        d3.selectAll("text").attr("opacity", 0)   
    }
    
    else if (resp.index == 8) {
        
        d3.selectAll(".dot4")
            .data(countyplans)
            .transition()
            .attr("cx", function(d) { return x4(d.xint2 )})
            .attr("cy", function(d) { return y4(d.yint2)});
        
        d3.selectAll(".dot4").attr("opacity", .7)

        d3.selectAll("#A1").attr("fill", "red")

        d3.selectAll("text").attr("opacity", 1) 
    }

               }
      
 
     
var choice = d3.map();
var state_names2 = d3.map();
var county_names2 = d3.map();
var OM_Choice = d3.map();
var ER_Choice = d3.map();
var Min_Deduct = d3.map();

     
var promises2 = [
        d3.json("https://d3js.org/us-10m.v1.json"),
        d3.csv("county_facts.csv", function(d) { 
            choice.set(d.county_fips, +d.ER_COUNTY_NO_CHOICE);    
            county_names2.set(d.county_fips, d.county_name);
            state_names2.set(d.county_fips, d.ST);
             OM_Choice.set(d.county_fips, d.OM_Pay);
             ER_Choice.set(d.county_fips, d.ER_Pay);
            Min_Deduct.set(d.county_fips, d.Med_Med_Deduct)
                                                    }
              )
        
        ]
     

var color3 = d3.scaleLinear()
    .domain([1,0])
    .range(["red", "#000"]);


var extramap2 = d3.select("#extramap2")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 950 600")
    .attr('id', 'map')
    .classed("svg-content", true);
     
     
function map5() {
     
     Promise.all(promises2).then(ready)

     function ready([us]) {
       extramap2.append("g")
                .classed("svg-content", true)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 2000 2000")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter()
                .append("path")
                .on("mouseover", mouseovermap2)
                .on("mouseleave", mouseleavemap2)
                .attr("fill", "#000")
                .attr("class", function(d) { return "AB" + d.id; })
  
                .attr("opacity", .5)
                .attr("d", path)
                .attr("z", 3);

    
         extramap2.append("g") .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 2000 2000").append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                 .attr("class", "states")
                .attr("d", path);     
     
     
     }
        };   
  
function mouseovermap2(d, i){
        
    d3.select(this).attr("opacity", 1)   
    d3.selectAll("#countyname").text( county_names2.get(d.id) + ", " + state_names2.get(d.id)+":")
    d3.selectAll("#choices").text( "ER Payment: "+ ER_Choice.get(d.id) )
    d3.selectAll("#OMchoices").text("Mental Healthcare: " + OM_Choice.get(d.id))
    d3.selectAll("#deduct").text( "Median Deductible: "+ Min_Deduct.get(d.id))
    d3.select("#tooltip3")
        .style("top", d3.event.pageY + "px")
        .style("left", d3.event.pageX + "px")
        .style("visibility","visible");
   
  };
        
function mouseleavemap2(d) {
    d3.select(this).style("opacity", .5);
    d3.select("#tooltip3").style("visibility","hidden");
  };   
         
         
function init3() {
    init2();
    draw3();
    draw4();
    map5() ;
			// 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize3();
			// 2. setup the scroller passing options
			// 		this will also initialize trigger observations
			// 3. bind scrollama event handlers (this can be chained like below)
    scroller3.setup({
				step: '#scrolly3 #article3 #step3',
				offset: 0.66,
				debug: false,
                progress: true
			})
				.onStepEnter(handleStepEnter3)

			// setup resize event
			window.addEventListener('resize', handleResize3);

		};     
    
        
        
        
        
        
        
           