// Netlify Serverless Function — Password Gate
// The password is stored in Netlify Environment Variables, never in the front-end code.
// To update the monthly password: go to Netlify → Site Settings → Environment Variables
// and change GRIMOIRE_PASSWORD to the new riddle answer (lowercase, no spaces).

exports.handler = async function(event) {
  // Only allow POST
  if(event.httpMethod !== 'POST'){
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try{
    body = JSON.parse(event.body);
  } catch(e){
    return { statusCode: 400, body: 'Bad Request' };
  }

  const userAnswer   = (body.answer || '').toLowerCase().trim();
  const correctAnswer = (process.env.GRIMOIRE_PASSWORD || '').toLowerCase().trim();

  // Safety check — if env var not set, deny access
  if(!correctAnswer){
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct: false })
    };
  }

  const isCorrect = userAnswer === correctAnswer;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correct: isCorrect })
  };
};
