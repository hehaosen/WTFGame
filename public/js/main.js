var playerStep=2;//用户动画第几张
var playerX=0,playerY=0;
var playerFace=1;//玩家面朝方向定位
function move(id,pos){
    console.log(pos);
    /**
     *创建人物
     */
    pos=JSON.parse(pos);
    var cursor=document.getElementById('cursor-'+id);
    if(!cursor){
        cursor=document.createElement('div');
        cursor.id='cursor-'+id;
        cursor.className='playPic';
        cursor.style.backgroundImage='/images/black.png';
        cursor.style.position='absolute';
        document.body.appendChild(cursor);

    }else{
        playerStep++;
        if(playerStep==6)playerStep=0;
        cursor.style.backgroundPosition='-'+(parseInt(playerStep/2)*31)+'px '+'-'+pos.face+'px';
    }
    /**
     *创建人物姓名
     */
    var playerName=document.getElementById('name-'+id);
    if(!playerName){
        playerName=document.createElement('div');
        playerName.id='name-'+id;
        playerName.className='playName';
        playerName.appendChild(document.createTextNode(pos.name));
        playerName.style.position='absolute';
        playerName.style.width='100px';
        playerName.style.textAlign='center';

        document.body.appendChild(playerName);
    }

    /**
     *创建人物武器
     */
    var weapon=document.getElementById('weapon-'+id);
    if(!weapon){
        weapon=document.createElement('img');
        weapon.id='weapon-'+id;
        weapon.className='weapon';
        weapon.src='/images/knife.png';
        weapon.style.position='absolute';
        weapon.style.width='20px';
        document.body.appendChild(weapon);
    }


    var faceName//玩家面朝方向名称

    console.log(pos.face);
    switch (pos.face.toString()){
        case '95'://上
            weapon.style.left=(pos.x+3)+'px';
            weapon.style.top=(pos.y-15)+'px';
            weapon.style.zIndex='0';
            weapon.style.webkitTransform='scale(1,1)';
            faceName='top';
            console.log('啦啦啦啦');
            break;
        case '31'://左
            weapon.style.left=(pos.x-12)+'px';
            weapon.style.top=(pos.y+2)+'px';
            weapon.style.zIndex='0';
            weapon.style.webkitTransform='scale(1,1)';
            faceName='left';
            break;
        case '63'://右
            weapon.style.left=(pos.x+23)+'px';
            weapon.style.top=(pos.y+2)+'px';
            weapon.style.zIndex='0';
            weapon.style.webkitTransform='scale(-1,1)';
            faceName='right';
            break;
        case '1'://下
            weapon.style.left=(pos.x+12)+'px';
            weapon.style.top=(pos.y+22)+'px';
            weapon.style.zIndex='50';
            weapon.style.webkitTransform='scale(-1,-1)';
            faceName='bottom';
            break;
    }
    /**
     *是否挥动武器
     */
    if(pos.doknief==1){
        kniefAnimate(id,faceName);
    }


    playerName.style.left=(pos.x-35)+'px';
    playerName.style.top=(pos.y-15)+'px';
    cursor.style.left=pos.x+'px';
    cursor.style.top=pos.y+'px';
    console.log(pos);

}

function remove(id){
    var cursor =document.getElementById('curosr-'+id);
    cursor.parentNode.removeChild(cursor);
}

var kniefAnimate=function(id,faceName){
     _$doIt=function(){
        document.getElementById('weapon-'+id).className="weapon";
        window.clearTimeout(_kniefTimes);//清除定时器
    }
    document.getElementById('weapon-'+id).className="weapon doknief "+faceName;
    doKnief=0;//挥刀状态解除
    var _kniefTimes=setTimeout('_$doIt()',500);
}

var speed=5;//移动速度
var playerName;
var doKnief=0;//是否挥刀动画判断1
window.onload=function(){
    var socket=io.connect();
    socket.on('connect',function(){
        playerName=prompt("你的名字是？","");
        document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            console.log(e.keyCode);
            if(e && e.keyCode==87){ //W
                playerY-=speed;
                playerFace=95;
            }
            if(e && e.keyCode==83){ //S
                playerY+=speed;
                playerFace=1;
            }
            if(e && e.keyCode==65){ //A
                playerX-=speed;
                playerFace=31;
            }
            if(e && e.keyCode==68){ //D
                playerX+=speed;
                playerFace=63;
            }
            if(e && e.keyCode==74){ //J
                //挥刀
                doKnief=1;
            }
            if(playerX>1155) playerX=1155;
            if(playerX<0) playerX=0;
            if(playerY<0) playerY=0
            if(playerY>645) playerY=645;
            socket.emit('move',JSON.stringify({x:playerX, y:playerY,name:playerName,doknief:doKnief,face:playerFace}));
            move('mine','{"x":'+playerX+', "y":'+playerY+', "name":"'+playerName+'", "doknief":'+doKnief+',"face":"'+playerFace+'"}');
        };

        socket.on('position',function(ev){
            var obj=JSON.parse(ev);
            move(obj.id,obj.pos);
        });

    });

}