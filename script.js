let vertices = [];
let vert_coor = {};

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let node_no = 1;
let add_edge = document.getElementById("icon");
let find_btn = document.getElementById("find");
let reset_btn = document.getElementById("reset");
let res_div = document.getElementById("sidediv2");
$(res_div).hide();


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
    node4.setAttribute("type", "number");

    let node5 = document.createElement("button");
    node5.append("Draw");
    node5.setAttribute("class", "draw_btn");


    node.appendChild(node2);
    node.append(" ");
    node.appendChild(node3);
    node.append(" Edge Wt: ");
    node.appendChild(node4);
    node.append(" ");
    node.appendChild(node5);
    document.getElementById("edge-ul").appendChild(node);

    // add event listener
    node5.onclick = function (e){
        let parent = e.target.parentElement;
        console.log(parent);
        let v1 = parent.children[0].value;
        let v2 = parent.children[1].value;
        let w3 = parent.children[2].value;
        console.log(v1, v2, w3);
        draw_edge(v1, v2, "rgb(20, 89, 146)", w3);
    }
}

// draw the edge (event listener)
function draw_edge(v1, v2, color, wt) {
    let coor1 = vert_coor[v1];
    let coor2 = vert_coor[v2];

    ctx.beginPath();
    ctx.moveTo(coor1[0]+10, coor1[1]);
    ctx.lineTo(coor2[0]-10, coor2[1]);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();

    if(wt){
        draw_label(wt, coor1, coor2);
    }
}

function canvas_arrow(v1, v2, color) {
    ctx.beginPath();
    let fromx = vert_coor[v1][0];
    let fromy = vert_coor[v1][1];
    let tox = vert_coor[v2][0];
    let toy = vert_coor[v2][1];

    var headlen = 15; // length of head in pixels
    let arr_x = (fromx+tox)/2;
    let arr_y = (fromy+toy)/2;

    let dx = tox - fromx;
    let dy = toy - fromy;
    // if(arr_x > 40+fromx){
    //     arr_x -= 20;
    //     arr_y = (dy/dx)*(arr_x - fromx) + fromy;
    // }
    
    let angle = Math.atan2(dy, dx);

    ctx.moveTo(fromx+10, fromy);
    ctx.lineTo(tox-10, toy);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color || "green";
    
    
    ctx.moveTo(arr_x, arr_y);
    ctx.lineTo(arr_x - headlen * Math.cos(angle - Math.PI / 6), arr_y - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(arr_x, arr_y);
    ctx.lineTo(arr_x - headlen * Math.cos(angle + Math.PI / 6), arr_y - headlen * Math.sin(angle + Math.PI / 6));

    ctx.stroke();
}

// helper fn, to draw a label
function draw_label(text, v1, v2){
    let dx = parseInt(v2[0] - v1[0]);
    let dy = parseInt(v2[1] - v1[1]-10);  
    console.log(dx, dy);

    let p=v1;
    let pad = parseFloat(1/2);
    let padding = dx/4;
  
    pad = padding / Math.sqrt(dx*dx+dy*dy);
  
    ctx.save();
    ctx.textAlign = "left";
    ctx.translate(parseFloat(p[0] + dx*pad), parseFloat(p[1] + dy*pad));
    // ctx.rotate(Math.atan2(dy,dx));
    if(dx<0){
     ctx.rotate(Math.atan2(dy,dx) - Math.PI);  //to avoid label upside down
    }
    else{
     ctx.rotate(Math.atan2(dy,dx));
    }
    ctx.font = '28px arial';
    ctx.fillStyle = "black"
    ctx.fillText(text, 0, 0);

    ctx.restore();
}


// click on canvas
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


// CANVAS FUNCTIONS
var pointSize = 20;

function getPosition(event){
    var rect = c.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    let cor = [x, y];
    vert_coor[node_no] = cor;

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

// HELPER FN FOR FIND PATH
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

    if(maxRes != -1){
        optPaths[cur_pos]["res"] = maxRes + graph_vertices[cur_pos];
        temp_path.unshift(cur_pos);
    }
    
    optPaths[cur_pos]["path"] = temp_path;
    optPaths[cur_pos]["spt"] = maxST;
    // optPaths[cur_pos]["res"] += graph_vertices[cur_pos];

    visited[cur_pos] = 0; // backtracking
    if(maxRes==-1) return -2;

    console.log("return value:", optPaths[cur_pos]["res"]);
    return optPaths[cur_pos]["res"];
}


// FIND PATH
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

    if(tot_res<0){
        alert("No path is possible! Its not possible to reach the destination vertex in given conditions! ");
    }

    else {
        let path_list = optPaths[src_vertex]["path"];
        
        let res_path = document.getElementById("res-path");
        res_path.innerHTML = "";
        let i;
        for(i=0; i<path_list.length-1; i++){
            canvas_arrow(path_list[i], path_list[i+1], "white");
            res_path.append(path_list[i] + " --> ");   
            // try to add gap
        }
        res_path.append(path_list[i]);

        document.getElementById("res-mrp").innerHTML = tot_res;
        // document.getElementById("res-mst").innerHTML = optPaths[src_vertex]["spt"];
        

        $(res_div).show();
    }
}


// RESET FN
reset_btn.onclick = function (){
    let ele = document.getElementById("res-pot");
    while(ele.firstChild){
        ele.removeChild(ele.lastChild);
    }

    let ele_2 = document.getElementById("edge-ul");
    while(ele_2.firstChild){
        ele_2.removeChild(ele_2.lastChild);
    }

    vertices = [];
    vert_coor = {};
    node_no = 1;
    graph_edges = {};
    graph_vertices = {};
    $(res_div).hide();

    let sel1 = document.getElementById("srcv");
    let sel2 = document.getElementById("destv");
    $(sel1).empty();
    $(sel2).empty();

    ctx.clearRect(0, 0, c.width, c.height);
}
