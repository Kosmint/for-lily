// 1. Function to open the envelope

// 1. Function to open the envelope
function openEnvelope() {
    const wrapper = document.querySelector('.envelope-wrapper');
    if (!wrapper.classList.contains('open')) {

        // --- NEW: BACKGROUND MUSIC START ---
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            bgMusic.volume = 0.3; // Set to 30% so it's a soft background
            bgMusic.play();
        }
        // ------------------------------------

        // AUDIO: Play the opening sound when the envelope is clicked
        const openSnd = document.getElementById('snd-open');
        if (openSnd) openSnd.play();

        wrapper.classList.add('open');
        const firstCard = document.querySelector('.card-stack .card:last-child');
        if (firstCard) firstCard.classList.add('active');
    }
}



// 2. Global variables for the Heart Game

let clickCount = 0;

const messages = [

    "Bwah is that it!!!!",

    "Come on hun, moreeee.",

    "Mhmm, continue...",

    "A little more bub. 💖",

    "I loveee youuuu!"

];



// 3. Main Logic (Runs when the page loads)

document.addEventListener('DOMContentLoaded', () => {
    const heartButtons = document.querySelectorAll('.next-heart');

    heartButtons.forEach(heart => {
        heart.addEventListener('click', (e) => {
            e.stopPropagation();

            // Check if this is the mini-game heart
            const isGameHeart = heart.id === 'game-heart-trigger';

            // AUDIO: Only play swipe sound immediately if it is NOT the game heart
            if (!isGameHeart) {
                const swipeSnd = document.getElementById('snd-swipe');
                if (swipeSnd) {
                    swipeSnd.currentTime = 0;
                    swipeSnd.play();
                }
            }

            // If it IS the game heart, run the game logic and stop here
            if (isGameHeart) {
                heartGame(heart, e);
                return;
            }

            // Normal card transition logic for all other hearts
            const currentCard = heart.closest('.card');
            const nextCard = currentCard.previousElementSibling;

            if (currentCard) {
                currentCard.classList.add('swiped');
                currentCard.classList.remove('active');

                if (nextCard && nextCard.classList.contains('card')) {
                    nextCard.classList.add('active');
                    if (nextCard.id === 'finale-card') {
                        // 1. Play the romantic finale sound
                        const finaleSnd = document.getElementById('snd-finale');
                        if (finaleSnd) finaleSnd.play();

                        // 2. Add the special background class to the body
                        document.body.classList.add('finale-active');

                        // 3. Start the floating hearts factory
                        setInterval(createFloatingHeart, 300);

                        // 4. Keep your existing confetti
                        if (typeof startConfetti === "function") startConfetti();
                    }
                }

                setTimeout(() => {
                    currentCard.remove();
                }, 600);
            }
        });
    });
});



// 4. The Heart Challenge Game Function

// 4. The Heart Challenge Game Function
function heartGame(heartElement, e) {
    if (e) e.stopPropagation();
    const textElement = document.getElementById('challenge-text');
    const boomHeart = document.getElementById('big-heart-boom');

    // AUDIO: Always play pop sound on every click
    const popSnd = document.getElementById('snd-pop');
    if (popSnd) {
        popSnd.currentTime = 0;
        popSnd.play();
    }

    clickCount++;
    heartElement.classList.remove('shake');
    void heartElement.offsetWidth;
    heartElement.classList.add('shake');

    if (clickCount < 10) {
        if (clickCount % 2 === 0) {
            textElement.innerText = messages[Math.floor(clickCount / 2) - 1];
        }
    } else {
        textElement.innerText = "YIPPEPEPE";
        boomHeart.classList.add('show');

        // AUDIO: Play swipe sound ONLY NOW on the final click
        const swipeSnd = document.getElementById('snd-swipe');
        if (swipeSnd) {
            swipeSnd.currentTime = 0;
            swipeSnd.play();
        }

        setTimeout(() => {
            boomHeart.classList.remove('show');
            const currentCard = heartElement.closest('.card');
            const nextCard = currentCard.previousElementSibling;

            if (currentCard) {
                currentCard.classList.add('swiped');
                currentCard.classList.remove('active');
                if (nextCard && nextCard.classList.contains('card')) {
                    nextCard.classList.add('active');
                }
                setTimeout(() => { currentCard.remove(); }, 600);
            }
        }, 800);
    }
}



function moveHeartSlider(value) {
    const heart = document.getElementById('display-heart');
    const text = document.getElementById('slider-text');
    const nextBtn = document.getElementById('final-next-btn');

    // FIX: Use transform to keep the heart centered on its position 
    // and prevent it from overflowing the right side.
    heart.style.left = `${value}%`;
    heart.style.transform = `translateX(-${value}%)`;

    if (value < 30) {
        heart.innerText = "💔";
        text.innerText = "Our start of relationship wasn't the best and I'm really sorry.";
    } else if (value < 70) {
        heart.innerText = "❤️‍🩹";
        text.innerText = "But with time, you taught me how love and relationship really works and I wanted to fully commit to it.";
    } else if (value >= 95) {
        heart.innerText = "💖";
        text.innerText = "And all I want now is for our little world which was breaking and healing many times, grow stronger and better ^^";
        heart.classList.add('healthy-glow');

        // Show the next button
        nextBtn.style.opacity = "1";
        nextBtn.style.pointerEvents = "auto";
    }
}



