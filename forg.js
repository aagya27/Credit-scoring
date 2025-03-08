document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var message = document.getElementById('message');
    
    if (email.trim() === '') {
        message.textContent = 'Please enter your email address';
        message.style.color = 'red';
        return;
    }
    
    message.textContent = 'A password reset link has been sent to ' + email;
    message.style.color = 'green';
});