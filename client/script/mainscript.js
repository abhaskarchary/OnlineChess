var BOARD_SIZE = 8;
var CANVAS_WIDTH = document.getElementById("game").width;
var CANVAS_HEIGHT = document.getElementById("game").height;
var GAME_STATE = "start";
var MOUSE_CLICK_X = -1;
var MOUSE_CLICK_Y = -1;
var selected = [-1,-1];

var ctx = document.getElementById("game").getContext("2d");


var debuginfo = document.getElementById("deb");
var highlightmatrix = [ false, false, false, false, false, false, false, false];

// initialise the board
function initialiseBoard(){
    board = [
        ['br','bk','bb','bq','bking','bb','bk','br'],  
        ['bp','bp','bp','bp','bp','bp','bp','bp'],  
        ['b','b','b','b','b','b','b','b'],  
        ['b','b','b','b','b','b','b','b'],  
        ['b','b','b','b','b','b','b','b'],  
        ['b','b','b','b','b','b','b','b'],  
        ['wp','wp','wp','wp','wp','wp','wp','wp'],  
        ['wr','wk','wb','wq','wking','wb','wk','wr']  
    ];      
    
    GAME_STATE = 'play';
}

// make black and white board
function drawBoard(){
    var draw = true;
    for(var i=0; i<BOARD_SIZE; i++){
        draw = !draw;
        for(var j=0 ; j<BOARD_SIZE; j++){
            if(draw){
                ctx.save();
                ctx.fillStyle = "#b5acac";
                ctx.fillRect(i*CANVAS_WIDTH/BOARD_SIZE, j*CANVAS_HEIGHT/BOARD_SIZE, CANVAS_WIDTH/BOARD_SIZE, CANVAS_HEIGHT/BOARD_SIZE);
                ctx.restore();
            }else{
                ctx.save();
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(i*CANVAS_WIDTH/BOARD_SIZE, j*CANVAS_HEIGHT/BOARD_SIZE, CANVAS_WIDTH/BOARD_SIZE, CANVAS_HEIGHT/BOARD_SIZE);
                ctx.restore();
            }
           
            draw = !draw;
        }
    }
}

// make red highlights according to the position of the mouse
function highlightMove(){
    for(var i=0; i< BOARD_SIZE; i++){
        for(var j=0; j<BOARD_SIZE; j++){
             if(highlightmatrix[i*BOARD_SIZE+j]){
//                alert("yes");
                ctx.save();
                ctx.lineWidth = 5;
                ctx.strokeStyle = "#e81c1c";
                ctx.strokeRect(i*CANVAS_WIDTH/BOARD_SIZE, j*CANVAS_HEIGHT/BOARD_SIZE, CANVAS_WIDTH/BOARD_SIZE-1, CANVAS_HEIGHT/BOARD_SIZE-1);
                ctx.restore();
            }
        }
    }
}

