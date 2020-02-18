
var TemporizadorObj={
	 segundos : 0,
	 minutos : 0,
	 num:0,
	 control:null,
	 elementoTimer:null,
 inicio:function () {
	 this.segundos=0;
	 this.minutos=2;
	 this.elementoTimer=$("#timer");
	 TemporizadorObj.empezarTimer();
 },empezarTimer:function(){
	 	this.control=setInterval(this.temporizador,1000);
 },parar:function(){
 	clearInterval(TemporizadorObj.control);
},empiezaNuevoTimer:function(){
	 TemporizadorObj.empezarTimer();
},reinicio:function(){
	clearInterval(TemporizadorObj.control);
 	TemporizadorObj.segundos = 0;
 	TemporizadorObj.minutos = 2;
	TemporizadorObj.num="0"+TemporizadorObj.minutos+":"+TemporizadorObj.segundos+"0";
	TemporizadorObj.elementoTimer.text(TemporizadorObj.num);
},
	 temporizador:function(){

		if(TemporizadorObj.segundos==0){
			if(TemporizadorObj.minutos>0){
			TemporizadorObj.minutos--;
			TemporizadorObj.segundos=60;
			}else{
			console.log("FIN DE LA PARTIDA");
			Juego.finPartida();
			return true;
			}
	}

	TemporizadorObj.segundos--;
	if(TemporizadorObj.segundos<10){
	TemporizadorObj.segundos="0"+TemporizadorObj.segundos;
	}
	//console.log("this.segundos "+TemporizadorObj.segundos);
	TemporizadorObj.num="0"+TemporizadorObj.minutos+":"+TemporizadorObj.segundos;
	TemporizadorObj.elementoTimer.text(TemporizadorObj.num);
	return false;
	}
}