// --- SLOT MACHINE LOGIC ---

let slotSpinCount = 0;



function spinSlots() {
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    const btn = document.getElementById('spin-button');
    const msg = document.getElementById('slot-message');
    const nextBtn = document.getElementById('slot-next-btn');

    // Get the sounds
    const slotSnd = document.getElementById('snd-slot');
    const winSnd = document.getElementById('snd-win');
    const loseSnd = document.getElementById('snd-lose');

    if (slotSnd) slotSnd.play();

    btn.disabled = true;
    slotSpinCount++;

    reels.forEach((reel, index) => {
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        void reel.offsetHeight;
        reel.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;

        if (slotSpinCount >= 3) {
            reel.style.transform = 'translateY(-300px)';
        } else {
            const randomOffset = Math.floor(Math.random() * 5) * 60;
            reel.style.transform = `translateY(-${randomOffset}px)`;
        }
    });

    setTimeout(() => {
        if (slotSnd) {
            slotSnd.pause();
            slotSnd.currentTime = 0;
        }

        if (slotSpinCount >= 3) {
            // WIN LOGIC
            if (winSnd) winSnd.play();
            msg.innerText = "YIPPE, you won my heart heh (silly joke I know)";
            msg.style.color = "#c9184a";
            btn.style.display = "none";
            nextBtn.style.opacity = "1";
            nextBtn.style.pointerEvents = "auto";
        } else {
            // LOSE LOGIC
            if (loseSnd) {
                loseSnd.currentTime = 0; // Reset so it plays immediately on click 2
                loseSnd.play();
            }
            msg.innerText = "Try again bub";
            btn.disabled = false;
        }
    }, 3200);
}



// --- HEART REVEAL LOGIC ---

document.addEventListener('DOMContentLoaded', () => {

    const cover = document.getElementById('heart-cover');

    const nextBtn = document.getElementById('reveal-next-btn');

    if (!cover) return;



    const totalHearts = 25;

    let heartsRemoved = 0;



    for (let i = 0; i < totalHearts; i++) {

        const heart = document.createElement('div');

        heart.className = 'covering-heart';

        heart.innerText = '❤️';

        heart.style.left = Math.random() * 90 + '%';

        heart.style.top = Math.random() * 80 + '%';



        heart.addEventListener('click', (e) => {

            e.stopPropagation();

            if (!heart.classList.contains('removed')) {

                // AUDIO: Play pop sound when uncovering the secret message

                const popSnd = document.getElementById('snd-pop');

                if (popSnd) {

                    popSnd.currentTime = 0;

                    popSnd.play();

                }



                heart.classList.add('removed');

                heartsRemoved++;

                createSparkles(e.clientX, e.clientY);



                if (heartsRemoved >= totalHearts) {

                    nextBtn.style.opacity = "1";

                    nextBtn.style.pointerEvents = "auto";

                }

            }

        });

        cover.appendChild(heart);

    }

});

function createSparkles(x, y) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Random direction for particles
        const tx = (Math.random() - 0.5) * 100 + 'px';
        const ty = (Math.random() - 0.5) * 100 + 'px';

        sparkle.style.setProperty('--tx', tx);
        sparkle.style.setProperty('--ty', ty);
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
    }
}

let currentSlide = 0;
const memories = [
    { img: "a2.png", text: "Remember when we played that christmas game, wishing for similiar house in future, hehe." },
    { img: "a3.png", text: "Here us sitting in Russian streets (totally real)" },
    { img: "a4.png", text: "When we were making you cool looking costumes in pilgrammed, you were supah cute ^-^" }
    // Add more here!
];

function changeSlide(direction) {
    // AUDIO: Play the click sound
    const clickSnd = document.getElementById('snd-click');
    if (clickSnd) {
        clickSnd.currentTime = 0; // Reset to start so rapid clicks all play
        clickSnd.play();
    }

    currentSlide += direction;
    if (currentSlide >= memories.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = memories.length - 1;

    document.getElementById('carousel-img').src = memories[currentSlide].img;
    document.getElementById('carousel-text').innerText = memories[currentSlide].text;
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-effect';
    // Randomly pick a heart style
    const types = ['❤️', '💖', '💝', '💕', '🌸'];
    heart.innerText = types[Math.floor(Math.random() * types.length)];

    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.opacity = Math.random();

    document.body.appendChild(heart);

    // Remove it after it floats away so the page stays fast
    setTimeout(() => heart.remove(), 6000);
}
