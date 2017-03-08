
function prep(data){
    var mesh;
    //add triangle mesh one time
    //this will be automatically updated as new triangles gets added to triangleGeom
    for (var i = 0; i< TOTAL_ANSWERS; i ++){
        triangleGroups[i] = new THREE.Geometry();

        mesh = new THREE.Mesh( triangleGroups[i], getEdgeMaterial(i));
        edgeObjects.push(mesh);
        scene.add(mesh);

        mesh = new THREE.Mesh( triangleGroups[i], getFaceMaterial(i));
        faceObjects.push(mesh);
        scene.add(mesh);
    }


    for (var i =0; i < data.nodes.length; i++){

        particle = particles[ i ] = new THREE.Sprite( getSpriteMaterial( data.nodes[i].r , data.nodes[i].group ));
        particle.position.x = ~~d3.randomUniform(-300, 300)()//data.nodes[i].x;
        particle.position.y = ~~d3.randomUniform(-300, 300)(); //data.nodes[i].y;
        particle.position.z = ~~d3.randomUniform(-300, 300)();
        particle.name = i;
        scene.add( particle );

        triangleGroups[data.nodes[i].group].vertices.push(particles[i].position);
    }

    data.links.forEach(function(d){
       addLineBetweenTwoParticles(d.source, d.target);
    })



    simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(function(d) { return d.index })
            .distance(function(d){return d.value})
            .strength(0.3)
            )

        .force("collide",d3.forceCollide( function(d){  return d.r + 30 }).iterations(2) ) //2//16
        .force("charge", d3.forceManyBody(0)
            .strength(-30)  //negative:repell
            .distanceMax(20)
            )
        .force("center", d3.forceCenter(windowHalfX / 2 + THREEcenterShiftX, windowHalfY / 2 + THREEcenterShiftY)) // keeps nodes in the center of the viewport
        .force("y", d3.forceY(0))
        .force("x", d3.forceX(0).strength(0.005)) //0.05

    // var ticked = function() { ///TODO function?
    // }

    simulation
        .velocityDecay(0.6) //default 0.4
        .alphaTarget(0.2) //defaualt 0
        .nodes(data.nodes)
        // .on("tick", ticked) //updates are handled by the THREE render function
        .force("link")
        .links(data.links);


}

function addButtons(){
   svg = d3.select('body').append('svg')


   var defs = svg.append("defs");
   //innerglow
   var filter = defs.append("filter")
     .attr("id","inner-glow")
   filter.append ( "feGaussianBlur")
     .attr("stdDeviation",6/POLYGON_SCALE)
     .attr("result","offset-blur");
   filter.append ( "feComposite")
     .attr("operator","out")
     .attr("in","SourceGraphic")
     .attr("in2","offset-blur")
     .attr("result","inverse");  

  //Filter for the outside glow
  var defs = svg.append("defs");
    var filter = defs.append("filter")
    .attr("id","glow");
  filter.append("feGaussianBlur")
    .attr("stdDeviation","3")
    .attr("result","coloredBlur");
  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
  feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");



   d3.json("data/buttons.json", function(error, dataset){

          if (error) {
              console.log(error);
          }else{

                          //initialize buttons array
              // debugger
            for (var i=0; i < dataset.length ; i ++){
                  buttons[i] = {
                      buttonID: i, // out of 6 buttons.
                      answerID: i, //out of 14 answers
                      timer: 0, //for button event
                      event: null,
                      particleID: -1 ,// for the new particle being added
                      nodeID: -1, //for the new node being added
                      r: -1,
                      x3: dataset[i].x3,
                      y3: dataset[i].y3,
                      animation: -1,

                  };

              }

              svg
              .selectAll("polygon")
              .data(dataset)
              .enter()
              .append("polygon")
                  .attr("class", "button") //"button loading"
                  .attr("id", function(d){ return d.id;}  )
                  .attr("label", function(d){return d.label;})
                  .attr("timer", 0)
                  // .attr("class", "glow")  //add a glow effect
                  .attr("transform", function(d){
                       // "translate(480,480)scale(23)rotate(180)"
                       var s = "translate("+ d.x + "," + d.y + ")scale("+POLYGON_SCALE+")" ;
                       return s;
                  })
                  .attr("points", function(d){
                      // console.log(d.poly)
                      return d.poly;
                  })
                  .attr("fill", function (d,i){ return answers[buttons[i].answerID].color ; })
                  .style("filter","url(#inner-glow)");

              svg.selectAll("text")
                 .data(dataset)
                 .enter()
                 .append("text")
                 .attr("id", function(d){ return "text"+d.id; })
                 .text(function(d) {
                     return answers[d.id].word; ///initialize to the first few words 
                 })
                 .attr("x", function(d) {
                      return d.x+d.tx;
                 })
                 .attr("y", function(d) {
                      return d.y+d.ty;
                 })
                 .attr("text-anchor", "middle")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "13px")
                 .attr("fill", "white");

              svg.selectAll("circle")
                 .data(dataset)
                 .enter()
                 .append("circle")
                 .attr("class","circle")
                 .attr("id", function(d){ return "circle"+d.id; })
                 .attr("opacity", 0.8)
                 .attr("cx", function(d) {
                      return d.x+d.tx;
                 })
                 .attr("cy", function(d) {
                      return d.y+d.ty - 25; //offset aboves text 
                 })
                 .attr("r", 0) //invisiable for now 
                 .style("filter","url(#glow)");

              var lineFunction = d3.line(); //.curve(d3.curveBasis);

              svg.selectAll("path")
                .data(dataset)
                .enter()
                .append("path")
                      .attr("id", function(d, i) {return "path"+i; })
                      .attr("d", function(d){
                        return lineFunction(d.poly)
                      })
                       .attr("transform", function(d){
                        var s = "translate("+ d.x + "," + d.y + ")scale("+POLYGON_SCALE+")" ;
                        return s
                      })
                      .attr("stroke", function (d,i){ return answers[buttons[i].answerID].color ; })
                      .attr("stroke-width", 1)
                      .attr("vector-effect", "non-scaling-stroke")
                      .attr("fill", "none")
                      // .style("filter","url(#glow)")
                      ;    

               d3.selectAll(".button")
                  .on("mousedown", function(){
                     triggerButtonDown(d3.select(this).attr("id"));
                  })
                  .on("mouseup", function() {
                      triggerButtonUp(d3.select(this).attr("id"));
              })

          }
  });
}


