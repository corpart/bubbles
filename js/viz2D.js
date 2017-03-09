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
        console.log("nodeInd is out of boundary");
        return;
    }

    var node = data.nodes[nodeInd];
    var newlinks = [];
    console.log("removing node", node);
    for(var i = 0; i < data.links.length; i++){
        if ((data.links[i]['source'] === node) || (data.links[i]['target'] === node)) {
            console.log("remove link source", data.links[i]['source'].id, "target", data.links[i]['target'].id);
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


    var pid = name;//selectedParticle.name;
    var groupID = selectedParticle.groupID;
    var i = 0;
    var newfaces = [];
    // console.log(triangleGroups[groupID].faces.length)
    debugger
    while (i < triangleGroups[groupID].faces.length){
        // console.log("group",groupID,"face",i,":", triangleGroups[groupID].faces[i].a, 
        // ' ',triangleGroups[groupID].faces[i].b , ' ' ,triangleGroups[groupID].faces[i].c );
        if(pid == triangleGroups[groupID].faces[i].a 
            ||pid == triangleGroups[groupID].faces[i].b  
            ||pid == triangleGroups[groupID].faces[i].c )
        {
             // console.log("remove face", i, "for particle ",name);
             // scene.remove(triangleGroups[groupID].faces[i]);

             // triangleGroups[groupID].faces.splice(i,1);
             // triangleGroups[groupID].elementsNeedUpdate = true;
            
        } else {
            newfaces.push(triangleGroups[groupID].faces[i]);
        }

        i++; 
    }
    triangleGroups[groupID].faces = newfaces;
    triangleGroups[groupID].elementsNeedUpdate = true;

    console.log("remove particle ", name);
    scene.remove(selectedParticle);

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