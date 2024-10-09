const arabicPhrases = [
    "مرحبا",
    "كيف حالك؟",
    "ما اسمك؟",
    "أنا أتعلم العربية",
    "شكرا جزيلا",
    "مع السلامة"
];

let currentPhrase = '';
const phraseDisplay = document.getElementById('phraseDisplay');
const speakButton = document.getElementById('speakButton');
const listenButton = document.getElementById('listenButton');
const resultDiv = document.getElementById('result');

const speech = window.speechSynthesis;
let recognition;

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        return false;
    }

    recognition.lang = 'ar-AR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript;
        resultDiv.textContent = `You said: ${userSpeech}`;

        if (userSpeech.toLowerCase() === currentPhrase.toLowerCase()) {
            resultDiv.textContent += '\nCorrect! Well done!';
            speakPhrase('أحسنت!');
        } else {
            resultDiv.textContent += '\nNot quite. Try again!';
            speakPhrase('حاول مرة أخرى');
        }
    };

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
            resultDiv.textContent = 'Microphone access is blocked. Please enable microphone access in your browser settings and try again.';
        } else {
            resultDiv.textContent = 'Error occurred in recognition: ' + event.error;
        }
    };

    return true;
}

function getRandomPhrase() {
    return arabicPhrases[Math.floor(Math.random() * arabicPhrases.length)];
}

function speakPhrase(phrase) {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'ar-AR';
    speech.speak(utterance);
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

speakButton.addEventListener('click', () => {
    currentPhrase = getRandomPhrase();
    phraseDisplay.textContent = currentPhrase;
    speakPhrase(currentPhrase);
});

listenButton.addEventListener('click', () => {
    if (!recognition && !initializeSpeechRecognition()) {
        resultDiv.textContent = 'Speech recognition is not supported in your browser. Please try using a different browser, such as Chrome.';
        return;
    }

    if (isMobile()) {
        resultDiv.textContent = 'On mobile, you may need to tap the microphone icon on your keyboard to start speaking. If prompted, please allow microphone access.';
    } else {
        resultDiv.textContent = 'Listening... Speak now!';
    }
    
    try {
        recognition.start();
    } catch (error) {
        resultDiv.textContent = 'An error occurred while starting speech recognition. Please refresh the page and try again.';
    }
});

// Initialize with a random phrase
currentPhrase = getRandomPhrase();
phraseDisplay.textContent = currentPhrase;

// Check if speech recognition is available
if (!initializeSpeechRecognition()) {
    listenButton.disabled = true;
    listenButton.textContent = 'Speech Recognition Not Available';
}