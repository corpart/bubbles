
(function(){
    "use strict"

    var width,height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select("#graph").append("svg")
    var chartLayer = svg.append("g").classed("chartLayer", true)
    
    var data

    var buttons 

    var buttonData = [
                {id: 0, label: "addBubble",  x: 10, y: 500 },
                {id: 1, label: "addbubble1", x: 80, y: 500 },
                {id: 2, label: "addbubble2", x: 190, y: 500 },
                {id: 3, label: "addbubble2", x: 260, y: 500 },
                {id: 4, label: "addbubble2", x: 370, y: 500 },
                {id: 5, label: "addbubble2", x: 430, y: 500 }
                ];

    main()
    
    function main() {

        var range = 50
        var totalGroup = 5

        svg.append("text")
             .text("hello dad and hello mom i'm da dadadadadata points")
             .attr("x",10)
             .attr("y",15);

        ////fake some random data 
        // var data = {
        //     nodes:d3.range(0, range).map(function(d){ return {
        //         label: "l"+d ,
        //         // fx: d*10,
        //         // fy: d*2,
        //         r:~~d3.randomUniform(8, 30)(), 
        //         group: ~~(d/(range/totalGroup)),

        //     }}), 
        //     // links:d3.range(0, range).map(function(){ return {source:~~d3.randomUniform(range)(), target:~~d3.randomUniform(range)()} })        
        //     links:d3.range(1, range).map(function(d){ return {
        //         source:d, 
        //         target:d-1,
        //         // value:
        //         } })      //form a chain for debugging
        // }
        // setChartSize(data)
        // drawChart(data)    
        
       
        //load data from json  
        d3.json("data/data.json", function(error, dataset){
                if (error) {
                    console.log(error);
                }else{
                    // console.log(dataset);
                    data = dataset ;
                    setChartSize(data)
                    drawChart(data)    
                    
                }
        });
         
        
    }
     

    function setChartSize(data) {
        width = document.querySelector("#graph").clientWidth
        height = document.querySelector("#graph").clientHeight
    
        margin = {top:10, left:10, bottom:0, right:0 }
        
        chartWidth = width - (margin.left+margin.right)
        chartHeight = height - (margin.top+margin.bottom)
        
        svg.attr("width", width).attr("height", height)
          
        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[margin.left, margin.top]+")")
                
    }


    function drawChart(data) {

        
        var color = d3.scaleOrdinal(d3.schemeCategory20);     
        // var colors = d3.scale.category10()
        //          .range(["#FFFF00",  //YELLOW
        //                  "#377eb8",  //BLUE
        //                  "#4daf4a",  //GREEN
        //                  "#e41a1c"  //red
        //                  ]);

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().
            append("circle")
            .attr("r", function(d){  return d.r })
            .attr("fill", function(d) { return color(d.group); })
             // .call(d3.drag()
             //    .on("start", dragstarted)
             //    .on("drag", dragged)
             //    .on("end", dragended));    

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink()
                .id(function(d) { return d.index })
                .distance(function(d){return d.value})
                .strength(0.1)
                )

            .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(2) ) //16
            .force("charge", d3.forceManyBody(0)
                .strength(-30)  //negative:repell 
                // .distanceMax(100)
                )
            .force("center", d3.forceCenter(chartWidth / 2, chartWidth / 2-100)) // keeps nodes in the center of the viewport
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0).strength(0.05))
            // .on("tick", ticked);


        var ticked = function() {
            // console.log("ticked")
            // fullspeed 
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
    
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            // //slow down 
            // link
            //     .transition().duration(300)
            //     .attr("x1", function(d) { return d.source.x; })
            //     .attr("y1", function(d) { return d.source.y; })
            //     .attr("x2", function(d) { return d.target.x; })
            //     .attr("y2", function(d) { return d.target.y; });
    
            // node
            //     .transition ().duration(300)
            //     .attr("cx", function(d) { return d.x; })
            //     .attr("cy", function(d) { return d.y; });
             

     
        }  
        
        simulation
            .nodes(data.nodes)
            .on("tick", ticked)
            .force("link")
            .links(data.links);
        

            //buttons 
        buttons = svg
            .selectAll("rect")
            .data(buttonData)
            .enter()
            .append("rect")
            .attr("class", "button")
            .attr("id", function(d){ return d.id;}  )
            .attr("x",function(d){return d.x} )
            .attr("y",function(d){return d.y} )
            .attr("fill", function (d,i){ return color(i); })
            .attr("startTime", undefined )
            .attr("elapsed", 0 )
            .attr("scale",1)
            .attr("touching", false)
            ; 

        
        d3.selectAll(".pop-data")
            .on("click", function() {
            popBubble(data);
        })
        
        d3.selectAll(".button")
            .on("mousedown", function(){
                console.log("mousedown on button: " + d3.select(this).attr("id") );
                //record time 
                // d3.select(this).attr("touchStartTime") = new Date().getTime();  
                
            })
            .on("mouseup", function() {
            // console.log("button clicked: " + d3.select(this).attr("id") );
            pushBubble(d3.select(this).attr("x"),d3.select(this).attr("y"), d3.select(this).attr("id"));
        })

        // d3.timer(buttonTick);

        // function buttonTick(){
        //     // buttons.forEach(function (d) {
        //     //     console.log(d.id);
        //     // })
        //     console.log(buttons)


        // }


        function popBubble(){
            data.nodes.pop();
            //TODO needs to pop links too
            restart();

        }

        function pushBubble(bx, by, bi){
            
            var newID = data.nodes.length;
            data.nodes.push({
                id:  newID, 
                r: ~~d3.randomUniform(10,20)(), 
                x:bx,
                y:by,
                group:  bi });
            
            //link to other nodes with same group 
            var sameGroup = data.nodes.filter ( 
                    function(d){ return +d.group == bi; } //turn string to number
                )
            if (sameGroup.length>0){
                var j = ~~d3.randomUniform(0, sameGroup.length)(); 
                // console.log("connecting " + newID + " & " + sameGroup[j].id ); 
                data.links.push ({source: newID , target: sameGroup[j].id, value:1 })

                j = ~~d3.randomUniform(0, sameGroup.length)(); 
                // console.log("connecting " + newID + " & " + sameGroup[j].id ); 
                data.links.push ({source: newID , target: sameGroup[j].id, value:1 })



                //data.links.push ({source: newID , target: sameGroup[sameGroup.length-1].id , value:1 })
            }
            
            restart(data);
        }




        function restart(data) {
          
          // Apply the general update pattern to the nodes.
            node = node.data(data.nodes, function(d) { return d.id;});
            node.exit().remove();
            node = node.enter().append("circle")
                .attr("r", function(d){  return d.r })
                .attr("fill", function(d) { return color(d.group); })
                // .attr("fill", function(d) { return color(~~d3.randomUniform(20)()); })
                .merge(node);
    
          // Apply the general update pattern to the links.
            link = link.data(data.links, function(d) { return d.source.id + "-" + d.target.id; });
            link.exit().remove();
            link = link.enter().append("line").merge(link);

          // Update and restart the simulation.
            simulation.nodes(data.nodes);
            simulation.force("link").links(data.links);
            simulation.alpha(1).restart();
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        } 

    }




}());


