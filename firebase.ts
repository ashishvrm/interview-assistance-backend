import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH || './path-to-your-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const firestore = admin.firestore();

// Function to save interview session data
export const saveInterviewSession = async (sessionId: string, sessionData: any) => {
  try {
    await firestore.collection('interviewSessions').doc(sessionId).set(sessionData, { merge: true });
    console.log(`Session data for sessionId ${sessionId} saved successfully.`);
  } catch (error) {
    console.error('Error saving session data: ', error);
  }
};

// Function to retrieve interview session data
export const getInterviewSession = async (sessionId: string) => {
  try {
    const sessionDoc = await firestore.collection('interviewSessions').doc(sessionId).get();
    if (sessionDoc.exists) {
      return sessionDoc.data();
    } else {
      console.log(`No session found for sessionId ${sessionId}`);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving session data: ', error);
  }
};
