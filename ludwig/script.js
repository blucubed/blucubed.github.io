let currentBg = 4; // The background that the last 
let lastGm = 0;    // Last gamemode played (0: YT, 1: Clips)
let score = 0;     // Current player score

let localStorage = window.localStorage;

if (!localStorage.getItem('yths')) localStorage.setItem('yths', 0);
if (!localStorage.getItem('twhs')) localStorage.setItem('twhs', 0);

let game = {left: null, right: null} // This holds the left and right videos / clips

let timeouts = []

function load() {
    document.getElementById('ytbtn').addEventListener('mouseover', () => {
        document.getElementById('mode-desc').innerHTML = "Pick the more popular option between two of Ludwig's 550+ YouTube videos"
        document.getElementById('lfrog').classList = `wobble button-logo`
    })

    document.getElementById('clipsbtn').addEventListener('mouseover', () => {
        document.getElementById('mode-desc').innerHTML = "Pick the more popular option between two of Ludwig's top 800 Twitch clips"
        document.getElementById('yep').classList = `small-wobble button-logo`
    })

    document.getElementById('ytbtn').addEventListener('mouseout', () => {
        document.getElementById('mode-desc').innerHTML = "Choose the option with the higher views!"
        document.getElementById('lfrog').classList = `button-logo`
    })

    document.getElementById('clipsbtn').addEventListener('mouseout', () => {
        document.getElementById('mode-desc').innerHTML = "Choose the option with the higher views!"
        document.getElementById('yep').classList = `button-logo smaller`
    })
}


// Start the game
function start(gamemode = lastGm) {
    if (gamemode == 0) document.getElementById('high-score').innerHTML = `High Score: ${localStorage.getItem('yths')}`
    if (gamemode == 1) document.getElementById('high-score').innerHTML = `High Score: ${localStorage.getItem('twhs')}`

    score = 0;
    currentBg = 4;
    lastGm = gamemode;

    document.getElementById('sadge').classList = ''

    resetYTVids()
    resetClips()

    document.getElementById('home-cont').style.opacity = 0;
    document.getElementById('home-cont').style.pointerEvents = 'none'

    let gameCont = document.getElementById('game-cont');
    gameCont.style.pointerEvents = 'inherit'
    gameCont.style.transition = "opacity 1s"
    gameCont.style.opacity = 1

    game.left = randomVideo();
    game.right = randomVideo();

    setInfo(0, game.left)
    setInfo(1, game.right)

    setButtons(1)
}

// Generate a random video
function randomVideo() {
    if (ytVids.length == 0) resetYTVids();
    if (clips.length == 0) resetClips();

    if (lastGm == 0) return ytVids.splice(Math.floor(Math.random() * (ytVids.length - 1)), 1)[0]    
    else if (lastGm == 1) return clips.splice(Math.floor(Math.random() * (clips.length - 1)), 1)[0]
}

