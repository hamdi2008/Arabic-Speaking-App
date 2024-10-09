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
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ar-AR';
recognition.continuous = false;
recognition.interimResults = false;

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
    if (isMobile()) {
        resultDiv.textContent = 'Tap the microphone icon on your keyboard to start speaking.';
    } else {
        resultDiv.textContent = 'Listening... Speak now!';
    }
    recognition.start();
});

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
    resultDiv.textContent = 'Error occurred in recognition: ' + event.error;
};

// Initialize with a random phrase
currentPhrase = getRandomPhrase();
phraseDisplay.textContent = currentPhrase;