function highlightSelect(){
    var possibleMoves = []
    if(MOUSE_CLICK_X!=-1){
        switch(board[MOUSE_CLICK_Y][MOUSE_CLICK_X].charAt(1)){
            case 'r':
                possibleMoves = possibleMovesRook(MOUSE_CLICK_Y, MOUSE_CLICK_X, board[MOUSE_CLICK_Y][MOUSE_CLICK_X].charAt(0)); 
                break;
            case 'k':
                if(board[MOUSE_CLICK_Y][MOUSE_CLICK_X].length == 2)
                    possibleMoves = possibleMovesKnight(MOUSE_CLICK_Y, MOUSE_CLICK_X, board[MOUSE_CLICK_Y][MOUSE_CLICK_X].charAt(0)); 
                break;
            case 'b':
                possibleMoves = possibleMovesBishop(MOUSE_CLICK_Y, MOUSE_CLICK_X, board[MOUSE_CLICK_Y][MOUSE_CLICK_X].charAt(0));
                break;
            case 'p':
                possibleMoves = possibleMovesPawn(MOUSE_CLICK_Y, MOUSE_CLICK_X, board[MOUSE_CLICK_Y][MOUSE_CLICK_X].charAt(0));
                break;
                
                    
        }
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#e8e01c";
        for(var i=0; i<possibleMoves.length; i++){
            ctx.strokeRect(possibleMoves[i][1]*CANVAS_WIDTH/BOARD_SIZE, possibleMoves[i][0]*CANVAS_HEIGHT/BOARD_SIZE, CANVAS_WIDTH/BOARD_SIZE-1, CANVAS_HEIGHT/BOARD_SIZE-1);
        }
        ctx.strokeStyle = "#1ce8e0";
        ctx.strokeRect(MOUSE_CLICK_X*CANVAS_WIDTH/BOARD_SIZE, MOUSE_CLICK_Y*CANVAS_HEIGHT/BOARD_SIZE, CANVAS_WIDTH/BOARD_SIZE-1, CANVAS_HEIGHT/BOARD_SIZE-1);
        selected[0] = MOUSE_CLICK_X;
        selected[1] = MOUSE_CLICK_Y;
        ctx.restore();
        
    }
}

// capture mouse move
document.onmousemove = function(mouse){
    var position = findTopLeft(document.getElementById("game"));
    var offsetX = position.left, offsetY = position.top;
    var x = mouse.clientX - offsetX;     
    var y = mouse.clientY - offsetY;
    document.getElementById("deb").innerHTML = x+","+y+" "+MOUSE_CLICK_X+","+MOUSE_CLICK_Y+"\n";
//    alert(x+","+y);
    for(var i=0; i<BOARD_SIZE; i++){
        for(var j=0; j<BOARD_SIZE; j++){
            if(i*CANVAS_WIDTH/BOARD_SIZE <= x && x <= (i+1)*CANVAS_WIDTH/BOARD_SIZE && j*CANVAS_HEIGHT/BOARD_SIZE <= y && y <= (j+1)*CANVAS_HEIGHT/BOARD_SIZE){
                highlightmatrix[i*BOARD_SIZE+j] = true;
            }else{
                highlightmatrix[i*BOARD_SIZE+j] = false;
            }
        }
    }
}

//find the coordinates of canvas
function findTopLeft(element) {
  var rec = document.getElementById("game").getBoundingClientRect();
  return {top: rec.top + window.scrollY, left: rec.left + window.scrollX};
}

//fill the pieces in the board
function fillPieces(){
    for(var i = 0; i<BOARD_SIZE; i++){
        for(var j=0; j<BOARD_SIZE; j++){
            if(board[i][j]!='b'){
                var img = document.getElementById(board[i][j]);
                ctx.drawImage(img, j*CANVAS_WIDTH/BOARD_SIZE, i*CANVAS_HEIGHT/BOARD_SIZE, 0.92*CANVAS_WIDTH/BOARD_SIZE, 0.92*CANVAS_HEIGHT/BOARD_SIZE);
            }
        }
    }
}

function makeMove(x2, x1, y2, y1){
    document.getElementById("deb").innerHTML += board[y1][y2]+" "+board[x1][x2];
    board[y1][y2] = board[x1][x2];
    board[x1][x2] = 'b';
    
}

