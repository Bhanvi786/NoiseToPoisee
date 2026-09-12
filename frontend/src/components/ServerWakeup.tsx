'use client';

import { useEffect } from 'react';

export default function ServerWakeup() {
  useEffect(() => {
    // Eagerly pre-fetch from the backend just to wake it up if it's sleeping.
    // This happens silently in the background when the user loads the app.
    const wakeUpServer = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        // A simple fetch is enough to trigger a cold boot on Render
        fetch(`${apiUrl}/api/artworks`, { method: 'GET', keepalive: true })
          .then(res => res.ok ? console.log('Server is awake') : null)
          .catch(() => {}); // ignore errors silently
      } catch (err) {
        // ignore errors completely
      }
    };
    
    // Slight delay so we don't block the initial page render tasks
    setTimeout(wakeUpServer, 1000);
  }, []);

  // Renders nothing, it's just a functional component for background logic
  return null;
}
