/*
PROGRAMAR ES INCREÍBLE
https://www.youtube.com/channel/UCS9KSwTM3FO2Ovv83W98GTg

Más información sobre Conway's Game of Life
http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life#Patterns

*/

var canvas;
var ctx;



var fpsJuego = 20;
var fpsEditor = 60;
var fps = fpsJuego;


var canvasX = 500;
var canvasY = 500;

var tileX;
var tileY;


//Variable para el tablero junto con sus dimensiones
var tablero;
var filas = 100;
var columnas = 100;

var negro = '#000000';
var blanco = '#FFFFFF';
var rojo = '#FF0000';

var pausa = true;


//--------------------------------------------------
//PATRONES

var patron = [
	[
	[0,1,0,0,1],
	[1,0,0,0,0],
	[1,0,0,0,1],
	[1,1,1,1,0],
	[0,0,0,0,0]
	],
	
	[
	[0,1,1,0,0],
	[1,1,0,0,0],
	[0,1,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]
	],
	
	[
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
	
	[
	[1,0,0,1,0],
	[0,0,0,0,1],
	[1,0,0,0,1],
	[0,1,1,1,1],
	[0,0,0,0,0]
	],
	

	[
	[0,0,0,0,1],
	[1,0,0,0,1],
	[0,1,1,1,1],
	[0,0,0,0,0]
	],
	
	[
	[0,1,0,0,0],
	[0,0,1,0,0],
	[1,1,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]
	],
	
	[
	[1,1,1,0,0],
	[1,0,0,0,0],
	[0,1,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]
	]
];


//--------------------------------------------------
//CADA CASILLA TENDRÁ UN AGENTE
var Agente = function(y,x,vivo){

	this.x = x;
	this.y = y;
	this.vivo = vivo;	//vivo=1 / muerto=0

	this.estadoProx = this.vivo;	//indica el estado que tendrá el agente en la siguiente generación

	this.vecinos = [];

	
	//LO USAMOS PARA CAMBIAR CON EL RATÓN EL AGENTE
	this.cambiaEstado = function(){
		if(this.vivo == true)
			this.vivo = false;
		else
			this.vivo = true;
	}
	
	
	this.pintaEstado = function(est){
		this.vivo = est;
	}
	
	
	//Método que determina sus vecinos (se usa la primera vez, al crear el agente)
	this.addVecinos = function(){
		
		var xVecino;
		var yVecino;
		
		for(var i=-1; i<2; i++){
			for(var j=-1; j<2; j++){
				
				//Usamos el operador módulo para continuar por los márgenes opuestos al salirnos de la pantalla
				xVecino = (j + this.x + columnas) % columnas;
				yVecino = (i + this.y + filas) % filas;
				
				//siempre que no estemos en (0,0) ya que seríamos nosotros mismos
				if(i!=0 || j!=0){
					this.vecinos.push(tablero[yVecino][xVecino]);
				}
				
			}
		}
		
	}
	
	
	//Método que calcula el estado siguiente en función de sus vecinos
	this.nuevoCiclo = function(){
		
		var suma = 0;
		
		for(var i=0; i<this.vecinos.length; i++){
			
			//Si el vecino está vivo, sumamos
			if(this.vecinos[i].vivo == 1){
				suma++;
			}

		}//for
		
		//--------------------------------------
		//REGLAS PARA SABER EL PRÓXIMO VALOR
		
		//valor por defecto (se queda como estaba)
		this.estadoProx = this.vivo;
		
		//Reproducción: si la casilla está vacía (muerto) y hay justo 3 vecinos, se crea vida
		if(this.vivo == 0 && suma == 3){
			this.estadoProx = 1;
		}
		
		//Muerte: si hay sobrepoblación (más de 3 vecinos) o se está aislado (menos de 2 vecinos) no se sobrevive
		if(this.vivo == 1 && (suma <2 || suma >3)){
			this.estadoProx = 0;
		}
		
	}
	
	
	//Método para cambiar al ciclo siguiente
	this.mutacion = function(){
		this.vivo = this.estadoProx;
	}
	
	
	//Método que dibuja el agente en el tablero
	this.dibuja = function(){
		
		if(this.vivo == 1)
			color = blanco;
		else
			color = negro;
		
		ctx.fillStyle = color;
		ctx.fillRect(this.x*tileX,this.y*tileY,tileX,tileY);
	}

}



//Función que crea un array 2D y devuelve el objeto
function creaArray2D(rows,cols){
	var obj = new Array(rows);
	for(y=0;y<rows;y++){
		obj[y] = new Array(cols);
	}
	return obj;
}


//Crea un agente para cada casilla del tablero
function inicializaTablero(obj,aleatorio){
	
	var estado;
	
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			
			if(aleatorio == true)
				estado = Math.floor(Math.random()*2);
			else
				estado = 0;
			
			obj[y][x] = new Agente(y,x,estado);
		}
	}
	
	
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			obj[y][x].addVecinos();
		}
	}
	
}