//find block in which mouse is clicked
function changeClickPos(event){
    var x = event.clientX - findTopLeft(document.getElementById("game")).left;
    var y = event.clientY - findTopLeft(document.getElementById("game")).top;
    for(var i=0; i<BOARD_SIZE; i++){
        for(var j=0; j<BOARD_SIZE; j++){
            if(i*CANVAS_WIDTH/BOARD_SIZE <= x && x <= (i+1)*CANVAS_WIDTH/BOARD_SIZE && j*CANVAS_HEIGHT/BOARD_SIZE <= y && y <= (j+1)*CANVAS_HEIGHT/BOARD_SIZE){
                if(board[j][i]!='b' || (selected[0]!=-1 && selected[1]!=-1)){
                    MOUSE_CLICK_X = i;
                    MOUSE_CLICK_Y = j;
                }
                    if(selected[0] == MOUSE_CLICK_X && selected[1] == MOUSE_CLICK_Y){
                        MOUSE_CLICK_X = -1;
                        MOUSE_CLICK_Y = -1;
                        selected = [-1,-1];

                        return;
                    }else if(selected[0] != -1 && selected[1] != -1 && MOUSE_CLICK_X!=-1 && MOUSE_CLICK_Y!=-1){
                        //alert("making move");
                        makeMove(selected[0],selected[1],MOUSE_CLICK_X,MOUSE_CLICK_Y);
                        MOUSE_CLICK_X = -1;
                        MOUSE_CLICK_Y = -1;
                        selected = [-1,-1];
                    }
                
                //document.getElementById("deb").innerHTML += j+","+i;
            }
        }
    }
    
}

// calculate possiblemoves for rook
function possibleMovesRook(i,j,c){
    var possibleMoves =[];
    for(var k=i+1; k<BOARD_SIZE; k++){
        
        if(board[k][j]=='b'){
            possibleMoves.push([k,j]);
            continue;
        }
        else if(board[k][j].charAt(0)==c){
            break;
        }
        else if(board[k][j].charAt(0)!=c){
            possibleMoves.push([k,j]);
            break;
        }
    }
    for(var k=j+1; k<BOARD_SIZE; k++){
        if(board[i][k]=='b'){
            possibleMoves.push([i,k]);
            continue;
        }
        else if(board[i][k].charAt(0)==c){
            break;
        }
        else if(board[i][k].charAt(0)!=c){
            possibleMoves.push([i,k]);
            break;
        }
    }
    for(var k=i-1; k>=0; k--){
        
        if(board[k][j]=='b'){
            possibleMoves.push([k,j]);
            continue;
        }
        else if(board[k][j].charAt(0)==c){
            break;
        }
        else if(board[k][j].charAt(0)!=c){
            possibleMoves.push([k,j]);
            break;
        }
    }
    for(var k=j-1; k>=0; k--){
        if(board[i][k]=='b'){
            possibleMoves.push([i,k]);
            continue;
        }
        else if(board[i][k].charAt(0)==c){
            break;
        }
        else if(board[i][k].charAt(0)!=c){
            possibleMoves.push([i,k]);
            break;
        }
    }
    return possibleMoves;
    
}

// calculate possible move for knight
function possibleMovesKnight(i, j, c){
    var possibleMoves = [];
    //document.getElementById("deb").innerHTML=c;

    if(i+2 < BOARD_SIZE && j-1 >= 0 && (board[i+2][j-1] == 'b' || board[i+2][j-1].charAt(0)!=c))
        possibleMoves.push([i+2,j-1]);
    if(i-1 >= 0 && j+2 < BOARD_SIZE && (board[i-1][j+2] == 'b' || board[i-1][j+2].charAt(0)!=c))
        possibleMoves.push([i-1,j+2]);
    if(i+2 < BOARD_SIZE && j+1 < BOARD_SIZE  && (board[i+2][j+1] == 'b' || board[i+2][j+1].charAt(0)!=c))
        possibleMoves.push([i+2,j+1]);
    if(i-1 >= 0 && j-2 >= 0 && (board[i-1][j-2] == 'b' || board[i-1][j-2].charAt(0)!=c))
        possibleMoves.push([i-1,j-2]);
    if(i+1 < BOARD_SIZE && j-2 >= 0 && (board[i+1][j-2] == 'b' || board[i+1][j-2].charAt(0)!=c))
        possibleMoves.push([i+1,j-2]);
    if(i-2 >= 0 && j+1 < BOARD_SIZE && (board[i-2][j+1] == 'b' || board[i-2][j+1].charAt(0)!=c))
        possibleMoves.push([i-2,j+1]);
    if(i-2 >=0 && j-1 >=0  && (board[i-2][j-1] == 'b' || board[i-2][j-1].charAt(0)!=c))
        possibleMoves.push([i-2,j-1]);
    if(i+1 < BOARD_SIZE && j+2 < BOARD_SIZE && (board[i+1][j+2] == 'b' || board[i+1][j+2].charAt(0)!=c))
        possibleMoves.push([i+1,j+2]);
    return possibleMoves;
}

