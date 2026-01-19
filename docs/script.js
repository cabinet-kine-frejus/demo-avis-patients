// Configuration
const PLACE_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
const SPAM_PREVENTION_HOURS = 24;

// Éléments DOM
const stars = document.querySelectorAll('.star');
const ratingText = document.getElementById('rating-text');
const submitBtn = document.getElementById('submit-btn');
const commentSection = document.getElementById('comment-section');
const commentTextarea = document.getElementById('comment');
const charCount = document.getElementById('char-count');
const ratingSection = document.getElementById('rating-section');
const thankYouSection = document.getElementById('thank-you-section');
const thankYouMessage = document.getElementById('thank-you-message');

let selectedRating = 0;

// Anti-spam
function hasRecentlyVoted() {
    const lastVote = localStorage.getItem('lastVoteTimestamp');
    if (!lastVote) return false;
    const hoursSinceVote = (Date.now() - parseInt(lastVote)) / (1000 * 60 * 60);
    return hoursSinceVote < SPAM_PREVENTION_HOURS;
}

function recordVote() {
    localStorage.setItem('lastVoteTimestamp', Date.now().toString());
}

// Gestion étoiles
stars.forEach(star => {
    star.addEventListener('click', function() {
        if (hasRecentlyVoted()) {
            alert('Vous avez déjà donné votre avis récemment. Merci !');
            return;
        }
        
        selectedRating = parseInt(this.dataset.rating);
        stars.forEach(s => s.classList.remove('selected'));
        
        for (let i = 0; i < selectedRating; i++) {
            stars[i].classList.add('selected');
        }
        
        const messages = {
            1: 'Désolé que votre expérience n\'ait pas été satisfaisante',
            2: 'Nous pouvons faire mieux',
            3: 'Merci, votre avis nous aide',
            4: 'Très bien ! Merci',
            5: 'Excellent ! Partagez votre avis sur Google'
        };
        
        ratingText.textContent = messages[selectedRating];
        
        if (selectedRating < 5) {
            commentSection.style.display = 'block';
        } else {
            commentSection.style.display = 'none';
        }
        
        submitBtn.disabled = false;
    });
});

// Compteur caractères
commentTextarea.addEventListener('input', function() {
    charCount.textContent = this.value.length;
});

// Soumission
submitBtn.addEventListener('click', function() {
    if (selectedRating === 0) return;
    
    recordVote();
    
    if (selectedRating === 5) {
        window.location.href = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;
    } else {
        const messages = {
            1: 'Nous sommes désolés de votre expérience. Vos remarques seront prises en compte.',
            2: 'Merci pour votre retour. Nous allons travailler à nous améliorer.',
            3: 'Merci pour votre feedback constructif.',
            4: 'Merci pour votre avis positif !'
        };
        
        thankYouMessage.textContent = messages[selectedRating];
        ratingSection.style.display = 'none';
        thankYouSection.style.display = 'block';
    }
});
