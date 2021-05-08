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

let graph_vertices = {};
let graph_edges = {};

function traverse(cur_pos, tc, b, visited, optPaths) {
    if(tc<0) return -2;

    if(cur_pos==b){
        optPaths[b]["spt"] = tc;
        optPaths[b]["path"] = [];
        optPaths[b]["path"].push(b);
        optPaths[b]["res"] = graph_vertices[b];
        console.log("base case");
        return optPaths[b]["res"];
    }

    // let copiedOptPaths = JSON.parse(JSON.stringify(optPaths));
    let maxRes = -1, rec_ans, maxST = -1;
    visited[cur_pos] = 1;
    let temp_path = [];

    for(let i=0; i<graph_edges[cur_pos].length; i++){
        let toVis = graph_edges[cur_pos][i][0];
        let nbr_wt = graph_edges[cur_pos][i][1];
        console.log(toVis, nbr_wt);
        
        if(visited[toVis]==0){
            visited[toVis]=1;
            rec_ans = traverse(toVis, tc-nbr_wt, b, visited, optPaths);
            visited[toVis]=0;

            // if(rec_ans>maxRes || (rec_ans==maxRes && (maxST<optPaths[b]["spt"]))){
            if(parseInt(rec_ans)>parseInt(maxRes) || (rec_ans==maxRes && (maxST<optPaths[b]["spt"]))){
                maxRes = rec_ans;
                maxST = optPaths[b]["spt"];

                temp_path = optPaths[toVis]["path"];
                // optPaths[cur_pos] = optPaths[toVis];
                console.log("max res update:", maxRes, optPaths[cur_pos]["path"]);
            }
        }

    }

    optPaths[cur_pos]["res"] = maxRes + graph_vertices[cur_pos];
    temp_path.unshift(cur_pos);
    optPaths[cur_pos]["path"] = temp_path;
    optPaths[cur_pos]["spt"] = maxST;
    // optPaths[cur_pos]["res"] += graph_vertices[cur_pos];

    visited[cur_pos] = 0; // backtracking
    if(maxRes==-1) return -2;

    console.log("return value:", optPaths[cur_pos]["res"]);
    return optPaths[cur_pos]["res"];
}

find_btn.onclick = function() {
    //process vertices w/ RPs & edges
    // note : Add check condns later
    graph_vertices = {};
    graph_edges = {};

    let optPaths = {};
    let visited = {};

    let rp_list = document.getElementsByClassName("rp_inps");
    for(let i=0; i<rp_list.length; i++) {
        // console.log(rp_list[i].value);
        let num = parseInt(rp_list[i].id.substring(5));
        graph_vertices[num] = parseInt(rp_list[i].value);
        graph_edges[num] = [];
        optPaths[num] = {"res": -2, "spt": -2, "path": []};
        visited[num] = 0;
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

        let arr1 = [];
        let arr2 = [];
        arr1.push(from, weight);
        arr2.push(to, weight);
        graph_edges[to].push(arr1);
        graph_edges[from].push(arr2);
        // graph_edges[to][from] = weight;
        // graph_edges[from][to] = weight;
    }

    console.log(graph_edges);

    let src_vertex = parseInt(document.getElementById("srcv").value);
    let dest_vertex = parseInt(document.getElementById("destv").value);
    let time_const = parseInt(document.getElementById("tc").value);
    console.log(src_vertex, dest_vertex, time_const);

    let tot_res = traverse(src_vertex, time_const, dest_vertex, visited, optPaths);
    console.log(tot_res);
    console.log("Max Research Possible:", optPaths[src_vertex]["res"]);
    console.log("Path:", optPaths[src_vertex]["path"]);
    console.log("Spare Time: ", optPaths[src_vertex]["spt"]);
}
