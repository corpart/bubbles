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