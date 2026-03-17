import * as fs from 'fs';
import * as path from 'path';

const FIREBASE_CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLIENT_SECRET = 'j9iVZfS8nnGolaXqgR10';

async function exchange() {
  const authCode = '4/0AfrIepCTlY2wxPi7hKcPEHPKGn_TXxalr83nzkXrO6caY1T3u3FnA-G3ur75KKUa1YtAkQ';
  console.log("Exchanging token...");
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: FIREBASE_CLIENT_ID,
      client_secret: FIREBASE_CLIENT_SECRET,
      code: authCode,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    })
  });
  const text = await res.text();
  console.log('Status:', res.status);
  
  if (res.ok) {
     const data = JSON.parse(text);
     const tokenData = {
         refresh_token: data.refresh_token,
         access_token: data.access_token,
         expires_at: Date.now() + (data.expires_in * 1000)
     };
     fs.writeFileSync('scripts/fb-tokens.json', JSON.stringify(tokenData, null, 2));
     console.log('Successfully saved to scripts/fb-tokens.json!');
  } else {
     console.error('Failed to exchange code:', text);
  }
}
exchange().catch(console.error);
