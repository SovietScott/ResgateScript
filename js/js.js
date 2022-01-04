var maiorPontuacao = 0;
var maiorSalvos = 0;

function start(){
  $("#inicio").hide();
  $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
  $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
  $("#fundoGame").append("<div id='inimigo2' ></div>");
  $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");
  $("#fundoGame").append("<div id='vida'></div>");

  // Variáveis
  var jogo = {};
  var TECLA = {
    W: 87,
    Up: 38,
    S: 83, 
    Down: 40,
    D: 68, 
    Right: 39
  };
  var velocidade = 5;
  var posicaoY = parseInt(Math.random() * 334);
  var podeAtirar = true;
  var fimDeJogo = false;
  var pontos = 0;
  var salvos = 0;
  var perdidos = 0;
  var energiaAtual = 3;
  var somDisparo = document.getElementById("somDisparo");
  var somExplosao = document.getElementById("somExplosao");
  var musica = document.getElementById("musica");
  var somGameover = document.getElementById("somGameover");
  var somPerdido = document.getElementById("somPerdido"); 
  var somResgate = document.getElementById("somResgate");
  var somPowerup = document.getElementById("somPowerup");
  somGameover.volume = 0.3;
  somResgate.volume = 0.3;
  somDisparo.volume = 0.3;
  somPerdido.volume = 0.6;
  somExplosao.volume = 0.5;
  somExplosao.playbackRate = 3.0;

  // Loop da música
  musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
  musica.play();
  //

  jogo.pressionou = [];

  // Pressionou alguma tecla
  $(document).keydown(function(e){
    jogo.pressionou[e.which] = true;
  });

  $(document).keyup(function(e){
    jogo.pressionou[e.which] = false;
  });

  // Game Loop
  jogo.timer = setInterval(loop, 30);

  function loop(){
    movefundo();
    movejogador();
    movevida();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();
  }

  function movefundo(){
    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda-2);
  }

  function movejogador(){
    
    if(jogo.pressionou[TECLA.W] || jogo.pressionou[TECLA.Up]){
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo-10);
      
      if(topo <= 0 ){
        $("#jogador").css("top", topo+10);
      }
    }

    if(jogo.pressionou[TECLA.S] || jogo.pressionou[TECLA.Down]){
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo+10);

      if(topo >= 434){
        $("#jogador").css("top", topo-10);
      }
    }

    if(jogo.pressionou[TECLA.D] || jogo.pressionou[TECLA.Right]){
      disparo();
    }
  }

  function moveinimigo1(){
    var posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX - velocidade);
    $("#inimigo1").css("top", posicaoY);

    if(posicaoX <= 0){
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }
  }

  function moveinimigo2(){
    var posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX - 5);
    if(posicaoX <= 0){
      $("#inimigo2").css("left", 775);
    }
  }

  function movevida(){
    var posicaoX = parseInt($("#vida").css("left"));
    var posicaoY = parseInt($("#vida").css("top"));
    $("#vida").css("left", posicaoX - 4);
    $("#vida").css("top", posicaoY);

    if(posicaoX <= 0){
      posicaoY = parseInt(Math.random() * 334);
      $("#vida").css("left", 850);
      $("#vida").css("top", posicaoY);
    }
  }

  function moveamigo(){
    var posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX+1);
    if(posicaoX >= 906){
      $("#amigo").css("left", 0);
    }
  }

  function disparo(){
    if(podeAtirar == true){
      podeAtirar = false;
      somDisparo.play();

      var topo = parseInt($("#jogador").css("top"));
      var posicaoX = parseInt($("#jogador").css("left"));
      var tiroX = posicaoX + 190;
      var topoTiro = topo + 37;
      $("#fundoGame").append("<div id='disparo'></div>");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      var tempoDisparo = window.setInterval(executaDisparo, 30);
    }

    function executaDisparo(){
      var posicaoX = parseInt($("#disparo").css("left"));
      $("#disparo").css("left", posicaoX+15);
      if(posicaoX >= 900){
        window.clearInterval(tempoDisparo);
        tempoDisparo= null;
        $("#disparo").remove();
        podeAtirar = true;
      }
    }
  }

  function colisao(){
    var colisao1 = ($("#jogador").collision($("#inimigo1")));
    var colisao2 = ($("#jogador").collision($("#inimigo2")));
    var colisao3 = ($("#disparo").collision($("#inimigo1")));
    var colisao4 = ($("#disparo").collision($("#inimigo2")));
    var colisao5 = ($("#jogador").collision($("#amigo")));
    var colisao6 = ($("#inimigo2").collision($("#amigo")));
    var colisao7 = ($("#jogador").collision($("#vida")));
    
    if(colisao1.length > 0){
      energiaAtual--;
      var inimigo1X = parseInt($("#inimigo1").css("left"));
      var inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }
    if(colisao2.length > 0){
      energiaAtual--;
      var inimigo2X = parseInt($("#inimigo2").css("left"));
      var inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo1X, inimigo1Y);

      $("#inimigo2").remove();
      reposicionaInimigo2();
    }
    if(colisao3.length > 0){
      velocidade += 0.3;
      pontos += 100;
      var inimigo1X = parseInt($("#inimigo1").css("left"));
      var inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X, inimigo1Y);
      $("#disparo").css("left", 950);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }
    if(colisao4.length > 0){
      pontos += 50;
      var inimigo2X = parseInt($("#inimigo2").css("left"));
      var inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();

      explosao2(inimigo2X, inimigo2Y);
      $("#disparo").css("left", 950);

      reposicionaInimigo2();
    }
    if(colisao5.length > 0){
      somResgate.play();
      salvos++;
      reposicionaAmigo();
      $("#amigo").remove();
    }
    if(colisao6.length > 0){
      perdidos++;
      var amigoX = parseInt($("#amigo").css("left"));
      var amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX, amigoY);
      $("#amigo").remove();

      reposicionaAmigo();
    }
    if(colisao7.length > 0){
      somPowerup.play();
      if(energiaAtual < 3){
        energiaAtual++;
      }
      $("#vida").remove();

      reposicionaVida();
    }
  }

  function explosao1(inimigoX, inimigoY){
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div>");
    $("#explosao1").css("background-image", "url(imgs/explosao.png)");
    var div = $("#explosao1");
    div.css("top", inimigoY);
    div.css("left", inimigoX);
    div.animate({width: 200, opacity: 0}, "slow");

    var temploExplosao = window.setInterval(removeExplosao, 1000);

    function removeExplosao(){
      div.remove();
      window.clearInterval(temploExplosao);
      tempoExplosao = null;
    }
  }

  function explosao2(inimigoX, inimigoY){
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao2'></div>");
    $("#explosao2").css("background-image", "url(imgs/explosao.png)");
    var div2 = $("#explosao2");
    div2.css("top", inimigoY);
    div2.css("left", inimigoX);
    div2.animate({width: 200, opacity: 0}, "slow");

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
    
    function removeExplosao2(){
      div2.remove();
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
    }
  }

  function explosao3(amigoX,amigoY) {
    somPerdido.play();
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top",amigoY);
    $("#explosao3").css("left",amigoX);
    var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
    function resetaExplosao3() {
      $("#explosao3").remove();
      window.clearInterval(tempoExplosao3);
      tempoExplosao3=null;    
    }
  }

  function reposicionaInimigo2(){
    var tempoColisao4 = window.setInterval(reposiciona4, 5000);
    
    function reposiciona4(){
      window.clearInterval(tempoColisao4);
      tempoColisao4 = null;
      if(fimDeJogo == false){
        $("#fundoGame").append("<div id='inimigo2'></div>");
      }
    }
  }

  function reposicionaAmigo(){
    var tempoAmigo = window.setInterval(reposiciona6, 6000);

    function reposiciona6(){
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;
      if(fimDeJogo == false){
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      }
    }
  }

  function reposicionaVida(){
    var tempoVida = window.setInterval(reposiciona7, 10000);

    function reposiciona7(){
      window.clearInterval(tempoVida);
      tempoVida = null;
      if(fimDeJogo == false){
        $("#fundoGame").append("<div id='vida'></div>");
      }
    }
  }

  function placar(){
    $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + 
    " Perdidos: " + perdidos + "</h2>");
  }

  function energia() {
		if (energiaAtual == 3) {
			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}
	
		if (energiaAtual == 2) {
			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}
	
		if (energiaAtual == 1) {
			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}
	
		if (energiaAtual == 0) {
			$("#energia").css("background-image", "url(imgs/energia0.png)");
      gameOver();
		}
	}

  function gameOver() {
    fimdejogo = true;
    musica.pause();
    somGameover.play();
    
    if(maiorPontuacao < pontos){
      maiorPontuacao = pontos;
    }
    if(maiorSalvos < salvos){
      maiorSalvos = salvos;
    }
    
    window.clearInterval(jogo.timer);
    jogo.timer = null;
    
    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();
    
    $("#fundoGame").append("<div id='fim'></div>");
    
    $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>"
    + "<p> Sua maior pontuação foi: " + maiorPontuacao + ", com um máximo de "
    + maiorSalvos + " salvações </p>" 
    + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
  }
};

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}
