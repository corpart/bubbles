// function changeTextSprite(message,group){
//   var canvas = document.createElement('canvas');
//   var context = canvas.getContext('2d');
  
//   var message = "It works!";

//   context.fillStyle = "rgba(0, 0, 0, 1.0)"; // CLEAR WITH COLOR BLACK (new BG color)
//   context.fill(); // FILL THE CONTEXT
//   context.fillStyle = "rgba(255, 0, 0, 1.0)"; // RED COLOR FOR TEXT
//   context.fillText(message, context.lineWidth, 24 + context.lineWidth); // WRITE TEXT

//   labels[group].map.needsUpdate = true; // AND UPDATE THE IMAGE..

// }

function makeTextSprite( message, parameters )
{

  if ( parameters === undefined ) parameters = {};
  
  var fontface = parameters.hasOwnProperty("fontface") ? 
    parameters["fontface"] : "Arial";
  
  var fontsize = parameters.hasOwnProperty("fontsize") ? 
    parameters["fontsize"] : 40;

  var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
    parameters["borderThickness"] : 4;
  
  var borderColor = parameters.hasOwnProperty("borderColor") ?
    parameters["borderColor"] : { r:0, g:0, b:0, a:0.0 };
  
  var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
    parameters["backgroundColor"] : { r:255, g:255, b:255, a:0.2 };

  var textColor = parameters.hasOwnProperty("backgroundColor") ?
    parameters["textColor"] : { r:255, g:255, b:255, a:1.0 };

  // var spriteAlignment = THREE.SpriteAlignment.topLeft;
    
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
    
  // get size data (height depends only on font size)
  // debugger
  var metrics = context.measureText( message );
  var textWidth = metrics.width;
  
  // background color
  context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                  + backgroundColor.b + "," + backgroundColor.a + ")";
  // border color
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                  + borderColor.b + "," + borderColor.a + ")";

  context.lineWidth = borderThickness;
  // roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
  // 1.4 is extra height factor for text below baseline: g,j,p,q.
  
  // text color
  context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + ","
                  + textColor.b + "," + textColor.a + ")";

  context.fillText( message, borderThickness, fontsize + borderThickness);
  
  // canvas contents will be used for a texture
  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial( 
    { map: texture} );
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(200,100,1.0);
  return sprite;  
}

  //  var textObject = new THREE.Object3D();
  //  // var sprite = new THREE.Sprite(texture);
  //   textHeight = fontsize;
  //   textObject.textWidth = (textWidth / textHeight) * textHeight;
  //   sprite.scale.set(textWidth / textHeight * fontsize, fontsize, 1);

  // //  sprite.position.set(10,10,0);

  //   textObject.add(sprite);
  //   return textObject;



// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
  ctx.stroke();   
}
