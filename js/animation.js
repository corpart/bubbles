function htmlToScene( htmlX, htmlY ){
  
  x = ( htmlX / window.innerWidth ) * 2 - 1;
  y = - ( htmlY / window.innerHeight ) * 2 + 1;
  z = 0.5;
  var vector = new THREE.Vector3(x,y,z);
    
  vector.unproject( camera );

  var dir = vector.sub( camera.position ).normalize();
  var distance = (0- camera.position.z) / dir.z;
  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  // console.log("htmlToScene",htmlX, htmlY, pos);
  // debugger
  return pos;

}


function getIndOfWord (s){
  var i = answers.length;
  while( i-- ) {
      if( answers[i].word.toLowerCase() === s.toLowerCase() ) return i ;
  }
  console.error( s , "is not on the word list");
  return -1;
}

function getColorOfWord (s){
  var ind = getIndOfWord(s); 
  if(ind != -1 ) { 
    return answers[ind].color; 
  }else {
    console.error("no color for the word", s);
    return undefined;
  }
}




function newStationWord(sid, word) {
  
    var newInd = getIndOfWord(word);
    var newColor = getColorOfWord(word);
    //countdown on the station sid with animation
    var path = svg.select("#path"+sid)
    var poly = svg.select("[id='"+sid +"']") // button polygon
   
    var totalLength = path.node().getTotalLength() * POLYGON_SCALE;

    //ease out current graphics
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", 0)
      .transition()
        .duration(STATION_COUNTDOWN)
        .ease(d3.easeQuad)
        .attr("stroke-dashoffset", totalLength)
        .on("end", function(){
          buttons[sid].answerID = newInd;
          console.log("set button",sid, "to answer No.", buttons[sid].answerID );
        });
    
    poly
      .attr("opacity", 1)
      .transition()
        .delay(STATION_COUNTDOWN/2)
        .duration(STATION_COUNTDOWN/2)
        .attr("opacity", 0);
  

    d3.select("#text"+sid)
      .attr("fill-opacity", 10 )
      .transition()
      // .ease(d3.easeBounce)
      .delay(STATION_COUNTDOWN/2)
        .duration(STATION_COUNTDOWN/2)
        .attr("fill-opacity", 0)
        // .on("end", function(){
        //   return  this.attr("fill-opacity",0);
        // });

       

    ///then bring up the new word 
    path
      .transition()
      .delay(STATION_COUNTDOWN)
        .attr("stroke", "white")
        .duration(1200)
        .attr("stroke-dashoffset", 0)
        .attr("stroke", newColor);
    
    poly
      .transition()
        .delay(STATION_COUNTDOWN)
        .duration(500)
        .attr("fill", newColor)
        .attr("opacity", 1);

    d3.select("#text"+sid)
      .transition()
      .delay(STATION_COUNTDOWN)
        .duration(500)
        .attr("fill-opacity", 1)
        .text(word)  


    console.log("%c button " + sid + " set to " + word ,
     'color:'+ newColor +'; display: block;' )
    //'background: green; color:'+ getColorOfWord(word) +'; display: block;'
}