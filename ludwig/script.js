let game = {
    left: null,
    right: null
}

let lastGm = 0;

let score = 0;
let currentBg = 4;

// 
function startYT() {
    lastGm = 0;
    score = 0;

    resetYTVids()

    document.getElementById('home-cont').style.opacity = 0;
    document.getElementById('home-cont').style.pointerEvents = 'none'

    let gameCont = document.getElementById('game-cont');
    gameCont.style.pointerEvents = 'inherit'
    gameCont.style.transition = "opacity 1s"
    gameCont.style.opacity = 1

    game.left = randomVideo();
    game.right = randomVideo();

    console.log(game)

    setYTInfo(0, game.left)
    setYTInfo(1, game.right)

    setYTButtons(1)

    console.log(game.left)
}

// Generate a random YouTube video
function randomVideo() {
    if (ytVids.length == 0) resetYTVids();
    return ytVids.splice(Math.floor(Math.random() * (ytVids.length - 1)), 1)[0]
}

// Set the YT info on a side
function setYTInfo(number, info) {
    document.getElementById('option-' + number).innerHTML = `
    <div class="option-cont">
        <div id="${number}-vid" class="opt-vid"></div>

        <div class="opt-info" id="${number}-info">
            <div id="${number}-title" class="opt-title"></div>
            <div id="${number}-has" class="opt-small"></div>
            <div id="${number}-viewnum" class="opt-big"></div>
            <div id="${number}-views" class="opt-small"></div>
            <div id="${number}-buttons" class="opt-buttons" style="display: none">
                <button class="higher-btn" onclick="guess(true, ${number})">Higher &#9650;</button><br>
                <button class="lower-btn" onclick="guess(false, ${number})">Lower &#9660;</button>
            </div>
        </div>
    </div>`

    console.log(info)

    document.getElementById(number + '-title').innerHTML = `"${info.title}"`
    document.getElementById(number + '-vid').innerHTML = `<img src="${info.thumbnail}" alt="Thumbnail"></img>`
    document.getElementById(number + '-viewnum').innerHTML = comma(info.views)
    document.getElementById(number + '-views').innerHTML = 'views'
    document.getElementById(number + '-has').innerHTML = 'has'
}

// Set the YT buttons on a side
function setYTButtons(number) {
    document.getElementById(number + '-has').style.display = "none"
    document.getElementById(number + '-viewnum').style.display = "none"
    document.getElementById(number + '-views').style.display = "none"

    document.getElementById(number + '-buttons').style.display = "block"
}

// Start the twitch clips game
function startTwitch() {
    lastGm = 1;
    score = 0;

    resetClips()

    document.getElementById('home-cont').style.opacity = 0;
    document.getElementById('home-cont').style.pointerEvents = 'none'

    let gameCont = document.getElementById('game-cont');
    gameCont.style.pointerEvents = 'inherit'
    gameCont.style.transition = "opacity 1s"
    gameCont.style.opacity = 1

    game.left = randomClip();
    game.right = randomClip();

    console.log(game)

    setClipInfo(0, game.left)
    setClipInfo(1, game.right)

    setClipButtons(1)

    console.log(game.left)
}

// Generate a random Clip
function randomClip() {
    if (clips.length == 0) resetClips();
    return clips.splice(Math.floor(Math.random() * (clips.length - 1)), 1)[0]
}

// Set the YT info on a side
function setClipInfo(number, info) {
    document.getElementById('option-' + number).innerHTML = `
    <div class="option-cont">
        <div id="${number}-clip" class="opt-clip"></div>

        <div class="opt-info" id="${number}-info">
            <div id="${number}-title" class="opt-title"></div>
            <div id="${number}-has" class="opt-small"></div>
            <div id="${number}-viewnum" class="opt-big"></div>
            <div id="${number}-views" class="opt-small"></div>
            <div id="${number}-buttons" class="opt-buttons" style="display: none">
                <button class="higher-btn" onclick="guess(true, ${number})">Higher &#9650;</button><br>
                <button class="lower-btn" onclick="guess(false, ${number})">Lower &#9660;</button>
            </div>
        </div>
    </div>`

    console.log(info)

    document.getElementById(number + '-title').innerHTML = `"${info.title}"`
    document.getElementById(number + '-clip').innerHTML = `
    <iframe
        src="https://clips.twitch.tv/embed?clip=${info.id}&parent=blucubed.github.io"
        height="<height>"
        width="<width>"
        allowfullscreen="<allowfullscreen>">
    </iframe>`
    document.getElementById(number + '-viewnum').innerHTML = comma(info.views)
    document.getElementById(number + '-views').innerHTML = 'views'
    document.getElementById(number + '-has').innerHTML = 'has'
}

