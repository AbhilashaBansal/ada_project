let vertices = [];

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let node_no = 1;
let add_edge = document.getElementById("icon");
let find_btn = document.getElementById("find");

// add edge function
add_edge.onclick = function(){
    //set ids & classes
    let node = document.createElement("LI"); 
    node.setAttribute("class", "ed_lis");

    let node2 = document.createElement("select"); 
    node2.setAttribute("class", "sel1");
    let node3 = document.createElement("select"); 
    node3.setAttribute("class", "sel2");

    for(let i=0; i<vertices.length; i++){
        let newOption = new Option(vertices[i], vertices[i]);
        node2.add(newOption,undefined);
    }
    for(let i=0; i<vertices.length; i++){
        let newOption = new Option(vertices[i], vertices[i]);
        node3.add(newOption,undefined);
    }

    let node4 = document.createElement("input");
    node4.setAttribute("class", "wt");
    let textnode = document.createTextNode(" "); 
    let textnode2 = document.createTextNode(" Edge Wt: "); 
    node.appendChild(node2);
    node.appendChild(textnode);
    node.appendChild(node3);
    node.appendChild(textnode2);
    node.appendChild(node4);
    document.getElementById("edge-ul").appendChild(node);
}

$("#myCanvas").click(function(e){
    getPosition(e);

    let node = document.createElement("LI"); 
    node.setAttribute("class", "rp_lis");

    let node2 = document.createElement("input"); 
    node2.setAttribute("type", "number");
    node2.setAttribute("id", "point"+node_no);   
    node2.setAttribute("class", "rp_inps");  

    let textnode = document.createTextNode(node_no + ": "); 
    
    // dynamically appending options for src & dest vertex
    vertices.push(node_no);
    let newOption = new Option(node_no, node_no);
    document.getElementById("srcv").add(newOption);
    let newOption2 = new Option(node_no, node_no);
    document.getElementById("destv").add(newOption2);

    node.appendChild(textnode);  
    node.appendChild(node2);                         
    document.getElementById("res-pot").appendChild(node);
    node_no++;
});


// canvas functions
var pointSize = 20;

function getPosition(event){
    var rect = c.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
        
    drawCoordinates(x,y);
}

function drawCoordinates(x,y){	
    var ctx = document.getElementById("myCanvas").getContext("2d");


    ctx.fillStyle = "rgb(37, 75, 156)"; // Blue color

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();

    let cord_str = x + ", " + y;
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(node_no, x, y);
}

find_btn.onclick = function() {
    //process vertices w/ RPs & edges
    // note : Add check condns later
    let graph_vertices = {};
    let graph_edges = {};
    let rp_list = document.getElementsByClassName("rp_inps");
    for(let i=0; i<rp_list.length; i++) {
        // console.log(rp_list[i].value);
        let num = parseInt(rp_list[i].id.substring(5));
        graph_vertices[num] = parseInt(rp_list[i].value);
        graph_edges[num] = {};
    }
    console.log(graph_vertices);

    let sel1 = document.getElementsByClassName("sel1");
    let sel2 = document.getElementsByClassName("sel2");
    let ed_wt = document.getElementsByClassName("wt");
    for(let j=0; j<ed_wt.length; j++){
        // all bidirectional edges rn
        let to = parseInt(sel1[j].value);
        let from = parseInt(sel2[j].value);
        let weight = parseInt(ed_wt[j].value);
        graph_edges[to][from] = weight;
        graph_edges[from][to] = weight;
    }

    console.log(graph_edges);

    let src_vertex = parseInt(document.getElementById("srcv").value);
    let dest_vertex = parseInt(document.getElementById("destv").value);
    let time_const = parseInt(document.getElementById("tc").value);
    console.log(src_vertex, dest_vertex, time_const);
}
