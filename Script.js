var canvas = document.getElementById("canvas");
canvas.style.background = "black";
var c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

var lastCalledTime;
var fps;

var m = {
	x : innerWidth/2,
	y : innerHeight/2
}


var points = [];
var all = [];
var range = new Rect(50,50,100,100);
var rect = new Rect(0,0,innerWidth,innerHeight);
var quad = new Quad(rect,3);
for(var i =0;i<200;i++){
	all.push(new Point(Math.random()*innerWidth,Math.random()*innerHeight));
}
restruct();

function restruct(){
	
	for(var i in points){
		points[i].color = "white";
	}
	points.length = 0;
	quad = new Quad(rect,3);
	for(var i in all){
		quad.insert(all[i]);
	}
	quad.get(range,points);
	for(var i in points){
		points[i].color = "red";
	}
}

function Point(x,y){
	this.x = x;
	this.y = y;
	this.r = 4;
	this.color = "gray";
	this.update = function (){
		this.x += (Math.random()-0.5)*3;
		this.y += (Math.random()-0.5)*3;
	}
	this.draw = function(){
		c.beginPath();
		c.fillStyle = this.color;
		c.arc(this.x,this.y,this.r,0,Math.PI*2);
		c.fill();
	}
	this.intersect = function(ar){
		if(this.color == "white")
			return;
		for(var p of ar){
			if( p != this){
			var dist = Math.sqrt(Math.pow(p.x - this.x,2) + Math.pow(p.y - this.y,2));
			if(dist < this.r*2){
				this.color = "white";
				p.color = "white";
				break;
				}
			}
		}
		points.length = 0;
	}
}
function Rect(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.contain = function(point){
		if(this.x < point.x &&
			this.x+this.w > point.x&&
			this.y < point.y &&
			this.y+this.h > point.y)
			return true;
		return false;
	}
}
function Quad(boundary,n){
	this.capacity = n;
	this.boundary = boundary;
	this.divided = false;
	this.points = [];
	this.upright = null;
	this.upleft = null;
	this.downleft = null;
	this.downright = null;
	this.insert = function(point){
		if(!this.boundary.contain(point))
			return;
		
		if(this.divided){
			this.upleft.insert(point);
			this.upright.insert(point);
			this.downleft.insert(point);
			this.downright.insert(point);
		}
		else{
			if(this.points.length < this.capacity){
				this.points.push(point);
			}
			else {
				this.divide();
				this.insert(point);
				for(var i =0;i<this.points.length;i++){
					this.insert(this.points[i]);
				}
				this.points.length = 0;
			}
		}
	}
	this.divide = function(){
		this.divided = true;
		var x = this.boundary.x;
		var y = this.boundary.y;
		var w = this.boundary.w;
		var h = this.boundary.h;
		var upleft = new Rect(x,y,w / 2,h / 2);
		var upright = new Rect(x + w / 2,y,w / 2,h / 2);
		var downleft = new Rect(x,y + h / 2,w / 2,h / 2);
		var downright = new Rect(x + w / 2,y + h / 2,w / 2,h / 2);
		this.upleft = new Quad(upleft,this.capacity);
		this.upright = new Quad(upright,this.capacity);
		this.downleft = new Quad(downleft,this.capacity);
		this.downright = new Quad(downright,this.capacity);
	}
	this.get = function(range,found){
		if(!collide(range,this.boundary))
			return;
		if(this.upright == null){
			for(var i in this.points){
				if(range.contain(this.points[i]))
					found.push(this.points[i]);
			}
		}
		else{
			this.upleft.get(range,found);
			this.upright.get(range,found);
			this.downright.get(range,found);
			this.downleft.get(range,found);
		}
	}
	this.draw = function(){
		c.strokeStyle = "white";
		c.lineWidth = 0.2;
		c.strokeRect(this.boundary.x,this.boundary.y,this.boundary.w,this.boundary.h);
		c.lineWidth = 1;
		
		if(this.divided){
			this.upleft.draw();
			this.upright.draw();
			this.downleft.draw();
			this.downright.draw();
		}
		else
			for(var i =0;i<this.points.length;i++){
				this.points[i].draw();
				this.points[i].update();
		}
	}
}
document.onmousemove = function(){
	m.x = event.clientX;
	m.y = event.clientY;
}
document.onmousedown = function(){
	x = event.clientX;
	y = event.clientY;
	quad.add
	points.push(new Point(x,y))
}
function render(){
	c.clearRect(0,0,innerWidth,innerHeight);
	quad.draw();
	c.stokeStyle = "blue";
	c.strokeRect(range.x,range.y,range.w,range.h);
	c.stroke();
	range.x = m.x-range.w/2;
	range.y = m.y-range.h/2;
	for(var p of all){
		var area = new Rect(p.x-10,p.y-10,p.x+10,p.y+10);
		quad.get(area,points);
		p.color = "gray";
		p.intersect(points);
	}
	restruct();
	var delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;
	drawtext(Math.round(fps),20,25,"red");
	requestAnimationFrame(render);
}
render();
function collide(rect1,rect2){
	if (rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.h + rect1.y > rect2.y)
		return true;
	else 		
		return false;
}
function drawtext(text,x,y,color){
	c.font = "20px Arial";
	c.fillStyle = color;
	c.textAlign= "center";
	c.fillText(text,x,y);
}
