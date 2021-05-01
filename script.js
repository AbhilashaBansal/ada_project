var c = document.getElementById("myCanvas");
console.log(c);
var ctx = c.getContext("2d");

let node_no = 1;

$("#myCanvas").click(function(e){
    getPosition(e);

    var node = document.createElement("LI"); 
    node.setAttribute("class", "rp_lis");
    var node2 = document.createElement("input"); 
    node2.setAttribute("type", "number");
    node2.setAttribute("id", "point"+node_no);   
    node2.setAttribute("class", "rp_inps");  
    var textnode = document.createTextNode(node_no + ": RP ");  
    node.appendChild(textnode);  
    node.appendChild(node2);                         
    document.getElementById("res-pot").appendChild(node);
    node_no++;
});

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