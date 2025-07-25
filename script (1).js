// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Text Transformation Functions
const textTransformations = {
    uppercase: (text) => text.toUpperCase(),

    lowercase: (text) => text.toLowerCase(),

    titleCase: (text) => {
        return text.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    sentenceCase: (text) => {
        return text.toLowerCase().replace(/(^\w|\.\s*\w)/g, (match) =>
            match.toUpperCase()
        );
    },

    removeExtraSpace: (text) => {
        return text.replace(/\s+/g, ' ').trim();
    },

    reverseText: (text) => text.split('').reverse().join(''),

    clearText: () => '',

    toggleCase: (text) =>
        text.split('').map(c =>
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        ).join(''),

    vowelCount: (text) => {
        const count = (text.match(/[aeiou]/gi) || []).length;
        alert(`Vowel count: ${count}`);
        return text;
    },

    consonantCount: (text) => {
        const count = (text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
        alert(`Consonant count: ${count}`);
        return text;
    },

    isPalindrome: (text) => {
        const normalized = text.replace(/[^a-z0-9]/gi, '').toLowerCase();
        const isPalin = normalized === normalized.split('').reverse().join('');
        alert(isPalin ? 'It is a palindrome!' : 'Not a palindrome.');
        return text;
    },

    base64Encode: (text) => btoa(text),

    base64Decode: (text) => {
        try {
            return atob(text);
        } catch (e) {
            alert('Invalid Base64!');
            return text;
        }
    },
};

// DOM Elements
const textInput = document.getElementById('textInput');
const textPreview = document.getElementById('textPreview');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const readTime = document.getElementById('readTime');
const copyBtn = document.getElementById('copyBtn');

// Text Analysis Functions
function analyzeText(text) {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const characters = text.length;
    const readingTime = Math.ceil(words / 200); // Average reading speed

    return { words, characters, readingTime };
}

function downloadText() {
    const text = textInput.value;
    if (!text.trim()) return;

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'TextUtilityOutput.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateTextAnalysis() {
    const text = textInput.value;
    const analysis = analyzeText(text);

    wordCount.textContent = `${analysis.words} Words`;
    charCount.textContent = `${analysis.characters} Characters`;
    readTime.textContent = `${analysis.readingTime} mins`;

    updatePreview(text);
    updateCopyButton(text);
}

function updatePreview(text) {
    if (text.trim() === '') {
        textPreview.innerHTML = '<p class="preview-placeholder">Nothing to preview</p>';
    } else {
        textPreview.textContent = text;
    }
}

function updateCopyButton(text) {
    copyBtn.disabled = text.trim() === '';
}

function transformText(transformation) {
    const currentText = textInput.value;
    let newText;

    if (transformation === 'clearText') {
        newText = textTransformations[transformation]();
    } else {
        newText = textTransformations[transformation](currentText);
    }

    textInput.value = newText;
    updateTextAnalysis();

    textInput.style.transform = 'scale(1.01)';
    setTimeout(() => {
        textInput.style.transform = 'scale(1)';
    }, 150);
}

async function copyToClipboard() {
    const text = textInput.value;
    if (text.trim() === '') return;

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
        }
        document.body.removeChild(textArea);
    }
}

textInput.addEventListener('input', updateTextAnalysis);
textInput.addEventListener('paste', () => setTimeout(updateTextAnalysis, 10));

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        transformText('uppercase');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        transformText('lowercase');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        transformText('titleCase');
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyToClipboard();
    }
});

updateTextAnalysis();
document.documentElement.style.scrollBehavior = 'smooth';
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

textInput.addEventListener('focus', () => {
    textInput.style.boxShadow = '0 0 0 3px rgb(59 130 246 / 0.1)';
});

textInput.addEventListener('blur', () => {
    textInput.style.boxShadow = '';
});

let analysisTimeout;
const originalUpdateTextAnalysis = updateTextAnalysis;
updateTextAnalysis = function () {
    clearTimeout(analysisTimeout);
    analysisTimeout = setTimeout(originalUpdateTextAnalysis, 100);
};
