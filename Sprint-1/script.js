fetch('img/Quad-visualizer.svg')
.then(response => response.text())
.then(data => {
document.getElementById('quad-visualizer').innerHTML = data;

});

// audio source
const audioEl = document.getElementById('audio');

// container
const container = document.getElementById('container');

// instantiate analyzer
const audioMotion = new AudioMotionAnalyzer( container, {
    source: audioEl,
    showBgColor: false,
    useCanvas: false,
    minDecibels: -85,
    maxDecibels: -20,
    onCanvasDraw: energyMeters
});

// load audio file
audioEl.src = "https://zulate.github.io/FS25-DIDES/Sprint-1/sound/masodik-galamb.mp3";

// callback function
function energyMeters() {
    const canvas     = audioMotion.canvas,
          ctx        = audioMotion.canvasCtx,
          pixelRatio = audioMotion.pixelRatio,
          baseSize   = Math.max( 20 * pixelRatio, canvas.height / 27 | 0 ),
          centerX    = canvas.width >> 1,
          centerY    = canvas.height >> 1;
  
    // bass, midrange and treble meters
  
    const growSize = baseSize * 16;
  
    const bassEnergy = audioMotion.getEnergy('bass');
    document.getElementById('circle-bass').style.height = bassEnergy * growSize + 'px';
  
    const midEnergy = audioMotion.getEnergy('mid');
    document.getElementById('square-mid').style.height = midEnergy * growSize + 'px';


    const trebleEnergy = audioMotion.getEnergy('treble');
    document.getElementById('rect-high').style.height = trebleEnergy * growSize + 'px';

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

        // outer Quads
        const quadsOuter = document.getElementsByClassName('quad-vis-outer');
        for(let quadOuter of quadsOuter){
            let randomModifier = getRandomInt(800);
            quadOuter.setAttribute('style', 'transform: scale('+trebleEnergy * growSize / 100+'); rotate: -'+ trebleEnergy * 360 +'deg;');
            quadOuter.setAttribute('height', trebleEnergy * growSize / 100);
            if(trebleEnergy > 0.25){
      
                quadOuter.setAttribute('style', 'transform: scaleY('+trebleEnergy * growSize+') scaleX('+bassEnergy * growSize / 500+'); rotate: '+ trebleEnergy * 360 +'deg;');
    
            }
        }
    
        // middle Quads
        const quadsMiddle = document.getElementsByClassName('quad-vis-middle');
            for(let quadMiddle of quadsMiddle){
                quadMiddle.setAttribute('fill', 'white');
                quadMiddle.setAttribute('style', 'transform: scale('+midEnergy * growSize / 200+'); rotate: -'+ midEnergy * 360 +'deg;');
                quadMiddle.setAttribute('height', midEnergy * growSize / 100);
                if(midEnergy > 0.5){
                    quadMiddle.setAttribute('style', 'transform: scaleX('+midEnergy * growSize / 4+'); rotate: -'+ midEnergy * 360 +'deg;');
                }
            }

        // inner Quads
        const quadsInner = document.getElementsByClassName('quad-vis-inner');
        for(let quadInner of quadsInner){
            quadInner.setAttribute('fill', 'white');
            quadInner.setAttribute('width', bassEnergy * growSize / 4000);
            if(bassEnergy < 0.7){
                quadInner.setAttribute('style', 'transform: scaleX('+bassEnergy * growSize / 4+'); rotate:'+ bassEnergy * 360 +'deg;');
            } else {
                quadInner.setAttribute('style', 'transform: scaleX('+bassEnergy * growSize / 4+'); rotate: 45deg;');
            }
        }

        if(trebleEnergy > 0.28){
                document.getElementById('birds-overlay').style.backgroundImage = 'url("img/birds.png")';
                document.getElementById('birds-overlay').style.backgroundSize = Math.random(1)*100+60+'%';
                document.getElementById('birds-overlay').style.rotate = Math.random(1)*360+'deg';
        } else {document.getElementById('birds-overlay').style.backgroundImage = 'none';}

        if(bassEnergy > 0.65){
            document.getElementById('stairs-overlay').style.backgroundImage = 'url("img/stairs.png")';
                document.getElementById('stairs-overlay').style.backgroundSize = Math.random(1)*100+100+'%';
                document.getElementById('stairs-overlay').style.rotate = '0deg';
        } else {document.getElementById('stairs-overlay').style.backgroundImage = 'none';}
    } 

// play button
document.getElementById('play').addEventListener( 'click', () => {
    var audioDuration = document.getElementById('audio').duration;
    console.log(audioDuration);
    const timeArray = (JSON.stringify(audioDuration).split("."));

      // linearly maps value from the range (a..b) to (c..d)
    function mapRange (value, a, b, c, d) {
        // first map value from (a..b) to (0..1)
        value = (value - a) / (b - a);
        // then map it from (0..1) to (c..d) and return it
        return c + value * (d - c);
    }

    var timeElapsed = 0;
    var interval = 1000; // ms
    var expected = Date.now() + interval;
    setTimeout(step, interval);
    function step() {
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }
        timeElapsed += 1;
        console.log(timeElapsed);

        expected += interval;
        setTimeout(step, Math.max(0, interval - dt)); // take into account drift

        document.getElementById('audio-length-display').style.width = ((timeElapsed / audioDuration) * 100) + '%';
        document.getElementById('timeDisplay').innerHTML = timeElapsed + ' / ' + timeArray[0];
    }

    audioEl.play();
  });
