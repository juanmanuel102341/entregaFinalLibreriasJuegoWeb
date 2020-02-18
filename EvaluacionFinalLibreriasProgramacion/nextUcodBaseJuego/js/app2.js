  //  $.getScript("js/timer.js");

var Juego={
  celda:{
  mi_columna:-1,
  mi_fila:-1,
  mi_imagen:-1,
  mi_idSimbolo:-1,
  posX:0,
  posY:0
},
  arrayCeldas:[],
  simbolos:[],
  restriccionObj:{
        negativoX:{
        activo:false,
        valorY:0,
        valorX:0
        },
        positivoX:{
        activo:false,
        valor:0
        },
        negativoY:{
        activo:false,
        valor:0
        },
        positivoY:{
        activo:false,
        valor:0
        },
        elementosDroppables:[],
        index_drop:0,
        movimientoIzquierdo_activo:false,
        movimientoDerecha_activo:false,
        movimientoArriba_activo:false,
        movimientoAbajo_activo:false,
        posicionObjInicio:[],
        gapVertical:0,
        gapHorizontal:0
  },
  elemento:null,
 tablero:$("div[class^='col']"),
 timeSpawn:2000,
 arrCeldasAfectadas:[],
 stringSimbol:"",
 contadorMatches:0,
 arrBoolsColsMatch:[],
 arrResultadoCiclo:[],
 puntajeJuego:0,
 valorPuntaje:30,
 elementoPuntaje:null,
 movimientos:0,
 elementoMovimiento:null,
 panelTablero:null,
 panelTiempo:null,
 boton_reinicio:null,
pantallaFinalActiva:false,
inicio_juego_activo:false,
arrFilaControl:[],
numeroMatcheXronda:0,
boton_reset_activo:false,
controlIntervalMatch:null,
colorOriginal:null,
color1Active:false,
tituloJuego:null,
matchActivo:false,
  inicioEventoBoton:function(){
    Juego.boton_reinicio.click(function(){
  // console.log("click reset");
  if(!Juego.pantallaFinalActiva){

  if(!Juego.inicio_juego_activo){
  //  console.log("inicio juego activo x 1ra vez");
    Juego.eventos();
    Juego.colorOriginal=$('.main-titulo').css("color");
    Juego.tituloJuego=$('.main-titulo');
    Juego.activarEfectoCambioColorTitulo();
    TemporizadorObj.inicio();
    Juego.boton_reinicio.text("Reiniciar");
    Juego.inicio_juego_activo=true;
    }else {
    //   console.log("inicio juego ya activo");
      if(!Juego.matchActivo){
            if(!Juego.boton_reset_activo) {
           console.log("boton_reset=false");
            Juego.resetInicioActivo();
            Juego.desactivarEfectoCambioColorTitulo();
            Juego.boton_reset_activo=true;
            }else{
             console.log("boton_reset=true");
              Juego.activarDraggable();
              Juego.activarEfectoCambioColorTitulo();
              TemporizadorObj.empiezaNuevoTimer();
              Juego.boton_reinicio.text("Reiniciar");
              Juego.boton_reset_activo=false;
            }
        }else{
          console.log("MATCH ACTIVO INTENTELO MAS TARDE!");
        }
    }
  }else{
    Juego.terminoAnimacionPantallaFinal();
    Juego.boton_reset_activo=true;
    Juego.pantallaFinalActiva=false;
    }
  })
},efectoCambioColorTitulo:function(){
        var colorMatchGame1;
        if(!Juego.color1Active){
          colorMatchGame1="red";
          Juego.color1Active=true;
          }else{
          colorMatchGame1=Juego.colorOriginal;
          Juego.color1Active=false;
          }
        Juego.tituloJuego.css("color",colorMatchGame1)
      },desactivarEfectoCambioColorTitulo:function(){
        Juego.tituloJuego.css("color",Juego.colorOriginal);
        Juego.color1Active=false;
        clearInterval(Juego.controlIntervalMatch);
      },activarEfectoCambioColorTitulo:function(){
        Juego.controlIntervalMatch=setInterval(Juego.efectoCambioColorTitulo,400);
      },finPartida:function(){
      console.log("FINNNNNN");
    if(!Juego.matchActivo){
       console.log("macheo desactivado!!!");
        Juego.desactivarEfectoCambioColorTitulo();
        Juego.pantallaFinalActiva=true;
        TemporizadorObj.parar();
        Juego.panelTablero.hide();
        Juego.panelTiempo.hide();
        if(Juego.textoFinDeJuego==""){
  $(".main-titulo").append("<div class=titulo-over><p>JUEGO TERMINADO</p></div>");

    }
      $(".panel-score").animate({
        width: "100%",

      }, 1500,function(){
        //************pantalla final************
  //      console.log("animacion terminada");
      } );
    }else{
      console.log("matcheo activo!!!");
    }
    },desactivarDraggable:function(){
       $("img").draggable({disabled:true});
    },activarDraggable:function(){
       $("img").draggable({disabled:false});
    },terminoAnimacionPantallaFinal:function(){
      //console.log("click");
      //console.log("value "+ Juego.boton_reinicio.text());
      Juego.panelTablero.show();
      Juego.panelTiempo.show();
      Juego.boton_reinicio.text("Reiniciar");
      $(".titulo-over").remove();
      $(".panel-score").css("width","25%");
      Juego.resetInicioActivo();
    },
      inicio:function(){
        Juego.boton_reinicio=$(".btn-reinicio");
        Juego.elementoPuntaje=$("#score-text");
        Juego.elementoMovimiento=$("#movimientos-text");
        Juego.panelTablero=$(".panel-tablero");
        Juego.panelTiempo=$(".time");
        Juego.inicioEventoBoton();
        Juego.generandoArraySimbolos();
        Juego.generacionEscenario();
    },incioArrayFilaControl:function(){
      for (i = 0; i < 7; i++) {
        Juego.arrFilaControl[i]=[];
      }
    },
      generandoArraySimbolos:function(){

        for(i=0;i<7;i++){
          var interno=[];
          var contenedor;
          for(i2=0;i2<7;i2++){
          var celda1=new Object();
          celda1.mi_columna=i;
          celda1.mi_fila=i2;
          celda1.mi_imagen=null;
          celda1.mi_idSimbolo=0;
          interno[i2]=celda1;
          }
          this.arrayCeldas[i]=interno;

        }

      },generacionEscenario:function(){
    var myId;
    for(i_col=0;i_col<7;i_col++){
      for(i_fila=0;i_fila<7;i_fila++){
      myId=Juego.dameIdSimboloRandom(i_fila,i_col);
      this.arrayCeldas[i_fila][i_col].mi_idSimbolo=myId;
      //this.arrayCeldas[i_fila][i_col].mi_idSimbolo=Juego.arrCustom[i_fila][i_col];
      this.arrayCeldas[i_fila][i_col].mi_fila=i_fila;
      this.arrayCeldas[i_fila][i_col].mi_columna=i_col;
      Juego.ponerElemento(myId,i_fila,i_col);
    }
 }
  },restriccion:function(indexFila,indexCol){

    var currentSimbolos=[1,2,3,4];
    var numCol=-1;
  //console.log("*************** FILA ********************"+indexFila);
  //console.log("*************** COLUMNA ********************"+indexCol);
    if(indexFila>1){
    //  console.log("son iguales FILA (columna fija fila )"+indexFila+"col "+indexCol);
    //  console.log("mas cercano anterior columna movil "+this.arrayCeldas[indexFila-1][indexCol].mi_idSimbolo);
      //console.log("mas lejano anterior columna movil "+this.arrayCeldas[indexFila-2][indexCol].mi_idSimbolo);
      if(this.arrayCeldas[indexFila-1][indexCol].mi_idSimbolo==this.arrayCeldas[indexFila-2][indexCol].mi_idSimbolo){

        //console.log("numero "+this.arrayCeldas[indexFila-1][indexCol].mi_idSimbolo);
        currentSimbolos=Juego.sacandoElemento(this.arrayCeldas[indexFila-1][indexCol].mi_idSimbolo,currentSimbolos);
        numCol=this.arrayCeldas[indexFila-1][indexCol].mi_idSimbolo;
      }else{
        //console.log("desiguales! col");
      }
    }
    //console.log("verficacion ");
    if(indexCol>1){
      //console.log("numero salio en col "+numCol);
      //console.log("mas cercano anterior fila movil "+this.arrayCeldas[indexFila][indexCol-1].mi_idSimbolo);
      //console.log("mas lejano anterior fila movil "+this.arrayCeldas[indexFila][indexCol-2].mi_idSimbolo);
      if(this.arrayCeldas[indexFila][indexCol-1].mi_idSimbolo==this.arrayCeldas[indexFila][indexCol-2].mi_idSimbolo){

        if(numCol!=this.arrayCeldas[indexFila][indexCol-1].mi_idSimbolo){
          //si el numero q salio igual es distinto al q salio en la columna en el caso q haya salido
        //  console.log("son iguales FILA (fila fija col movil)"+indexFila+"col "+indexCol);
        //  console.log("numero "+this.arrayCeldas[indexFila][indexCol-1].mi_idSimbolo);
        currentSimbolos=Juego.sacandoElemento(this.arrayCeldas[indexFila][indexCol-1].mi_idSimbolo,currentSimbolos)
      }else {
        //console.log("YA SALIO EN LA COL!!!");
      }
      }else{
        //console.log("desiguales fila")
      }
      }

   return currentSimbolos;
 },sacandoElemento:function(elemento,array){
   for(i_base=0;i_base<array.length;i_base++){
     if(array[i_base]==elemento){
       array.splice(i_base,1);
       return array;
     }
   }
 },eventos:function(){
      $("img").draggable({
              //containment:$(".panel-tablero"),
              start:
      //ver si puedo generar un metodo unico para gravedad fila como columna y ver co o estructurar conclusionMatcheo
              function (event, ui) {
          //    console.log("elemento "+$(this));
            var mi_elemento=Juego.obteniendoElementoDelArray($(this).offset().top,$(this).offset().left);
            Juego.restriccionObj.posicionObjInicio[0]=mi_elemento.mi_imagen.offset().top;
            Juego.restriccionObj.posicionObjInicio[1]=mi_elemento.mi_imagen.offset().left;
            Juego.restriccionObj.gapVertical=mi_elemento.mi_imagen.height()/3;
            Juego.restriccionObj.gapHorizontal=mi_elemento.mi_imagen.width()/3;
            var mi_destino=null;
            Juego.clearArrayRestricciones();
            Juego.generandoRestricciones(mi_elemento);
            for(i=0;i<Juego.restriccionObj.elementosDroppables.length;i++){
              $(Juego.restriccionObj.elementosDroppables[i].mi_imagen).droppable({
                drop: function( event, ui ) {
            //      console.log("DEJANDO OBJETO");
                   mi_destino=Juego.obteniendoObjDroppable(this);
                //   console.log("simbolo dest ANTES "+mi_destino.mi_imagen.attr("src"));
                if(mi_destino!=null){
                   var arrDataCeldaMain=[];
                   var arrData2daCelda=[];
                   var simboloMain=mi_elemento.mi_imagen.attr("src");
                   var arrResultadoFila=[];
                   var arrResultadoCol=[];
                   var arrResultadoFila_2da=[];
                   var arrResultadoCol_2da=[];
                   var intFila=[];
                   var intCol=[];
                   var matchActivoCol=false;
                   var macthActivoFila=false;
                   var matchActivoCol_2da=false;
                   var macthActivoFila_2da=false;
                   var arrResultadoTotal=[];
                   arrDataCeldaMain[0]=mi_destino.mi_fila;
                   arrDataCeldaMain[1]=mi_destino.mi_columna;
                   arrData2daCelda[0]=mi_elemento.mi_fila;
                   arrData2daCelda[1]=mi_elemento.mi_columna;
                   Juego.numeroMatcheXronda=0;
                   Juego.stringSimbol=mi_destino.mi_imagen.attr("src")

                    if(mi_elemento.mi_columna==mi_destino.mi_columna){
                  //    console.log("se mueve paraEJE Y")

                     if(mi_destino.mi_fila>mi_elemento.mi_fila){
                  //   console.log("********me muevo para abajo*************");
                     intFila=Juego.controlXizquierda(arrDataCeldaMain,simboloMain);
                     Juego.setiandoValoresMatch(intFila,arrResultadoFila);
                     arrResultadoFila[arrResultadoFila.length]=arrDataCeldaMain;
                     intFila=Juego.controlXderecha(arrDataCeldaMain,simboloMain);
                     Juego.setiandoValoresMatch(intFila,arrResultadoFila);
                     arrResultadoCol[arrResultadoCol.length]=arrDataCeldaMain;
                     intCol=Juego.controlXabajo(arrDataCeldaMain,simboloMain);
                      Juego.setiandoValoresMatch(intCol,arrResultadoCol);
                    macthActivoFila=Juego.conclusionMatch(arrResultadoFila);
                    matchActivoCol=Juego.conclusionMatch(arrResultadoCol);
                   if(macthActivoFila||matchActivoCol){
                     Juego.arrayCeldas[arrDataCeldaMain[0]][arrDataCeldaMain[1]].mi_imagen.attr("src",simboloMain);
                     Juego.arrayCeldas[mi_elemento.mi_fila][mi_elemento.mi_columna].mi_imagen.attr("src",Juego.stringSimbol);
                    // console.log("c***************CHEQUEO 2DA CELDA^***************");
                     //console.log("simbolo otra celda CHEQUEO"+Juego.stringSimbol);
                     intFila=Juego.controlXizquierda(arrData2daCelda,Juego.stringSimbol);
                     Juego.setiandoValoresMatch(intFila,arrResultadoFila_2da);
                     arrResultadoFila_2da[arrResultadoFila_2da.length]=arrData2daCelda;
                     intFila=Juego.controlXderecha(arrData2daCelda,Juego.stringSimbol);
                     Juego.setiandoValoresMatch(intFila,arrResultadoFila_2da);
                     intCol=Juego.controlXarriba(arrData2daCelda,Juego.stringSimbol);
                      Juego.setiandoValoresMatch(intCol,arrResultadoCol_2da);
                      arrResultadoCol_2da[arrResultadoCol_2da.length]=arrData2daCelda;
                      macthActivoFila_2da=Juego.conclusionMatch(arrResultadoFila_2da);
                      matchActivoCol_2da=Juego.conclusionMatch(arrResultadoCol_2da);
                      }
                      }else{
                    //  console.log("********me muevo para arriba*************");
                      intFila=Juego.controlXizquierda(arrDataCeldaMain,simboloMain);
                      Juego.setiandoValoresMatch(intFila,arrResultadoFila);
                      arrResultadoFila[arrResultadoFila.length]=arrDataCeldaMain;
                      intFila=Juego.controlXderecha(arrDataCeldaMain,simboloMain);
                      Juego.setiandoValoresMatch(intFila,arrResultadoFila);
                      intCol=Juego.controlXarriba(arrDataCeldaMain,simboloMain);
                      Juego.setiandoValoresMatch(intCol,arrResultadoCol);
                      arrResultadoCol[arrResultadoCol.length]=arrDataCeldaMain;
                      macthActivoFila=Juego.conclusionMatch(arrResultadoFila);
                      matchActivoCol=Juego.conclusionMatch(arrResultadoCol);
                     if(macthActivoFila||matchActivoCol){
                       Juego.arrayCeldas[arrDataCeldaMain[0]][arrDataCeldaMain[1]].mi_imagen.attr("src",simboloMain);
                       Juego.arrayCeldas[mi_elemento.mi_fila][mi_elemento.mi_columna].mi_imagen.attr("src",Juego.stringSimbol);
                        // console.log("c***************CHEQUEO 2DA CELDA^***************");
                         //console.log("simbolo otra celda CHEQUEO"+Juego.stringSimbol);
                         intFila=Juego.controlXizquierda(arrData2daCelda,Juego.stringSimbol);
                         Juego.setiandoValoresMatch(intFila,arrResultadoFila_2da);
                         arrResultadoFila_2da[arrResultadoFila_2da.length]=arrData2daCelda;
                         intFila=Juego.controlXderecha(arrData2daCelda,Juego.stringSimbol);
                         Juego.setiandoValoresMatch(intFila,arrResultadoFila_2da);
                         arrResultadoCol_2da[arrResultadoCol_2da.length]=arrData2daCelda;
                         intCol=Juego.controlXabajo(arrData2daCelda,Juego.stringSimbol);
                          Juego.setiandoValoresMatch(intCol,arrResultadoCol_2da);
                          macthActivoFila_2da=Juego.conclusionMatch(arrResultadoFila_2da);
                          matchActivoCol_2da=Juego.conclusionMatch(arrResultadoCol_2da);
                              }
                            }
                      }else{
                  //    console.log("se mueve para EJE X ")
                      if(mi_destino.mi_columna>mi_elemento.mi_columna){
                  //      console.log("**************me muevo DERECHA**************");
                        intCol=Juego.controlXarriba(arrDataCeldaMain,simboloMain);
                        Juego.setiandoValoresMatch(intCol,arrResultadoCol);
                        arrResultadoCol[arrResultadoCol.length]=arrDataCeldaMain;
                        intCol=Juego.controlXabajo(arrDataCeldaMain,simboloMain);
                        Juego.setiandoValoresMatch(intCol,arrResultadoCol);
                        arrResultadoFila[arrResultadoFila.length]=arrDataCeldaMain;
                        intFila=Juego.controlXderecha(arrDataCeldaMain,simboloMain);
                        Juego.setiandoValoresMatch(intFila,arrResultadoFila);
                        macthActivoFila=Juego.conclusionMatch(arrResultadoFila);
                        matchActivoCol=Juego.conclusionMatch(arrResultadoCol);
                       if(macthActivoFila||matchActivoCol){
                    //     console.log("c***************CHEQUEO 2DA CELDA^***************");
                    //     console.log("simbolo otra celda CHEQUEO"+Juego.stringSimbol);
                         Juego.arrayCeldas[arrDataCeldaMain[0]][arrDataCeldaMain[1]].mi_imagen.attr("src",simboloMain);
                         Juego.arrayCeldas[mi_elemento.mi_fila][mi_elemento.mi_columna].mi_imagen.attr("src",Juego.stringSimbol);
                         intCol=Juego.controlXarriba(arrData2daCelda,Juego.stringSimbol);
                         Juego.setiandoValoresMatch(intCol,arrResultadoCol_2da);
                         arrResultadoCol_2da[arrResultadoCol_2da.length]=arrData2daCelda;
                         intCol=Juego.controlXabajo(arrData2daCelda,Juego.stringSimbol);
                          Juego.setiandoValoresMatch(intCol,arrResultadoCol_2da);
                          intFila=Juego.controlXizquierda(arrData2daCelda,Juego.stringSimbol);
                          Juego.setiandoValoresMatch(intFila,arrResultadoFila_2da);
                          arrResultadoFila_2da[arrResultadoFila_2da.length]=arrData2daCelda;
                          macthActivoFila_2da=Juego.conclusionMatch(arrResultadoFila_2da);
                          matchActivoCol_2da=Juego.conclusionMatch(arrResultadoCol_2da);
                       }
                      }else{
                    //  console.log("me muevo para IZQUIERDA");
                      intCol=Juego.controlXarriba(arrDataCeldaMain,simboloMain);
                      Juego.setiandoValoresMatch(intCol,arrResultadoCol);
                      arrResultadoCol[arrResultadoCol.length]=arrDataCeldaMain;
                      intCol=Juego.controlXabajo(arrDataCeldaMain,simboloMain);
                      Juego.setiandoValoresMatch(intCol,arrResultadoCol);
                      intFila=Juego.controlXizquierda(arrDataCeldaMain,simboloMain);
                      Juego.setiandoValoresMatch(intFila,arrResultadoFila);
                      arrResultadoFila[arrResultadoFila.length]=arrDataCeldaMain
                       macthActivoFila=Juego.conclusionMatch(arrResultadoFila);
                       matchActivoCol=Juego.conclusionMatch(arrResultadoCol);
                      if(macthActivoFila||matchActivoCol){
                        Juego.arrayCeldas[arrDataCeldaMain[0]][arrDataCeldaMain[1]].mi_imagen.attr("src",simboloMain);
                        Juego.arrayCeldas[mi_elemento.mi_fila][mi_elemento.mi_columna].mi_imagen.attr("src",Juego.stringSimbol);

                  //      console.log("c***************CHEQUEO 2DA CELDA^***************");
                  //      console.log("simbolo otra celda CHEQUEO"+Juego.stringSimbol);
                        Juego.arrayCeldas[arrDataCeldaMain[0]][arrDataCeldaMain[1]].mi_imagen.attr("src",simboloMain);
                        Juego.arrayCeldas[mi_elemento.mi_fila][mi_elemento.mi_columna].mi_imagen.attr("src",Juego.stringSimbol);
                        intCol=Juego.controlXarriba(arrData2daCelda,Juego.stringSimbol);
                        Juego.setiandoValoresMatch(intCol,arrResultadoCol_2da);
                        arrResultadoCol_2da[arrResultadoCol_2da.length]=arrData2daCelda;
                        intCol=Juego.controlXabajo(arrData2daCelda,Juego.stringSimbol);
                         Juego.setiandoValoresMatch(intCol,arrResultadoCol_2da);
                         arrResultadoFila_2da[arrResultadoFila_2da.length]=arrData2daCelda;
                         intFila=Juego.controlXderecha(arrData2daCelda,Juego.stringSimbol);
                         Juego.setiandoValoresMatch(intFila,arrResultadoFila_2da);
                         macthActivoFila_2da=Juego.conclusionMatch(arrResultadoFila_2da);
                         matchActivoCol_2da=Juego.conclusionMatch(arrResultadoCol_2da);
                            }
                          }
                          }
                        if(macthActivoFila){
                        arrResultadoTotal=arrResultadoFila;
                        }
                        if(matchActivoCol){
                          Juego.setiandoValoresMatch(arrResultadoCol,arrResultadoTotal);
                        }
                        if(macthActivoFila_2da){
                        Juego.setiandoValoresMatch(arrResultadoFila_2da,arrResultadoTotal);
                        }
                        if(matchActivoCol_2da){
                        Juego.setiandoValoresMatch(arrResultadoCol_2da,arrResultadoTotal);
                         }
                         if(macthActivoFila||matchActivoCol){
                           Juego.numeroMatcheXronda+=1;
                         }
                         if(macthActivoFila_2da||matchActivoCol_2da){
                //           console.log("entrando 2da celda "+ mi_elemento.mi_imagen.attr("src"))
                            mi_elemento.mi_imagen.attr("src",Juego.stringSimbol);
                           Juego.numeroMatcheXronda+=1;
                         }

                        if(arrResultadoTotal.length>0){
                          Juego.desactivarDraggable();//para q el usuario no pueda mover simbolos cuando esta machiando
                          Juego.matchActivo=true;
                          setTimeout(function(){
                            Juego.puntajeJuego+=Juego.valorPuntaje*Juego.numeroMatcheXronda;
                            Juego.elementoPuntaje.text(Juego.puntajeJuego);
                            Juego.movimientos+=1;
                            Juego.elementoMovimiento.text(Juego.movimientos);
                //            console.log("Juego.numeroMatcheXronda "+Juego.numeroMatcheXronda);
                            Juego.numeroMatcheXronda=0;
                            Juego.fadeObjs(arrResultadoTotal);
                //            console.log("arrResultadoTotal.length dentrum"+arrResultadoTotal.length);
                          },500)
                        }
                    }
                  }
                })
              }
            },
                drag: function( event, ui ) {
                  var diferencia=0;
                if(ui.offset.left<Juego.restriccionObj.negativoX.valorX){

                  return false;
                  }else if(ui.offset.left>Juego.restriccionObj.positivoX.valorX){
                    return false;
                    }
                    if(ui.offset.top<Juego.restriccionObj.negativoY.valorY){
                    return false;
                  }else if (ui.offset.top>Juego.restriccionObj.positivoY.valorY) {
                  return false;
                  }
                  if(ui.offset.left<Juego.restriccionObj.posicionObjInicio[1]-Juego.restriccionObj.gapHorizontal){
                  //  console.log("mov x izquierda");
                    Juego.restriccionObj.movimientoIzquierdo_activo=true;
                    Juego.restriccionObj.movimientoDerecha_activo=false;
                  }else if(ui.offset.left>Juego.restriccionObj.posicionObjInicio[1]+Juego.restriccionObj.gapHorizontal){
                    //console.log("mov x derecha");
                    Juego.restriccionObj.movimientoIzquierdo_activo=false;
                    Juego.restriccionObj.movimientoDerecha_activo=true;
                  }
                  if(ui.offset.top>Juego.restriccionObj.posicionObjInicio[0]+Juego.restriccionObj.gapVertical){
                  //  console.log("mov x abajo");
                    Juego.restriccionObj.movimientoAbajo_activo=true;
                    Juego.restriccionObj.movimientoArriba_activo=false;
                  }else if(ui.offset.top<Juego.restriccionObj.posicionObjInicio[0]-Juego.restriccionObj.gapVertical){
                  //  console.log("mov x arriba");
                    Juego.restriccionObj.movimientoArriba_activo=true;
                    Juego.restriccionObj.movimientoAbajo_activo=false;
                  }
                  if(Juego.restriccionObj.movimientoArriba_activo&&Juego.restriccionObj.movimientoIzquierdo_activo
                    ||Juego.restriccionObj.movimientoAbajo_activo&&Juego.restriccionObj.movimientoIzquierdo_activo
                    ||Juego.restriccionObj.movimientoArriba_activo&&Juego.restriccionObj.movimientoDerecha_activo
                    ||Juego.restriccionObj.movimientoAbajo_activo&&Juego.restriccionObj.movimientoDerecha_activo){
                    return false;
                  }
                  },
                  revert:true
                    }

                  )

    },fadeObjs:function(_arr){
      var celdaAux=[];
      for(i_base=0;i_base<_arr.length;i_base++){
        celdaAux=_arr[i_base]
      //  console.log("celda tt "+celdaAux);
        Juego.fadeObj(Juego.arrayCeldas[celdaAux[0]][celdaAux[1]].mi_imagen,_arr.length);
      }

    },
     obteniendoElementoDelArray:function(top,left){
        var topImagen;
        var leftImagen;
        var imagenes;
          for(i=0;i<7;i++){
            for(i2=0;i2<7;i2++){
              //console.log("index fila"+i+"col "+i2);
              topImagen=$(this.arrayCeldas[i][i2].mi_imagen).offset().top;
              leftImagen=$(this.arrayCeldas[i][i2].mi_imagen).offset().left;
              if(topImagen==top&&left==leftImagen){
                return this.arrayCeldas[i][i2];
              }
            }
          }
        },clearArrayRestricciones:function(){
        if(Juego.restriccionObj.negativoX){
        Juego.restriccionObj.negativoX.activo=false;
        }
        if(Juego.restriccionObj.positivoX){
        Juego.restriccionObj.positivoX.activo=false;
        }
        if(Juego.restriccionObj.negativoY){
        Juego.restriccionObj.negativoY.activo=false;
        }
        if(Juego.restriccionObj.positivoY){
        Juego.restriccionObj.positivoY.activo=false;
        }
        Juego.restriccionObj.movimientoArriba_activo=false;
        Juego.restriccionObj.movimientoAbajo_activo=false;
        Juego.restriccionObj.movimientoIzquierdo_activo=false;
        Juego.restriccionObj.movimientoDerecha_activo=false;
        Juego.restriccionObj.elementosDroppables.splice(0,Juego.restriccionObj.elementosDroppables.length);
        Juego.restriccionObj.index_drop=0;
      },generandoRestricciones:function(obj){
        if(obj.mi_columna>0&&Juego.restriccionObj.negativoX.activo==false){
          Juego.restriccionObj.negativoX.activo=true;
          Juego.restriccionObj.negativoX.valorX=$(Juego.arrayCeldas[obj.mi_fila][obj.mi_columna-1].mi_imagen).offset().left;
          Juego.restriccionObj.negativoX.valorY=$(Juego.arrayCeldas[obj.mi_fila][obj.mi_columna-1].mi_imagen).offset().top;
          Juego.agregandoElementoAlArray(Juego.arrayCeldas[obj.mi_fila][obj.mi_columna-1]);
      //  console.log("this.restriccion.negativoX.valor "+Juego.restriccionObj.negativoX.valorX);
        }else if(obj.mi_columna==0&&Juego.restriccionObj.negativoX.activo==false){
          Juego.restriccionObj.negativoX.activo=true;
          Juego.restriccionObj.negativoX.valorX=obj.mi_imagen.offset().left;
          Juego.restriccionObj.negativoX.valorY=obj.mi_imagen.offset().top;
        //  console.log("this.restriccion.negativoX.valor 0"+Juego.restriccionObj.negativoX.valorX);
        }
        if(obj.mi_columna<6&&Juego.restriccionObj.positivoX.activo==false){
          Juego.restriccionObj.positivoX.activo=true;
          Juego.restriccionObj.positivoX.valorX=$(Juego.arrayCeldas[obj.mi_fila][obj.mi_columna+1].mi_imagen).offset().left;
          Juego.restriccionObj.positivoX.valorY=$(Juego.arrayCeldas[obj.mi_fila][obj.mi_columna+1].mi_imagen).offset().top;
          Juego.agregandoElementoAlArray(Juego.arrayCeldas[obj.mi_fila][obj.mi_columna+1]);
        //console.log("this.restriccion.negativoX.valor "+Juego.restriccionObj.negativoX.valorX);
        }else if(obj.mi_columna==6&&Juego.restriccionObj.positivoX.activo==false){
          Juego.restriccionObj.positivoX.activo=true;
          Juego.restriccionObj.positivoX.valorX=obj.mi_imagen.offset().left;
          Juego.restriccionObj.positivoX.valorY=obj.mi_imagen.offset().top;
        //  console.log("this.restriccion.negativoX.valor "+Juego.restriccionObj.negativoX.valorX);
        }
        if(obj.mi_fila>0&&Juego.restriccionObj.negativoY.activo==false){
          Juego.restriccionObj.negativoY.activo=true;
          Juego.restriccionObj.negativoY.valorX=$(Juego.arrayCeldas[obj.mi_fila-1][obj.mi_columna].mi_imagen).offset().left;
          Juego.restriccionObj.negativoY.valorY=$(Juego.arrayCeldas[obj.mi_fila-1][obj.mi_columna].mi_imagen).offset().top;
        Juego.agregandoElementoAlArray(Juego.arrayCeldas[obj.mi_fila-1][obj.mi_columna]);
        //console.log("this.restriccion.negativoX.valor "+Juego.restriccionObj.negativoY.valorY);

        }else if(obj.mi_fila==0&&Juego.restriccionObj.negativoY.activo==false){
          Juego.restriccionObj.negativoY.activo=true;
          Juego.restriccionObj.negativoY.valorX=obj.mi_imagen.offset().left;
          Juego.restriccionObj.negativoY.valorY=obj.mi_imagen.offset().top;
        //console.log("LIMITE valorY fila 0"+Juego.restriccionObj.negativoY.valorY);
        }
        if(obj.mi_fila<6&&Juego.restriccionObj.positivoY.activo==false){
          Juego.restriccionObj.positivoY.activo=true;
          Juego.restriccionObj.positivoY.valorX=$(Juego.arrayCeldas[obj.mi_fila+1][obj.mi_columna].mi_imagen).offset().left;
          Juego.restriccionObj.positivoY.valorY=$(Juego.arrayCeldas[obj.mi_fila+1][obj.mi_columna].mi_imagen).offset().top;
          Juego.agregandoElementoAlArray(Juego.arrayCeldas[obj.mi_fila+1][obj.mi_columna]);
        //console.log("LIMITE valorY fila <6 "+Juego.restriccionObj.positivoY.valorY);
        }else if(obj.mi_fila==6&&Juego.restriccionObj.positivoY.activo==false){
          Juego.restriccionObj.positivoY.activo=true;
          Juego.restriccionObj.positivoY.valorX=obj.mi_imagen.offset().left;
          Juego.restriccionObj.positivoY.valorY=obj.mi_imagen.offset().top;
        //console.log("LIMITE valorY fila ==6 "+Juego.restriccionObj.positivoY.valorY);
        }
      },agregandoElementoAlArray:function(elem){
        Juego.restriccionObj.elementosDroppables[Juego.restriccionObj.index_drop]=elem;
        Juego.restriccionObj.index_drop++;
        //console.log("elem desde agregando elemento "+elem);
        },obteniendoObjDroppable:function(elemento){
        for(id=0;id<Juego.restriccionObj.elementosDroppables.length;id++){
          if($(Juego.restriccionObj.elementosDroppables[id].mi_imagen).offset().top==$(elemento).offset().top&& $(Juego.restriccionObj.elementosDroppables[id].mi_imagen).offset().left==$(elemento).offset().left){
        //    console.log("obteniendo obj droppable o destino "+Juego.restriccionObj.elementosDroppables[id].mi_fila+" col "+Juego.restriccionObj.elementosDroppables[id].mi_columna);
            return Juego.restriccionObj.elementosDroppables[id];
          }
        }
        return null;
      },ponerElemento:function(indexNum,indexFila,mi_indexCol){
        $("<img src=image/"+indexNum+".png>").appendTo(this.tablero[mi_indexCol]);
        //this.arrayCeldas[indexFila][mi_indexCol].mi_imagen=$("<img src=image/"+indexNum+".png>");
        this.arrayCeldas[indexFila][mi_indexCol].mi_imagen=$("img[src='image/" + indexNum + ".png']").last();
        //this.arrayCeldas[indexFila][mi_indexCol].mi_imagen.addClass("customImage")
        this.arrayCeldas[indexFila][mi_indexCol].posX=$(this.arrayCeldas[indexFila][mi_indexCol].mi_imagen).offset().left;
        this.arrayCeldas[indexFila][mi_indexCol].posY=$(this.arrayCeldas[indexFila][mi_indexCol].mi_imagen).offset().top;
        //this.arrayCeldas[indexFila][mi_indexCol].mi_imagen.addClass("borderMe");
        this.arrayCeldas[indexFila][mi_indexCol].mi_imagen.css("height","14%");
        //console.log("posy elemento fila)"+indexFila+"col) "+mi_indexCol+" "+this.arrayCeldas[indexFila][mi_indexCol].posY);
        },terminoAnimacion:function(){
        //  console.log("termino animaciones");
          Juego.contadorMatches=0;
          Juego.procesoBase2();
      },procesoBase2:function(){
          Juego.gravedad();
          Juego.initArrBoolsCols();
        Juego.ciclo();
      },setiandoValoresMatch:function(arrData,arrBase){
        for(i=0;i<arrData.length;i++){
          arrBase[arrBase.length]=arrData[i];
        }
      },conclusionMatch:function(arrRes){
        if(arrRes.length>=3){
          var arrIndex=[];
          //console.log("es un macth");
          for(i=0;i<arrRes.length;i++){
            arrIndex=arrRes[i];
            var imagen=Juego.arrayCeldas[arrIndex[0]][arrIndex[1]].mi_imagen;
            imagen.addClass("borderMe");
            Juego.arrBoolsColsMatch[arrIndex[1]]=true;
          }
          return true;
        }
        return false;
      },gravedad:function(){
        //arrcols index 0 seria la primer col en donde incia el match, el 1 seria donde termina
        var celdaTarget=null;
        var celdaBaja=null;
        var contadorBlanco=0;
        var internoAfectada=[];
        var cels=[];
        for(i=0;i<=6;i++){
          if(Juego.arrBoolsColsMatch[i]){
          internoAfectada=[];
          //console.log("ENTRANDO COL GRAVEDAD "+i);
          contadorBlanco=0;
          for(i2=6;i2>=1;i2--){
              cels=[];
          //    console.log("celda base "+"index i "+i2+" index col "+i);
            if(Juego.arrayCeldas[i2][i].mi_imagen.hasClass("imgTransparente")){
            //    console.log("es transparente");
                celdaTarget=Juego.arrayCeldas[i2+contadorBlanco][i].mi_imagen;
                if(!Juego.arrayCeldas[i2-1][i].mi_imagen.hasClass("imgTransparente")){
                  celdaBaja=Juego.arrayCeldas[i2-1][i].mi_imagen;
                  celdaTarget.attr("src",celdaBaja.attr("src"));
                  celdaTarget.removeClass("imgTransparente");
                  celdaBaja.addClass("imgTransparente");
                  cels[0]=i2+contadorBlanco;
                  cels[1]=i;
                  internoAfectada[internoAfectada.length]=cels;
              //    console.log("cels GRAVEDAD"+cels);
                }else{
                  contadorBlanco++;
                }
          }else{
          //  console.log("tiene algo "+ Juego.arrayCeldas[i2][i].mi_imagen.attr("src"));
          }
        }
        Juego.arrCeldasAfectadas[Juego.arrCeldasAfectadas.length]=internoAfectada;
      //  console.log("internoAfectada "+internoAfectada);
        }
      }
    },initArrBoolsCols:function(){
      for(i=0;i<7;i++){
        Juego.arrBoolsColsMatch[i]=false;
      }
    },ciclo:function(){
    var arr=[];
    var celda;
    //console.log("*****************ciclo******************")
      Juego.incioArrayFilaControl();
      Juego.ordenArr(Juego.arrCeldasAfectadas);
      for(i=0;i<Juego.arrCeldasAfectadas.length;i++){
       //console.log("index col "+i);
        arr=Juego.arrCeldasAfectadas[i];
            for(i2=0;i2<arr.length;i2++){
        //        console.log("index fila "+i2);
                celda=arr[i2];
          //      console.log("celda af "+celda);
              Juego.arrFilaControl[celda[0]][Juego.arrFilaControl[celda[0]].length]=celda;
              }
      }
      arr=[];
      arr=Juego.controlMatch();
      var celda_aux;
      if(arr.length>0){
      Juego.puntajeJuego+=Juego.valorPuntaje*Juego.numeroMatcheXronda;
      Juego.elementoPuntaje.text(Juego.puntajeJuego);
      Juego.numeroMatcheXronda=0;
      Juego.fadeObjs(arr);
      }else{
      //  console.log("fin del ciclo");
      Juego.spawn();
      }

    },spawn:function(){
      var arrSpawn=[];
      var internoSpawn=[];
      var cellSpawn=[];
      var arrAuxFila;
      var arrSpawnFila=[]
      var arrResSpawn=[];
      for(i=0;i<7;i++){
        arrSpawnFila[i]=[];
      }
      Juego.incioArrayFilaControl();
      for(i=0;i<=6;i++){
        internoSpawn=[];
      //   console.log("index col "+i);
        for(i2=0;i2<=6;i2++){
      //     console.log("index fila "+i2);
          if(Juego.arrayCeldas[i2][i].mi_imagen.hasClass("imgTransparente")){
      //      console.log("entrando transparente");
            cellSpawn=[];
            numAlSpawn= Math.floor((Math.random() *(5-1)) + 1);
             textNumSpawn="image/"+numAlSpawn+".png";
             Juego.arrayCeldas[i2][i].mi_imagen.attr("src",textNumSpawn);
             Juego.arrayCeldas[i2][i].mi_imagen.removeClass("imgTransparente");
          //   Juego.arrayCeldas[i2][i].mi_imagen.addClass("borderMe4");
            cellSpawn[0]=i2;
            cellSpawn[1]=i;
            internoSpawn[internoSpawn.length]=cellSpawn;
          //  console.log("celspawn "+cellSpawn);
            Juego.arrFilaControl[cellSpawn[0]][Juego.arrFilaControl[cellSpawn[0]].length]=cellSpawn;
          }else{
            break;
          }
        }
        if(internoSpawn.length>0){
        arrSpawn[arrSpawn.length]=internoSpawn;
        }
      }
      Juego.arrCeldasAfectadas=arrSpawn;
      arrResSpawn=Juego.controlMatch();
      if(arrResSpawn.length>0){
        Juego.puntajeJuego+=Juego.valorPuntaje*Juego.numeroMatcheXronda;
        Juego.elementoPuntaje.text(Juego.puntajeJuego);
    //    console.log("Juego.numeroMatcheXronda "+Juego.numeroMatcheXronda);
        Juego.numeroMatcheXronda=0;
      Juego.fadeObjs(arrResSpawn);
    }else{
      console.log("FIN DEL CICLO ESPERANDO MOVIMIENTO USUARIO");
      Juego.activarDraggable();
      Juego.matchActivo=false;
    }

  },ordenArr:function(coleccion){
    var arrOrdenado=[];
    var celda_1;
    var celda_2;
    var celdaMenor;
    var arrInt=[];
    //   console.log("*******orden array*******");
    for(i_or=0;i_or<coleccion.length;i_or++){
      arrInt=coleccion[i_or];
      for(i_or2=0;i_or2<arrInt.length;i_or2++){
        celda_1=arrInt[i_or2];
        celdaMenor=celda_1;
        for(i_or3=i_or2+1;i_or3<arrInt.length;i_or3++){
          celda_2=arrInt[i_or3];
          if(celdaMenor[0]>celda_2[0]){
            var aux=celdaMenor;
            arrInt[i_or2]=celda_2;
            arrInt[i_or3]=aux;
            celdaMenor=celda_2;
          }
        }
    }
  }
},controlMatch:function(){
    var auxResControl=[];
    var auxResParcial=[];
    var coleccionRestantes=[];
    var coleccionActual=[];
    var auxResFinal=[];
    var auxCelda;
    var textSimbol="";
    var numIndex=0;
    var auxHorizontal=[];
    //*******************control horizontal******************
    for(i_fila=0;i_fila<Juego.arrFilaControl.length;i_fila++){
      //console.log("index fila "+i_fila);
    //    coleccionRestantes=Juego.arrFilaControl[i_fila];
    Juego.setiandoValoresMatch(Juego.arrFilaControl[i_fila],coleccionRestantes)//arrData,arrBase
        coleccionActual=Juego.arrFilaControl[i_fila];
        for(i_col=0;i_col<coleccionActual.length;i_col++){
        //    console.log("index col"+i_col);
            auxCelda=coleccionActual[i_col];
        //    console.log("celda base"+auxCelda);
            textSimbol=Juego.arrayCeldas[auxCelda[0]][auxCelda[1]].mi_imagen.attr("src");
      //      console.log("mi simbol "+textSimbol);
            auxResControl=Juego.controlXizquierda(auxCelda,textSimbol);
        //    console.log("auxResControl izq "+auxResControl);
            Juego.setiandoValoresMatch(auxResControl,auxResParcial);
            auxResParcial[auxResParcial.length]=auxCelda;//me guardo a mi mismo despues de controlar al q esta a mi izuquierda para mantener un orden
            auxResControl=Juego.controlXderecha(auxCelda,textSimbol);
      //      console.log("auxResControl der "+auxResControl);
            Juego.setiandoValoresMatch(auxResControl,auxResParcial);
            coleccionRestantes.splice(0,1);
            numIndex=Juego.estoyDentroDeColeccion(auxResParcial,coleccionRestantes);
        //    console.log("mi index "+i_col+"mi num index "+numIndex);
            if(numIndex>0){
              coleccionRestantes.splice(0,numIndex);
              i_col+=numIndex;
            }

            if(Juego.conclusionMatch(auxResParcial)){
              Juego.setiandoValoresMatch(auxResParcial,auxResFinal)//arrData,arrBase
            //  console.log("guardando coleccion! "+auxResFinal)
               Juego.numeroMatcheXronda+=1;
            }
          //  console.log("restantes "+coleccionRestantes);
            auxResParcial.splice(0,auxResParcial.length);
        }
        coleccionRestantes=[];
    }
    coleccionActual=[];
    auxResParcial=[];
      //*******************control vertical******************
    for(i_col=0;i_col<Juego.arrCeldasAfectadas.length;i_col++){
      //console.log("index col "+i_col);
      coleccionActual=Juego.arrCeldasAfectadas[i_col];
      for(i_fila=0;i_fila<coleccionActual.length;i_fila++){
      //  console.log("index i_fila "+i_fila);
          auxCelda=coleccionActual[i_fila];
        //  console.log("auxCelda "+auxCelda);
          textSimbol=Juego.arrayCeldas[auxCelda[0]][auxCelda[1]].mi_imagen.attr("src");
        //  console.log("textSimbol "+textSimbol);
          auxResControl=Juego.controlXarriba(auxCelda,textSimbol);
        //  console.log("auxResControl arriba "+auxResControl);
          Juego.setiandoValoresMatch(auxResControl,auxResParcial);
          auxResParcial[auxResParcial.length]=auxCelda;
          auxResControl=Juego.controlXabajo(auxCelda,textSimbol);
        //  console.log("auxResControl abajo "+auxResControl);
          Juego.setiandoValoresMatch(auxResControl,auxResParcial);
          if(Juego.conclusionMatch(auxResParcial)){
          Juego.numeroMatcheXronda+=1;
          Juego.setiandoValoresMatch(auxResParcial,auxResFinal)//arrData,arrBase
          //  console.log("guardando coleccion! "+auxResFinal)
          }
          i_fila+=auxResParcial.length-1//diferencia con el anterior (control horizontal)aca se con elementos son consecutivos
        //  console.log("i_fila "+i_fila);
          auxResParcial.splice(0,auxResParcial.length);
          }
      }
      Juego.arrFilaControl.splice(0,Juego.arrFilaControl.length);
      Juego.arrCeldasAfectadas.splice(0,Juego.arrCeldasAfectadas.length);
      return auxResFinal;
  },estoyDentroDeColeccion:function(coleccionBase,coleccionRestantes){
    var contando=0;
    var celda_01=[];
    var celda_02=[];
    for(i_c2=0;i_c2<coleccionRestantes.length;i_c2++){
    celda_02=coleccionRestantes[i_c2];
    for(i_c=0;i_c<coleccionBase.length;i_c++){
      celda_01=coleccionBase[i_c];
              if(celda_01[1]==celda_02[1]){
                contando++;
                break;
              }
            }
    }
    return contando;
  },guardandoElementoArrFila:function(_indexFila,celda,coleccionBase){
    var cantidadCol=coleccionBase[_indexFila].length;
    var arr=coleccionBase[_indexFila];
    arr[arr.length]=celda;
  },sacandoElementoSpawnFila:function(coleccion,elemento){
    var celda_s=[];
    for(i_s=0;i_s<coleccion.length;i_s++){
      celda_s=coleccion[i_s];
      if(celda_s[1]==elemento[1]){
        coleccion.splice(i_s,1);
        return;
      }
    }
  },controlXizquierda:function(arrDataCelda,simboloComp){
      var simbolo="";
      var arrNumMacth=[];
      for(i=arrDataCelda[1]-1;i>=0;i--){
        var arrInternoMatch=[];
        simbolo=Juego.arrayCeldas[arrDataCelda[0]][i].mi_imagen.attr("src");
        if(simbolo==simboloComp&&!Juego.arrayCeldas[arrDataCelda[0]][i].mi_imagen.hasClass("imgTransparente")){
          arrInternoMatch[0]=arrDataCelda[0];//fila
          arrInternoMatch[1]=i;//col
          arrNumMacth[arrNumMacth.length]=arrInternoMatch;
        }else{
          break;
        }
    }
    return arrNumMacth;
  },controlXderecha:function(arrDataCelda,simboloComp){
    var simbolo="";
    var arrNumMacth=[];
    for(i=arrDataCelda[1]+1;i<=6;i++){
    var arrInternoMatch=[];
      simbolo=Juego.arrayCeldas[arrDataCelda[0]][i].mi_imagen.attr("src");
      if(simbolo==simboloComp&&!Juego.arrayCeldas[arrDataCelda[0]][i].mi_imagen.hasClass("imgTransparente")){
        arrInternoMatch[0]=arrDataCelda[0];//fila
        arrInternoMatch[1]=i;//col
        arrNumMacth[arrNumMacth.length]=arrInternoMatch;
      }else{
        break;
      }
    }
    return arrNumMacth;
  },controlXabajo:function(arrDataCelda,simboloComp){
    var simbolo="";
    var arrNumMacth=[];
//******ABAJO********
//index 0 de arrDataCelda es fila index 1 col
    for(i=arrDataCelda[0]+1;i<=6;i++){
      var arrInternoMatch=[];
      simbolo=Juego.arrayCeldas[i][arrDataCelda[1]].mi_imagen.attr("src");
      if(simbolo==simboloComp&&!Juego.arrayCeldas[i][arrDataCelda[1]].mi_imagen.hasClass("imgTransparente")){
        arrInternoMatch[0]=i;//fila
        arrInternoMatch[1]=arrDataCelda[1];//col
        arrNumMacth[arrNumMacth.length]=arrInternoMatch;
        //console.log("correcto ! fila "+i+"col "+arrDataCelda[1]);
      }else{
        //console.log("incorrecto! fila "+i+"col "+arrDataCelda[1]);
        break;
      }
  }
  return arrNumMacth;
},controlXarriba:function(arrDataCelda,simboloComp){
//  console.log("********controlXarriba***********");
  var simbolo="";
  var arrNumMacth=[];
  for(i=arrDataCelda[0]-1;i>=0;i--){
  //console.log("index elemento comp "+i);
  var arrInternoMatch=[];
  simbolo=Juego.arrayCeldas[i][arrDataCelda[1]].mi_imagen.attr("src");
    if(simbolo==simboloComp&&!Juego.arrayCeldas[i][arrDataCelda[1]].mi_imagen.hasClass("imgTransparente")){
      arrInternoMatch[0]=i;//fila
      arrInternoMatch[1]=arrDataCelda[1];//col
      arrNumMacth[arrNumMacth.length]=arrInternoMatch;
    //  console.log("correcto ! fila "+i+"col "+arrDataCelda[1]);
    }else{
    //  console.log("incorrecto! fila "+i+"col "+arrDataCelda[1]);
      break;
      }
    }
    //console.log("TAM arrNumMacth "+arrNumMacth.length);
    return arrNumMacth;
},fadeObj:function(obj,_target){
var mycontrol;
var cont=0;
var r;
obj.addClass("imgTransparente");
mycontrol=setInterval(function(){
  if(cont<7){
    r=cont%2;
  if(r==0){
    obj.removeClass("imgTransparente");
  }else{

    obj.addClass("imgTransparente");
  }
  cont++;
  }else{
    Juego.contadorMatches++;
  //  console.log("borrando transparente");
  obj.addClass("imgTransparente");
  obj.removeClass("borderMe");
  clearInterval(mycontrol);
  if(Juego.contadorMatches==_target){
    Juego.terminoAnimacion(_target);
}
  }
},250)


},resetInicioActivo:function(id,_fila,_col){
  Juego.puntajeJuego=0;
  Juego.movimientos=0;
  Juego.desactivarDraggable();
  TemporizadorObj.reinicio();
  Juego.elementoPuntaje.text(Juego.puntajeJuego);
  Juego.elementoMovimiento.text(Juego.movimientos);
  Juego.boton_reinicio.text("Iniciar");
var id=0;
var mi_src="";
  for(i=0;i<7;i++){
    for(i2=0;i2<7;i2++){
      id=Juego.dameIdSimboloRandom(i,i2);
      Juego.arrayCeldas[i][i2].mi_idSimbolo=id;
      mi_src="image/" + id + ".png";
      Juego.arrayCeldas[i][i2].mi_imagen.attr("src",mi_src);
    }
  }
},dameIdSimboloRandom:function(_indexFila,_indexCol){
    var mi_simbolos=Juego.restriccion(_indexFila,_indexCol);
     var x= Math.floor((Math.random() * mi_simbolos.length-1) + 1);
    return mi_simbolos[x];
}
}
Juego.inicio();
