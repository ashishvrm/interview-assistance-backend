interface SessionContext {
    previousQuestions: string[];
  }
  
  const sessionContexts: { [key: string]: SessionContext } = {};
  
  export const getSessionContext = (sessionId: string): SessionContext => {
    if (!sessionContexts[sessionId]) {
      sessionContexts[sessionId] = { previousQuestions: [] };
    }
    return sessionContexts[sessionId];
  };
  
  export const updateSessionContext = (sessionId: string, question: string) => {
    const context = getSessionContext(sessionId);
    context.previousQuestions.push(question);
  };
  