function triggerButtonDown(id){
  // debugger
    resetEndOfVoteAnimation(id);
    // console.log("mousedown on button: " + id);
    buttons[id].event = MOUSE_DOWN;
    buttons[id].timer = Date.now() ;
    buttons[id].animation =  ~~d3.randomUniform(0,5)()
}


function triggerButtonUp(id){


    if( buttons[id].timer == 0 || buttons[id].event != MOUSE_DOWN ){
        //with mouse event,  button up can be triggered without button down
        return;
    }

    buttons[id].event = MOUSE_UP;
    buttons[id].timer = Date.now();


    //if r is too small, do nothing
    var cir = d3.select("#circle"+id);
    var cirR = cir.attr("r");

    cir.transition()
        .ease(d3.easeExp)
        .duration(150)
        .attr("r", 0)


    // if (cirR < CIRCLE_R_THRESHOLD) {
    //   buttons[id].animation = -1; //no animation
    //   return;
    // }

    //add particle in THREEJS
    var newNodeID = buttons[id].particleID 
      = data.nodes[data.nodes.length-1]['id']+1;//increment on node id 
    var newNodeR = buttons[id].r = cirR ;//~~d3.randomUniform(MIN_R,MAX_R)();
 
    
    var particle = particles[ newNodeID ]
        = new THREE.Sprite( getSpriteMaterial( newNodeR ,  buttons[id].answerID ) );
    particle.position.copy( htmlToScene (buttons[id].x, buttons[id].y));
    particle.position.z = ~~d3.randomUniform(-300,300)();
    // console.log("button down", particle.position);
    particle.name = newNodeID; 
    scene.add( particle );



    var pID = buttons[id].particleID;

    //if (pID < particles.length){
    if(particles[pID].scale.x > MAX_R){
        particles[pID].scale.x = particles[pID].scale.y = MAX_R;
    }
    particles[pID].material.color.set(answers[buttons[id].answerID].color); //force into same color //matt
    // }else {
    //     console.log("fetching", pID, "from particles array. length:", particles.length );
    // }




    pushBubble(
        buttons[id].x3, //x, y for d3
        buttons[id].y3,
        particles[id].scale.x,
        buttons[id].answerID,
        pID
        );

    if ( data.nodes.length > MAX_NODE_CNT) {
      removeNodeByIndex(0);
      //todo check if remove label 

     // checkLonelyNodes();
    }

}

