/// <reference types="vite/client" />

interface Window {
    env: {
        VITE_GOOGLE_CLIENT_ID: string;
        VITE_BACKEND_URL: string;
        VITE_RAZORPAY_KEY_ID: string;
        // Add any other variables you expect here
    };
}
