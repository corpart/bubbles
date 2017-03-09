  function getSpriteMaterial( r, groupID ){
        return  new THREE.SpriteCanvasMaterial( {
            color: answers[groupID].color,
            program: function ( context ) {
                context.beginPath();
                context.arc( 0, 0, r, 0, PI2, true );
                context.fill();
            }
        } );

    }



    //for the triangles
    function getEdgeMaterial (answerID){
        return new THREE.MeshBasicMaterial( {
            color: answers[answerID].color,
            // color: 0X666666,
            opacity: 0.7, //0.3
            wireframe: true
             } )
    }

    function getFaceMaterial (answerID){
        return new THREE.MeshBasicMaterial( { color: answers[answerID].color, opacity:0.2, //0.2
            side: THREE.DoubleSide ,
            transparent: true,
            blending: THREE.AdditiveBlending } );


    }

    function generateSprite() {

        var canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext( '2d' );
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(100,255,255,1)' );
        gradient.addColorStop( 0.4, 'rgba(0,0,21,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );

        return canvas;

    }