function pushBubble(bx, by, br, bGroup, pi){

        var newNodeID = pi;/// data.nodes.length; // node 2d -> particle 3d


        //find other nodes within the same group
        //do this before adding itself to avoiding linking to self
        var sameGroup = data.nodes.filter (
                function(d){
                    return +d.group == bGroup;
                } // +turn string to number
            )

        //note that sameGroup dosen't have the new node
        addNode(newNodeID, br, bGroup, bx, by, pi);
        

        //2d links 
        if (sameGroup.length>0){
            //add first link
            var j = ~~d3.randomUniform(0, sameGroup.length)();
            var targetInd = sameGroup[j].id;
            addLink(newNodeID, targetInd);

            //sometimes add a second link
            var k = ~~d3.randomUniform(0, sameGroup.length)();
            if ( k!=j){
                targetInd = sameGroup[k].id;
                addLink(newNodeID, targetInd);
            }

            //add label in THREE
            if (sameGroup.length > 5 && labels[bGroup] == null ){
                console.log('add labels for answer group', bGroup);
                var s = answers[bGroup].word;
                var ind = sameGroup[0].particleID; //pick a random dot
                labels[bGroup] = makeTextSprite(s);
                scene.add(labels[bGroup]);
            }
        }
   
        
        //todo return the value of dots 
        //return a list 

        //  addTriangle(bGroup, pi);

        // //slightly twist the edge to not match the triangles
        // for ( var i = 0, l = edgeObjects.length; i < l; i ++ ) {
        //     var object = edgeObjects[ i ];
        //     object.rotation.x = 0.05;
        //     object.rotation.y = 0.1;
        // }


        restart(data);
    }

function restart(data) {

  // // Apply the general update pattern to the nodes.
  //   node = node.data(data.nodes, function(d) { return d.id;});
  //   node.exit().remove();
  //   node = node.enter().append("circle")
  //       .attr("r", function(d){  return d.r })
  //       .attr("fill", function(d) { return color(d.group); })
  //       // .attr("fill", function(d) { return color(~~d3.randomUniform(20)()); })
  //       .merge(node);

  // // Apply the general update pattern to the links.
  //   link = link.data(data.links, function(d) { return d.source.id + "-" + d.target.id; });
  //   link.exit().remove();
  //   link = link.enter().append("line").merge(link);

  // Update and restart the simulation.
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);
    simulation.alpha(1).restart();
}


function addTriangle(groupID, pi ){

    triangleGroups[groupID].vertices.push(particles[pi].position);

    var l = triangleGroups[groupID].vertices.length;
   
     if (l>2 ){
        var a = l-1 //the new node
        var b = ~~d3.randomUniform(0, l)();

        var c = ~~d3.randomUniform(0, l)();
        while (c = a)
        //todo keep finding random number till it's not the same 
        //up to l-1
        //constrained by dropping probability - density constant? 
        if (a!=b && c!=a){
            triangleGroups[groupID].faces.push( new THREE.Face3( a,b,c ) );
            triangleGroups[groupID].computeFaceNormals();

        }
    }

}

function resetEndOfVoteAnimation (i) {

    switch ( buttons[i].animation){
        case 0: //zoom z
        backgroundGroup.position.z =0;
        backgroundGroup.rotation.x += 1;
        break;

        case 1:
        break;

        case 2:
            var object = faceObjects[ buttons[i]. answerID ];
            object.material.color.set(answers[buttons[i].answerID].color);
            object = edgeObjects[ buttons[i]. answerID ];
            object.material.color.set(answers[buttons[i].answerID].color);
        break;
    }

    buttons[i].timer = 0;
    buttons[i].particleID = -1;
    buttons[i].event = null;
    buttons[i].nodeID = -1;
}

function addLineBetweenTwoParticles(sourceInd,targetInd){

  //make sure indexes are in range
  if (sourceInd < particles.length && targetInd < particles.length){
      var newLineIndex = lines.length;
      var geometryLine = new THREE.Geometry()
      var t = particles[targetInd];
      var s = particles[sourceInd];
      geometryLine.vertices.push(
          new THREE.Vector3( t.position.x, t.position.y, t.position.z ),
          new THREE.Vector3( s.position.x, s.position.y, s.position.z )
      );

      var lineTemp = lines[newLineIndex] = new THREE.Line(geometryLine, lineMaterial)

      if (showDataLinksInLines ){
          scene.add(lineTemp);
      }
  //    console.log("line " + newLineIndex + " added between " + sourceInd + " & " + targetInd) ;
  }

}

function addBackground(){
    backgroundGroup = new THREE.Group();

    //blurry sprite
    var material = new THREE.SpriteMaterial( {
                map: new THREE.CanvasTexture( generateSprite() ),
                blending: THREE.AdditiveBlending,
            } );
//cx
    var doubleX = (AMOUNTX * SEPARATION ) * 2 ;
    var doubleY = (AMOUNTY * SEPARATION ) * 2 ;
    var doubleZ = doubleY;

    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
            particle = new THREE.Sprite( material );
            // particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
            // particle.position.y = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
            particle.position.x = doubleX * (Math.random()-0.5) ;
            particle.position.y = doubleY * (Math.random()-0.5) ;
            particle.position.z = doubleZ * (Math.random()-0.5);

            particle.scale.x = particle.scale.y = Math.random() * 8 + 12;
            backgroundGroup.add( particle );
        }
    }


    scene.add(backgroundGroup);


}