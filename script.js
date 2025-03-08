// Navigation active state
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Multi-step form navigation
function nextStep(currentStep) {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const nextFormStep = document.querySelector(`.form-step[data-step="${currentStep + 1}"]`);
    const currentProgress = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
    const nextProgress = document.querySelector(`.progress-step[data-step="${currentStep + 1}"]`);

    if (validateStep(currentStep)) {
        currentFormStep.classList.remove('active');
        nextFormStep.classList.add('active');
        currentProgress.classList.add('completed');
        nextProgress.classList.add('active');
    }
}

function prevStep(currentStep) {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const prevFormStep = document.querySelector(`.form-step[data-step="${currentStep - 1}"]`);
    const currentProgress = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
    const prevProgress = document.querySelector(`.progress-step[data-step="${currentStep - 1}"]`);

    currentFormStep.classList.remove('active');
    prevFormStep.classList.add('active');
    currentProgress.classList.remove('active');
    prevProgress.classList.add('active');
}

// Form validation
function validateStep(step) {
    const currentStep = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentStep.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            showError(input, 'This field is required');
        } else {
            clearError(input);
        }
    });

    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.classList.add('error');
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    
    if (error) {
        formGroup.removeChild(error);
    }
    
    input.classList.remove('error');
}

// Credit Score Calculator
function calculateCreditScore() {
    const businessAge = parseFloat(document.getElementById('businessAge').value);
    // const annualRevenue = parseFloat(document.getElementById('annualRevenue').value);
    const annualRevenue = parseFloat(document.getElementById('annualRevenue').value.replace(/,/g, ''));
    const profitMargin = parseFloat(document.getElementById('profitMargin').value);
    const existingLoans = parseFloat(document.getElementById('existingLoans').value);
    const industry = document.getElementById('industry').value;

    // Base score calculation
    let score = 550;

    // Business age impact (0-100 points)
    score += Math.min(businessAge * 10, 100);

    // Annual revenue impact (0-100 points)
    score += Math.min((annualRevenue / 100000) * 10, 100);

    // Profit margin impact (-50 to +50 points)
    score += (profitMargin / 2);

    // Industry risk adjustment (-20 to +20 points)
    const industryScores = {
        'technology': 20,
        'retail': 10,
        'manufacturing': 0,
        'services': 15,
        'other': 0
    };
    score += industryScores[industry] || 0;

    // Existing loans impact (-50 points per loan)
    score -= (existingLoans * 50);

    // Ensure score stays within 300-850 range
    score = Math.max(300, Math.min(850, Math.round(score)));

    // Determine score category and color
    let category, color;
    if (score >= 750) {
        category = 'Excellent';
        color = 'var(--success-color)';
    } else if (score >= 670) {
        category = 'Good';
        color = 'var(--primary-color)';
    } else if (score >= 580) {
        category = 'Fair';
        color = 'var(--warning-color)';
    } else {
        category = 'Poor';
        color = 'var(--error-color)';
    }

    // Update UI
    const scoreResult = document.getElementById('scoreResult');
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreCircle = document.querySelector('.score-circle');

    scoreNumber.textContent = score;
    scoreCircle.style.borderColor = color;
    
    // Animate to next step
    nextStep(2);
    
    // Show result section
    scoreResult.classList.remove('hidden');
    
    // Animate score counter
    animateScore(score, color);
}

function animateScore(targetScore, color) {
    const scoreElement = document.getElementById('scoreNumber');
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentScore = 300;
    const increment = (targetScore - 300) / steps;

    scoreElement.style.color = color;

    const animation = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            clearInterval(animation);
            currentScore = targetScore;
        }
        scoreElement.textContent = Math.round(currentScore);
    }, stepDuration);
}

// Loan Application
function submitLoanApplication(event) {
    event.preventDefault();

    const form = event.target;
    if (!validateStep(3)) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Submitting...';

    // Simulate API call
    setTimeout(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Application Submitted Successfully!</h3>
            <p>Thank you for applying. We will review your application and contact you soon.</p>
            <p>Application Reference: ${generateReference()}</p>
        `;

        // Clear form and show success message
        form.reset();
        const formContainer = document.querySelector('.loan-application');
        formContainer.appendChild(successMessage);

        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }, 2000);
}

// Consulting Modal
const modal = document.getElementById('consultingModal');
const consultingBtn = document.getElementById('consultingBtn');
const closeModal = document.querySelector('.close-modal');

if (consultingBtn) {
    consultingBtn.onclick = function() {
        modal.classList.add('active');
    }
}

if (closeModal) {
    closeModal.onclick = function() {
        modal.classList.remove('active');
    }
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.remove('active');
    }
}

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

// Auto-advance testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Helper Functions
function generateReference() {
    return 'APP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Form input formatting
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.id === 'loanAmount' || this.id === 'annualRevenue') {
            this.value = formatNumber(this.value);
        }
    });
});

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
