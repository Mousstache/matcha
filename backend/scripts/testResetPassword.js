import fetch from 'node-fetch';

async function testResetPassword() {
  try {
    // D'abord, tester forgot-password pour obtenir un token
    console.log('📧 Test forgot-password...');
    const forgotRes = await fetch('http://localhost:5001/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    console.log('Forgot password status:', forgotRes.status);
    const forgotData = await forgotRes.text();
    console.log('Forgot password response:', forgotData);
    
    // Test avec un faux token
    console.log('\n🔑 Test reset-password avec faux token...');
    const resetRes = await fetch('http://localhost:5001/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        token: 'fake-token-123',
        newPassword: 'newPassword123!'
      })
    });
    
    console.log('Reset password status:', resetRes.status);
    const resetData = await resetRes.json();
    console.log('Reset password response:', resetData);
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

testResetPassword();
