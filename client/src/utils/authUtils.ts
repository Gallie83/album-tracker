export const handleLogin = () => {
    try {
        const returnUrl = window.location.pathname;
        window.location.replace(`http://localhost:5000/login?returnUrl=${returnUrl}`);
    } catch (error) {
        console.error('Login failed:', error);
    }
};