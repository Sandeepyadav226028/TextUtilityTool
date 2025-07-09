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

    clearText: () => ''
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
textTransformations.reverseText = (text) => text.split('').reverse().join('');


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

// Text Transformation
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
    
    // Add visual feedback
    textInput.style.transform = 'scale(1.01)';
    setTimeout(() => {
        textInput.style.transform = 'scale(1)';
    }, 150);
}

// Copy to Clipboard
async function copyToClipboard() {
    const text = textInput.value;
    
    if (text.trim() === '') return;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Show success state
        copyBtn.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Fallback for older browsers
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
            console.error('Fallback copy failed: ', fallbackErr);
        }
        
        document.body.removeChild(textArea);
    }
}

// Event Listeners
textInput.addEventListener('input', updateTextAnalysis);
textInput.addEventListener('paste', () => {
    // Small delay to ensure pasted content is processed
    setTimeout(updateTextAnalysis, 10);
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + U for uppercase
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        transformText('uppercase');
    }
    
    // Ctrl/Cmd + L for lowercase
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        transformText('lowercase');
    }
    
    // Ctrl/Cmd + T for title case
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        transformText('titleCase');
    }
    
    // Ctrl/Cmd + Shift + C for copy
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyToClipboard();
    }
});

// Initialize
updateTextAnalysis();

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading animation for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Add focus management for accessibility
textInput.addEventListener('focus', () => {
    textInput.style.boxShadow = '0 0 0 3px rgb(59 130 246 / 0.1)';
});

textInput.addEventListener('blur', () => {
    textInput.style.boxShadow = '';
});

// Performance optimization: debounce text analysis for large texts
let analysisTimeout;
const originalUpdateTextAnalysis = updateTextAnalysis;

updateTextAnalysis = function() {
    clearTimeout(analysisTimeout);
    analysisTimeout = setTimeout(originalUpdateTextAnalysis, 100);
};