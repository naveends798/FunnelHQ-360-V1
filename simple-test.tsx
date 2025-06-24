import React from "react";

function SimpleApp() {
  console.log("🔥 Simple app rendering");
  
  return (
    <div style={{ 
      background: '#1a1a1a', 
      minHeight: '100vh', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎯 Funnel Portal - Simple Test</h1>
      <p>✅ React is working!</p>
      <p>✅ JavaScript is executing!</p>
      <p>✅ Page is rendering!</p>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#333', borderRadius: '5px' }}>
        <h3>Next Steps:</h3>
        <ul>
          <li>Check browser console for errors</li>
          <li>Try the full app again</li>
          <li>If this works, the issue is in the main App.tsx</li>
        </ul>
      </div>
      
      <button 
        onClick={() => {
          console.log("Button clicked - switching to main app");
          window.location.href = "/?main=true";
        }}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Try Main App
      </button>
    </div>
  );
}

export default SimpleApp;