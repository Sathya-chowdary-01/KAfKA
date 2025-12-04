// Role selection
const studentBtn = document.getElementById('student-btn');
const professionalBtn = document.getElementById('professional-btn');
const hrBtn = document.getElementById('hr-btn');

const roleSelection = document.getElementById('role-selection');
const studentLogin = document.getElementById('student-login');
const otherLogin = document.getElementById('other-login');

studentBtn.addEventListener('click', () => {
    roleSelection.style.display = 'none';
    studentLogin.style.display = 'block';
});

professionalBtn.addEventListener('click', () => {
    roleSelection.style.display = 'none';
    otherLogin.style.display = 'block';
});

hrBtn.addEventListener('click', () => {
    roleSelection.style.display = 'none';
    otherLogin.style.display = 'block';
});

// ---------------- Google Login ----------------
window.onload = function () {
    google.accounts.id.initialize({
        client_id: '122987114130-v4hm61luhtvil4tvjq7inr5tm4rjb7h4.apps.googleusercontent.com',
        callback: handleGoogleResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn"),
        { theme: "outline", size: "large", width: "250" }
    );
    google.accounts.id.prompt();
};

function handleGoogleResponse(response) {
    console.log("Google JWT:", response.credential);
    alert("Google login successful!");
    // Here you can decode the JWT or send it to backend for session
}

// ---------------- Facebook Login ----------------
window.fbAsyncInit = function() {
    FB.init({
        appId      : 'YOUR_FACEBOOK_APP_ID',
        cookie     : true,
        xfbml      : true,
        version    : 'v16.0'
    });

    document.getElementById('fb-login-btn').addEventListener('click', function(){
        FB.login(function(response) {
            if (response.status === 'connected') {
                FB.api('/me', {fields: 'name,email'}, function(userData){
                    console.log(userData);
                    alert("Facebook login successful! Welcome " + userData.name);
                });
            } else {
                alert("Facebook login failed.");
            }
        }, {scope: 'email'});
    });
};