// calculate possible move for bishop
function possibleMovesBishop(i, j, c){
    var possibleMoves =[];
    for(var k=1; k<BOARD_SIZE-i && k<BOARD_SIZE-j; k++){
        
        if(board[i+k][j+k]=='b'){
            possibleMoves.push([i+k,j+k]);
            continue;
        }
        else if(board[i+k][j+k].charAt(0)==c){
            break;
        }
        else if(board[i+k][j+k].charAt(0)!=c){
            possibleMoves.push([i+k,j+k]);
            break;
        }
    }
    for(var k=1; i-k>=0 && j-k>=0; k++){
        
        if(board[i-k][j-k]=='b'){
            possibleMoves.push([i-k,j-k]);
            continue;
        }
        else if(board[i-k][j-k].charAt(0)==c){
            break;
        }
        else if(board[i-k][j-k].charAt(0)!=c){
            possibleMoves.push([i-k,j-k]);
            break;
        }
    }
    for(var k=1; i-k>=0 && k<BOARD_SIZE-j; k++){
        
        if(board[i-k][j+k]=='b'){
            possibleMoves.push([i-k,j+k]);
            continue;
        }
        else if(board[i-k][j+k].charAt(0)==c){
            break;
        }
        else if(board[i-k][j+k].charAt(0)!=c){
            possibleMoves.push([i-k,j+k]);
            break;
        }
    }
    for(var k=1; k<BOARD_SIZE-i && j-k>=0; k++){
        
        if(board[i+k][j-k]=='b'){
            possibleMoves.push([i+k,j-k]);
            continue;
        }
        else if(board[i+k][j-k].charAt(0)==c){
            break;
        }
        else if(board[i+k][j-k].charAt(0)!=c){
            possibleMoves.push([i+k,j-k]);
            break;
        }
    }
    
    return possibleMoves;
}

//calculte possible move for pawns
function possibleMovesPawn(i, j, c){
    var possibleMoves = [];
    var addFactor = 0;
    if(c=='b'){
        addFactor++;
        if(i==1 && (board[i+2][j]=='b' || board[i+2][j]!=c)){
            //alert("here");
            possibleMoves.push([i+2,j]);
        }
    }else{
        addFactor--;
        if(i==BOARD_SIZE-2 && board[i-2][j]!=c){
            possibleMoves.push([i-2,j]);
        }
    }
    if(i+addFactor < BOARD_SIZE && i+addFactor >=0 && (board[i+addFactor][j]=='b' || board[i+addFactor][j]!=c)){
        possibleMoves.push([i+addFactor,j]);
        if(j+1<BOARD_SIZE && (board[i+addFactor][j+1]!='b' && board[i+addFactor][j+1]!=c))
            possibleMoves.push([i+addFactor,j+1]);
        if(j-1>=0 && (board[i+addFactor][j-1]!='b' && board[i+addFactor][j-1]!=c))
            possibleMoves.push([i+addFactor,j-1]);
    }
    return possibleMoves;
    
}

//main gameloop
function mainloop(){
    switch(GAME_STATE){
        case 'start':
            document.addEventListener("click", changeClickPos);
            initialiseBoard();
            break;
        case 'play':
            drawBoard();
            highlightMove();
            fillPieces();
            highlightSelect();
            break;
        case 'end':
            break;
            
    }
    

}
setInterval(mainloop,1000/30);