// Set the info for one of the sides
function setInfo(number, info) {
    document.getElementById('option-' + number).innerHTML = `
    <div class="option-cont">
        <div id="${number}-vid" class="${lastGm == 0 ? 'opt-vid' : 'opt-clip'}"></div>

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

    document.getElementById(number + '-title').innerHTML = `"${info.title}"`
    document.getElementById(number + '-viewnum').innerHTML = comma(info.views)
    document.getElementById(number + '-views').innerHTML = 'views'
    document.getElementById(number + '-has').innerHTML = 'has'

    if (lastGm == 0) 
        document.getElementById(number + '-vid').innerHTML = `<img src="${info.thumbnail}" alt="Thumbnail"></img>`
    else if (lastGm == 1) 
        document.getElementById(number + '-vid').innerHTML = `<video controls><source src="${info.thumbnail.split('-preview')[0]}.mp4" type="video/mp4"></video>`
}

function setButtons(number) {
    document.getElementById(number + '-has').style.display = "none"
    document.getElementById(number + '-views').style.display = "none"
    document.getElementById(number + '-viewnum').style.display = "none"
    document.getElementById(number + '-buttons').style.display = "block"
}

function guess(higher, number) {
    const answer = parseInt(game.left.views) < parseInt(game.right.views); // The correct answer as a bool

    const interval = 50   // MS between each frame of the countup
    const animTime = 750; // Total time for the number to count up
    let frame = 0;        // The current frame number

    const tween = Math.ceil(game.right.views/interval) // Amount of views increased each frame
    let current = 0; // Current number

    document.getElementById(number + '-buttons').style.display = 'none' // Hide the buttons

    let viewDisp = document.getElementById(number + '-viewnum')
    viewDisp.style.display = 'block';

    document.getElementById(number + '-has').style.display = 'block'
    document.getElementById(number + '-views').style.display = 'block'

    function numAnim() {
        current += tween;
        viewDisp.innerHTML = comma(current.toString());
        frame++;

        if (frame < interval) timeouts.push(setTimeout(() => numAnim(), animTime/interval)); // Keep looping this 
        else onEnd()
    }

    let win = (answer == higher || parseInt(game.left.views) == parseInt(game.right.views))

    function onEnd() {
        viewDisp.innerHTML = comma(game.right.views);
        if (win) document.getElementById((score + 1) + '-viewnum').classList = `opt-big score-bump`

        timeouts.push(setTimeout(() => {
            if (win) { // If answer is correct or the same
                currentBg++;
                if (currentBg == 5) currentBg = 1;

                document.getElementById((score + 1) + '-viewnum').classList = `opt-big`

                score++;
                document.getElementById('score').innerHTML = `Score: ${score}`
                document.getElementById('score').classList = `score-bump`
                document.getElementById('score').classList = `score-bump`

                if (lastGm == 0 && (localStorage.getItem('yths') < score)) {
                    document.getElementById('high-score').innerHTML = `High Score: ${score}`
                    localStorage.setItem('yths', score)
                    document.getElementById('high-score').classList = `score-bump`
                }

                if (lastGm == 1 && (localStorage.getItem('twhs') < score)) {
                    document.getElementById('high-score').innerHTML = `High Score: ${score}`
                    localStorage.setItem('twhs', score)
                }


                document.getElementById('option-cont').innerHTML += `<div id="option-${score + 1}" class="option opos2" style="background: url(images/bg-${currentBg}.png);"></div>`
                document.getElementById('option-' + (score)).classList = 'option opos1'
                document.getElementById('option-' + (score - 1)).classList = 'option opos0'

                game.left = game.right;
                game.right = randomVideo()

                setInfo(score + 1, game.right)
                setButtons(score + 1)

                timeouts.push(setTimeout(() => {
                    document.getElementById('option-' + (score - 1)).remove()
                    document.getElementById('score').classList = ``
                    document.getElementById('high-score').classList = ``
                }, 250))
            } else timeouts.push(setTimeout(() => lose(), 500)); // Lose the game after 500 ms
        }, 1000));
    }

    numAnim()
}

function lose() {
    resetGameCont()

    document.getElementById('sadge').classList = 'grow'

    document.getElementById('lose-cont').style.display = 'block'
    document.getElementById('lose-score').innerHTML = `You got a score of ${score}!`
}

function home() {
    resetGameCont()

    document.getElementById('lose-cont').style.display = 'none';
    document.getElementById('home-cont').style.opacity = '1';
    document.getElementById('home-cont').style.pointerEvents = 'inherit';
}

function resetGameCont() {
    document.getElementById('game-cont').style.opacity = '0'
    document.getElementById('game-cont').style.transition = 'opacity 0s'
    document.getElementById('game-cont').style.pointerEvents = 'none'
    
    document.getElementById('option-cont').innerHTML = `<div id="option-0" class="option opos1" style="background: url(images/bg-3.png);"></div>
    <div id="option-1" class="option opos2" style="background: url(images/bg-4.png);"></div>`
    document.getElementById('score').innerHTML = `Score: 0`

    timeouts.forEach(x => {
        clearTimeout(x)
    })
}

function comma(x) {
    return x.toString().split('').map((x,i,a) => ((a.length - i) % 3 == 0 && i != 0 ? ',' : '') + x).join('')
}

