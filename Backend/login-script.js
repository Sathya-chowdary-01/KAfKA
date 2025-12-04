let selectedRole = null;

function selectRole(role) {
    // Reset all cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Select clicked card
    event.currentTarget.classList.add('selected');
    selectedRole = role;
    
    // Show form
    document.getElementById('loginForm').classList.remove('hidden');
    
    // Update labels
    const labels = {
        student: { label: 'College Email', placeholder: 'student@college.edu' },
        professional: { label: 'Work Email', placeholder: 'name@company.com' },
        hr: { label: 'Company Email', placeholder: 'hr@company.com' }
    };
    
    const config = labels[role];
    document.getElementById('emailLabel').textContent = config.label;
    document.getElementById('emailInput').placeholder = config.placeholder;
    document.getElementById('roleDisplay').textContent = 
        role === 'student' ? 'Student' :
        role === 'professional' ? 'Professional' : 'HR Recruiter';
}

// Form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedRole) return alert('Please select a role');
    
    // Simulate dashboard redirect
    const dashboards = {
        student: 'student-dashboard.html',
        professional: 'professional-dashboard.html',
        hr: 'hr-dashboard.html'
    };
    alert(`Redirecting to ${selectedRole} dashboard...\nNext step: Build your career score!`);
    // window.location.href = dashboards[selectedRole];
});
