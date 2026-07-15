import axios from 'axios';
import FormData from 'form-data';

async function test() {
  try {
    const form = new FormData();
    form.append('type', 'Shift Progress Note');
    form.append('file', Buffer.from('test'), 'test.pdf');
    
    // We don't have the auth token, but we can try without it, or we can just print the exact payload structure from the network tab using a local server.
  } catch(e) {}
}
