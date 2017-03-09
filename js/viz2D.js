// http://bl.ocks.org/ericcoopey/6c602d7cb14b25c179a4

function addNode(nodeID, nodeR, nodeGroup, nodeX, nodeY, pID){

    data.nodes.push({
        id:  nodeID,
        r: nodeR,
        x: nodeX,
        y: nodeY,
        group:  nodeGroup,
        particleID: pID
    });
}


function removeNodeByIndex(nodeInd){
    
    if(nodeInd >= data.nodes.length){
      //  console.log("nodeInd is out of boundary");
        return;
    }

    var node = data.nodes[nodeInd];
    var newlinks = [];
   // console.log("removing node", node);
    for(var i = 0; i < data.links.length; i++){
        if ((data.links[i]['source'] === node) || (data.links[i]['target'] === node)) {
          //  console.log("remove link source", data.links[i]['source'].id, "target", data.links[i]['target'].id);
            // data.links.splice(i, 1);
        } else {
            newlinks.push(data.links[i]);
        }
    }
    data.links = newlinks;
   
    data.nodes.splice(nodeInd, 1);

    removeParticleByName(node.particleID);
    // console.log("new nodes size ", data.nodes.length);
    
}

function checkLonelyNodes(){
    var nodeID ;
    for (var j = 0; j < data.nodes.length; j++) {
        var i= 0;
        nodeID = data.nodes[j].id ;
        var s = "Node ID " + nodeID + " connections: " ;

        while(i<data.links.length){
            if( (data.links[i]['source'].id === nodeID )||(data.links[i]['target'].id === nodeID)){
                s += data.links[i]['source'].id;
                s += '+'
                s += data.links[i]['target'].id;
                s += ',';
            } 
            i++;
        }
        s+='\n';
        console.log(s);
    }
    
}

function removeParticleByName(name){
    var selectedParticle = scene.getObjectByName(name);
    if (selectedParticle === undefined){
        console.log("cannot find particle ", name);
        return;
    }

    var groupID = selectedParticle.groupID;
    var vidx = getVertexIndexFromParticleId(groupID, name);
    var newfaces = [];
    // console.log(triangleGroups[groupID].faces.length)
    // debugger
    for(var i = 0; i < triangleGroups[groupID].faces.length; i++){
        // console.log("group",groupID,"face",i,":", triangleGroups[groupID].faces[i].a, 
        // ' ',triangleGroups[groupID].faces[i].b , ' ' ,triangleGroups[groupID].faces[i].c );
        if(vidx === triangleGroups[groupID].faces[i].a 
            || vidx === triangleGroups[groupID].faces[i].b  
            || vidx === triangleGroups[groupID].faces[i].c )
        {
             // console.log("remove face", i, "for particle ",name);
             // scene.remove(triangleGroups[groupID].faces[i]);

             // triangleGroups[groupID].faces.splice(i,1);
             // triangleGroups[groupID].elementsNeedUpdate = true;
            
        } else {
            newfaces.push(triangleGroups[groupID].faces[i]);
        }
    }
    triangleGroups[groupID].faces = newfaces;
    triangleGroups[groupID].elementsNeedUpdate = true;

//    console.log("remove particle ", name);
    scene.remove(selectedParticle);

    // updateLabel(groupID);

}


function updateLabel(groupID){

  if (labels[groupID] !== undefined){
        var sameGroup = data.nodes.filter (
                function(d){
                    return +d.group == groupID;
                } // +turn string to number
            )
        var gl = sameGroup.length;

        if(gl < LABEL_THRESHOLD){
            labels[groupID].position.x = 0;
            labels[groupID].position.y = 0;
            labels[groupID].position.z = 20000;
            console.log(groupID,"is out of boundary");
        } else{
            // getVertexIndexFromParticleId(groupID, name)
            triangleGroups[groupID].computeBoundingBox();
            labels[groupID].position.x = sameGroup[0].x;//triangleGroups[groupID].vertices[0].x
            labels[groupID].position.y = sameGroup[0].y;//triangleGroups[groupID].vertices[0].y - 20
            
            labels[groupID].position.z = triangleGroups[groupID].boundingBox.max.z +0.1;
        }
    }
}




function addLink(nodeID1, nodeID2){
    data.links.push ({
        source: findNodeByID(nodeID1) ,
        target: findNodeByID(nodeID2),
        value:~~d3.randomUniform(1, 5)()
    })
    // addLineBetweenTwoParticles(nodeID1, nodeID2)
}

// function removeLink (source, target) {
//     for (var i = 0; i < nodes.links.length; i++) {
//         if (nodes.links[i].source.id == source && nodes.links[i].target.id == target) {
//             nodes.links.splice(i, 1);
//             break;
//         }
//     }
// };



var findNodeByID = function (id) {
    for (var i in data.nodes) {
        if (data.nodes[i]["id"] === id) return data.nodes[i];
    }
    console.error("cannot find node with ID"+ id);
    ;
};

var findNodeIndex = function (id) {
       for (var i = 0; i < data.nodes.length; i++) {
           if (data.nodes[i].id == id) {
               return i;
           }
       }
       ;
};