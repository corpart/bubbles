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
    var i = 0;
    var n = data.nodes[nodeInd];
    console.log("remove node", n);
    while(i<data.links.length){
        if( (data.links[i]['source'] == n )||(data.links[i]['target']==n)){
            console.log("remove link source", data.links[i]['source'].id, "target", data.links[i]['target'].id);
            data.links.splice(i, 1);
        }
        else i++;
    }
   
    data.nodes.splice(nodeInd, 1);

    removeParticleByName(n.particleID);
    // console.log("new nodes size ", data.nodes.length);
    
}


function removeNodeByID(nodeID){
    var i = 0;
    var n = findNodeByID(nodeID);
    if (n==undefined) {
        console.log ("no node with ID", nodeID, "found");
        return ;
    }
    
    while(i<data.links.length){
        if( (data.links[i]['source'] == n )||(data.links[i]['target']==n)){
            console.log("remove link source", data.links[i]['source'].id, "target", data.links[i]['target'].id);
            data.links.splice(i, 1);
        }
        else i++;
    }
    
    console.log("remove node", findNodeIndex(nodeID));
    data.nodes.splice(findNodeIndex(nodeID), 1);

    removeParticleByName(n.particleID);

    // console.log("new nodes size ", data.nodes.length);
    
}

function removeParticleByName(name){
    var selectedParticle = scene.getObjectByName(name);
    if (selectedParticle !== undefined){
        console.log("remvoe particle ", name);
        scene.remove(selectedParticle);
    }else{
        console.log("cannot find particle ", name);
    }
}


function addLink(nodeID1, nodeID2){
    data.links.push ({
        source: nodeID1 ,
        target: nodeID2,
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