// Set the YT buttons on a side
function setClipButtons(number) {
    document.getElementById(number + '-has').style.display = "none"
    document.getElementById(number + '-viewnum').style.display = "none"
    document.getElementById(number + '-views').style.display = "none"

    document.getElementById(number + '-buttons').style.display = "block"
}

//
// UNIVERSAL STUFF
//

function guess(higher, number) {

    let answer = parseInt(game.left.views) < parseInt(game.right.views);

    document.getElementById(number + '-buttons').style.display = 'none'

    let interval = 50 // in ms
    let animTime = 750;
    let frame = 0;
    let tween = Math.ceil(game.right.views / interval)
    let current = 0;

    let viewDisp = document.getElementById(number + '-viewnum')
    viewDisp.style.display = 'block';

    document.getElementById(number + '-has').style.display = 'block'
    document.getElementById(number + '-views').style.display = 'block'

    function numAnim() {
        current += tween;
        viewDisp.innerHTML = comma(current.toString());

        frame++;
        if (frame < interval) {
            setTimeout(() => {
                numAnim()
            }, animTime/interval);
        } else {
            onEnd()
        }
    }

    function onEnd() {
        viewDisp.innerHTML = comma(game.right.views);

        setTimeout(() => {
            console.log(answer)
            if (answer == higher || parseInt(game.left.views) == parseInt(game.right.views)) {
                currentBg++;
                if (currentBg == 5) currentBg = 1;
                score++;
                document.getElementById('game-cont').innerHTML += `<div id="option-${score + 1}" class="option opos2" style="background: url(images/bg-${currentBg}.png);"></div>`
                document.getElementById('option-' + (score)).classList = 'option opos1'
                document.getElementById('option-' + (score - 1)).classList = 'option opos0'

                game.left = game.right;
                if (lastGm == 0) game.right = randomVideo()
                else game.right = randomClip()

                if (lastGm == 0) {
                    setYTInfo(score + 1, game.right)
                    setYTButtons(score + 1)
                } else {
                    setClipInfo(score + 1, game.right)
                    setClipButtons(score + 1)
                }

                setTimeout(() => {
                    document.getElementById('option-' + (score - 1)).remove()
                }, 250);
            } else {
                setTimeout(() => {
                    lose()
                }, 500);
            }
        }, 1000);
    
        
    }

    numAnim()

    
}

function lose() {
    document.getElementById('game-cont').style.opacity = '0'
    document.getElementById('game-cont').style.transition = 'opacity 0s'
    document.getElementById('game-cont').style.pointerEvents = 'none'
    document.getElementById('lose-cont').style.display = 'block'
    document.getElementById('lose-score').innerHTML = `You got a score of ${score}!`
    document.getElementById('game-cont').innerHTML = `<div id="option-0" class="option opos1" style="background: url(images/bg-3.png);"></div>
    <div id="option-1" class="option opos2" style="background: url(images/bg-4.png);"></div>`
}

function home() {
    document.getElementById('lose-cont').style.display = 'none';
    document.getElementById('home-cont').style.opacity = '1';
    document.getElementById('home-cont').style.pointerEvents = 'inherit';
}

function replay() {
    if (lastGm == 0) {
        startYT();
    } else {
        startTwitch()
    }
}

function comma(x) {
    return x.toString().split('').map((x,i,a) => ((a.length - i) % 3 == 0 && i != 0 ? ',' : '') + x).join('')
}