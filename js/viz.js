
(function(){
    "use strict"

    var width,height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select("#graph").append("svg")
    var chartLayer = svg.append("g").classed("chartLayer", true)
    
    var data

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

        ////load data from json  
        d3.json("data/data.json", function(error, dataset){
                if (error) {
                    console.log(error);
                }else{
                    console.log(dataset);
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

        // https://github.com/d3/d3-force/blob/master/README.md#forceCollide
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.index }))
            .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(2) ) //16
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(chartWidth / 2, chartWidth / 2))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))
            // .alphaTarget(1)
            .on("tick", ticked);

        
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
            .attr("stroke", "grey")

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", function(d){  return d.r })
            .attr("fill", function(d) { return color(d.group); })
              // Mousover Node - highlight node by fading the node colour during mouseover
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));    

        
        var ticked = function() {
            // console.log("ticked")

            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
    
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }  
        
        simulation
            .nodes(data.nodes)
            .on("tick", ticked);
    
        simulation.force("link")
            .links(data.links);    
        
        
          d3.selectAll(".pop-data")
            .on("click", function() {
            pop(data);
        })

        function pop(data){
            // console.log(data.links)

            // data.links.push({source: "1", target: "4", value: 1});
            //  console.log(data.links)
            
            // console.log(data.nodes)

            // data.nodes.push({id: "6", r:100, group:3});
            data.nodes.pop();
             // console.log(data)


            // var obj = {
            //    'id':~~d3.randomUniform(10)(),
            //    'r': ~~d3.randomUniform(10,20)() ,
            //    'fx': 100,
            //    'fy': 100,
            //    'group': ~~d3.randomUniform(0,5)()
            // }
            //  console.log(obj);
            //  data.nodes.push(obj)

            //   var obj = {
            //    'source':~~d3.randomUniform(5)(),
            //    'target': ~~d3.randomUniform(5)(),
            //    'value': ~~d3.randomUniform(0,5)()
            // }
            //  console.log(obj);
            //  data.links.push(obj)

            restart(data);


        }


        function restart(data) {
          console.log(data);

          // Apply the general update pattern to the nodes.
            node = node.data(data.nodes, function(d) { return d.id;});
          node.exit().remove();
          node = node.enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).merge(node);

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

// function addBubble(){
    
//     obj = {
//        'id':~~d3.randomUniform(10)(),
//        'r': ~~d3.randomUniform(10,20)() ,
//        'group': ~~d3.randomUniform(0,5)()
//     }
//     // console.log(obj);
//     data.push(obj)
//     // refreshGraph()

// }