function borraCanvas(){
  canvas.width=canvas.width;
  canvas.height=canvas.height;
}



function inicia(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	canvas.width=canvasX;
	canvas.height=canvasY;
	
	
	//RATÓN
	canvas.addEventListener('mousedown',clicRaton,false);
	canvas.addEventListener('mouseup',sueltaRaton,false);
	canvas.addEventListener('mousemove',posicionRaton,false);
	
	//LECTURA DEL TECLADO
    document.addEventListener('keydown',function(tecla){
		
		console.log(tecla.keyCode);
		
		if(tecla.keyCode == 32){
		  //console.log("PULSA");
		}
		
    });
  
  
    document.addEventListener('keyup',function(tecla){
		
		//ESPACIO = PAUSA
		if(tecla.keyCode == 32){
		   controlaPausa();
		}
		
		//R = REINICIAR VACÍO
		if(tecla.keyCode == 82){
			inicializaTablero(tablero,false);
		}
		
		//T = REINICIAR ALEATORIO
		if(tecla.keyCode == 84){
			inicializaTablero(tablero,true);
		}

		
		//Q = AUMENTAR FPS
		if(tecla.keyCode == 81){
			aumentaFPS();
		}
		
		//W = REDUCIR FPS
		if(tecla.keyCode == 87){
			reduceFPS();
		}

    });
	
	
	
	
	//Calculamos el tamaño de los tiles para que sea proporcionado
	tileX = Math.floor(canvasX/filas);
	tileY = Math.floor(canvasY/columnas);
	
	//Creamos el tablero
	tablero = creaArray2D(filas,columnas);


	//Obj tablero, aleatorio
	inicializaTablero(tablero,false);
	

	setInterval(function(){principal();},1000/fps);

}



function aumentaFPS(){
	if(fpsJuego <70){
		fpsJuego+=10;
		fps = fpsJuego;
	}
}

function reduceFPS(){
	if(fpsJuego > 10){
		fpsJuego-=10;
		fps = fpsJuego;
	}
}





var ratonX = 0;
var ratonY = 0;

function clicRaton(e){
  console.log(ratonX + " - " + ratonY);
}

function sueltaRaton(e){
  console.log('raton soltado');
  cambiaRaton();
}

function posicionRaton(e){
  ratonX = e.pageX;
  ratonY = e.pageY;
}


//----------------------------------------------------------

function cambiaRaton(){
	
	//tablero[posY][posX].cambiaEstado();
	var figura = 2;
	var valor;
	
	for(py=0;py<9;py++){
		for(px=0;px<38;px++){

			valor = patron[figura][py][px];
			tablero[posY-1+py][posX-1+px].pintaEstado(valor);
		}
	}

}
//----------------------------------------------------------

var posX;
var posY;

function dibujaTablero(obj){
	
	//DIBUJAMOS
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			
			obj[y][x].dibuja();
		
		}
	}
	
	if(pausa == false){
		siguiente(obj);
	}
	
	
	
	//dibujamos el puntero del ratón
	if(pausa == true){
		posX = Math.floor(ratonX/tileX) - 1;
		posY = Math.floor(ratonY/tileY) - 1;
		
		ctx.fillStyle = rojo;
		ctx.fillRect(posX*tileX,posY*tileY,tileX,tileY);
	}
	
	
}


function controlaPausa(){
	if(pausa==true){
		pausa=false;
		fps = fpsJuego;
	}
	else{
		pausa = true;
		fps = fpsEditor;
	}
}


//CALCULAMOS EL SIGUIENTE CICLO
function siguiente(obj){

	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			obj[y][x].nuevoCiclo();
		}
	}
	

	//APLICAMOS LOS DATOS DEL CICLO NUEVO (Actualizamos)
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			obj[y][x].mutacion();
		}
	}
}








function principal(){
	borraCanvas();
	dibujaTablero(tablero);
}
