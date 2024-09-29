import express from 'express';
import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { getResponseFromGPT } from './../gpt'; // GPT-4 integration
import { saveInterviewSession } from './../firebase'; // Firestore integration

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Setup WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', async (message: Buffer | string | null) => {
    if (message) {
      console.log(`Received message => ${message}`);

      // Convert message to string (for Buffer types)
      const question = message.toString();

      try {
        // Process the message with GPT-4
        const gptResponse = await getResponseFromGPT(question);

        // Ensure that gptResponse is a string
        if (gptResponse) {
          ws.send(gptResponse.toString());  // Send as string
        } else {
          ws.send("Sorry, I couldn't generate a response.");  // Handle null case
        }

        // Save the session data (assuming sessionId is available)
        const sessionId = 'some-session-id'; // Generate this dynamically as per your logic
        await saveInterviewSession(sessionId, { question, response: gptResponse });
      } catch (error) {
        console.error('Error generating GPT-4 response:', error);
        ws.send("An error occurred while processing the question.");
      }
    } else {
      console.error('Received a null message.');
    }
  });

  ws.send('WebSocket connection established.');
});

// Start HTTP server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
