fetch('img/Quad-visualizer.svg')
.then(response => response.text())
.then(data => {
document.getElementById('quad-visualizer').innerHTML = data;

});

var timeElapsed = 0;

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }

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

// play button
document.getElementById('play').addEventListener( 'click', () => {
    document.getElementById('audio-controls').style.bottom = '0';
    document.getElementById('audio-controls').style.justifyContent = 'space-between';
    if(timeElapsed <= 0){
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
        expected += interval;
        setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }

    audioEl.play();
    } else {
        console.log('Visualizer wurde bereits gestartet.');
    }
  });

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
    const midEnergy = audioMotion.getEnergy('mid');
    const trebleEnergy = audioMotion.getEnergy('treble');

    document.getElementById('circle-bass').style.height = bassEnergy * growSize + 'px';
    document.getElementById('circle-bass').style.boxShadow = 'inset 0px 0px 0px 2vh rgba(255, 255, 255, '+bassEnergy*4+')';
    
    document.getElementById('square-mid').style.boxShadow = 'inset 0px 0px 0px 2vh rgba(255, 255, 255, '+midEnergy*4+')';
    document.getElementById('square-mid').style.height = midEnergy * growSize + 'px';

    document.getElementById('rect-high').style.boxShadow = 'inset 0px 0px 0px 2vh rgba(255, 255, 255, '+trebleEnergy*4+')';
    document.getElementById('rect-high').style.height = trebleEnergy * growSize + 'px';

    if(timeElapsed >= 0 && timeElapsed < 40){
        document.getElementById('quad-visualizer').style.display = 'none';
        document.getElementById('circle-bass').style.display = 'block';
        document.getElementById('square-mid').style.display = 'block';
        document.getElementById('rect-high').style.display = 'block';
        document.getElementById('pigeon').style.display = 'none';
    } else if(timeElapsed <= 180 && timeElapsed >= 180){
        document.getElementById('pigeon').style.backgroundSize = midEnergy * growSize / 2 + '%';
        document.getElementById('pigeon').style.display = 'block';
        document.getElementById('quad-visualizer').style.display = 'none';
        document.getElementById('circle-bass').style.display = 'block';
        document.getElementById('square-mid').style.display = 'block';
        document.getElementById('rect-high').style.display = 'block';
    } else if(timeElapsed <= 310 && timeElapsed >= 310){
        document.getElementById('pigeon').style.backgroundSize = midEnergy * growSize / 2 + '%';
        document.getElementById('pigeon').style.display = 'block';
        document.getElementById('quad-visualizer').style.display = 'none';
        document.getElementById('circle-bass').style.display = 'block';
        document.getElementById('square-mid').style.display = 'block';
        document.getElementById('rect-high').style.display = 'block';
    }
    else {
        document.getElementById('quad-visualizer').style.display = 'block';
        document.getElementById('pigeon').style.display = 'none';
        document.getElementById('quad-visualizer').style.display = 'block';
        document.getElementById('circle-bass').style.display = 'none';
        document.getElementById('square-mid').style.display = 'none';
        document.getElementById('rect-high').style.display = 'none';
    }

        // outer Quads
        const quadsOuter = document.getElementsByClassName('quad-vis-outer');
        for(let quadOuter of quadsOuter){
            quadOuter.setAttribute('fill', 'rgba(255, 255, 255, '+trebleEnergy * 1.5+')');
            quadOuter.setAttribute('height', trebleEnergy * growSize / 200);
            quadOuter.setAttribute('width', '5');
            quadOuter.setAttribute('style', 'transform: scaleY('+trebleEnergy * growSize / 100+'); rotate: -'+ trebleEnergy * 360 +'deg;');
            let randomNumberX = getRandomIntInclusive(-120, 400);
                let randomNumberY = getRandomIntInclusive(50, 250);
                quadOuter.setAttribute('x', randomNumberX);
                quadOuter.setAttribute('y', randomNumberY);
            if(timeElapsed <= 120){
                quadOuter.setAttribute('display', 'none');
            }
            
            else if(trebleEnergy > 0.25 && timeElapsed > 120){
                
                quadOuter.setAttribute('display', 'inline');
                quadOuter.setAttribute('style', 'transform: scaleY('+trebleEnergy* 2 * growSize+') scaleX('+bassEnergy * growSize / 2000+'); rotate: '+ trebleEnergy * 360 +'deg;');
            } else if(trebleEnergy > 0.25){
                quadOuter.setAttribute('display', 'inline');
                quadOuter.setAttribute('style', 'transform: scaleY('+trebleEnergy * growSize+') scaleX('+bassEnergy * growSize / 2000+'); rotate: '+ trebleEnergy * 360 +'deg;');

            } else {
                quadOuter.setAttribute('display', 'inline');
                quadOuter.setAttribute('style', 'transform: scaleY('+trebleEnergy * growSize / 100+') scaleX('+bassEnergy * growSize / 2000+'); rotate: '+ trebleEnergy * 360 +'deg;');
            }
        }
    
        // middle Quads
        const quadsMiddle = document.getElementsByClassName('quad-vis-middle');
            for(let quadMiddle of quadsMiddle){
                quadMiddle.setAttribute('height', bassEnergy / 16 * growSize);
                quadMiddle.setAttribute('fill', 'none');
                quadMiddle.setAttribute('stroke', 'rgba(255, 255, 255, '+midEnergy*1.5+')');
                quadMiddle.setAttribute('stroke-width', '1px');
                    if(midEnergy > 0.45 && timeElapsed> 120){
                        let randomNumberX = getRandomIntInclusive(-800, 1000);
                        let randomNumberY = getRandomIntInclusive(-200, 525);
                        quadMiddle.setAttribute('x', randomNumberX);
                        quadMiddle.setAttribute('y', randomNumberY);
                        quadMiddle.setAttribute('style', 'transform-origin: center; transform: scaleX('+midEnergy * growSize / 100+') skew('+ midEnergy * growSize +'deg);');
                    } else {
                        quadMiddle.setAttribute('style', 'transform: scaleX('+midEnergy * growSize / 400+') skew('+ midEnergy * growSize / 2 +'deg); rotate: -'+ midEnergy * 360 +'deg;');
                    }
            }

        // inner Quads
        const quadsInner = document.getElementsByClassName('quad-vis-inner');
        for(let quadInner of quadsInner){
            quadInner.setAttribute('fill', 'rgba( '+bassEnergy*300+', 0, 0, '+bassEnergy*1.5+')');
            if(bassEnergy > 0.6){
                let randomNumberX = getRandomIntInclusive(-90, 325);
                let randomNumberRotate = getRandomIntInclusive(0, 360);
                quadInner.setAttribute('transform', 'rotate('+ randomNumberRotate +')');
                quadInner.setAttribute('style', 'transform: scaleX(0.1) scaleY('+bassEnergy * growSize +');');
                quadInner.setAttribute('x', randomNumberX);
            } else {
                quadInner.setAttribute('style', 'transform: scaleX(1) scaleY('+bassEnergy * growSize / 100 +'); filter: blur(10px);');
            }
        }

        if(trebleEnergy >= 0.28){
                document.getElementById('birds-overlay').style.display = 'block';
                document.getElementById('birds-overlay').style.backgroundSize = Math.random(1)*100+60+'%';
                document.getElementById('birds-overlay').style.rotate = Math.random(1)*360+'deg';
                document.getElementById('birds-overlay').style.opacity = trebleEnergy*1.5;
        } else {document.getElementById('birds-overlay').style.display = 'none';}

        if(bassEnergy > 0.65 && timeElapsed > 120){
            document.getElementById('stairs-overlay').style.display = 'block';
                document.getElementById('stairs-overlay').style.backgroundSize = Math.random(1)*100+100+'%';
                document.getElementById('stairs-overlay').style.rotate = '0deg';
                document.getElementById('stairs-overlay').style.opacity = bassEnergy;
        } else {document.getElementById('stairs-overlay').style.display = 'none';}
    } 


