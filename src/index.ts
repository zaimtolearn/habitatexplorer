import { Hono } from 'hono'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Animal Habitat Quiz</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f0f8ff;
          line-height: 1.6;
        }
        h1 {
          text-align: center;
          color: #2c3e50;
          font-size: 2.5em;
          margin-bottom: 30px;
        }
        .question { 
          display: none;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .question.active { 
          display: block;
          animation: fadeIn 0.5s;
        }
        .emoji {
          font-size: 100px;
          margin: 20px 0;
        }
        button { 
          padding: 12px 25px;
          margin: 10px;
          border: none;
          border-radius: 25px;
          background-color: #3498db;
          color: white;
          font-size: 1.1em;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
        }
        button:hover {
          transform: scale(1.05);
          background-color: #2980b9;
        }
        #result { 
          font-size: 1.5em;
          text-align: center;
          margin-top: 20px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <h1>🌍 Animal Habitat Quiz 🌍</h1>
      <div id="quiz">
        <div class="question active" data-correct="cold">
          <div class="emoji">🐻‍❄️</div>
          <h2>Question 1: Where does the Polar Bear live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>
        
        <div class="question" data-correct="hot">
          <div class="emoji">🐪</div>
          <h2>Question 2: Where does the Camel live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="cold">
          <div class="emoji">🐧</div>
          <h2>Question 3: Where does the Penguin live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="hot">
          <div class="emoji">🦁</div>
          <h2>Question 4: Where does the Lion live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="cold">
          <div class="emoji">🦊</div>
          <h2>Question 5: Where does the Arctic Fox live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="hot">
          <div class="emoji">🦒</div>
          <h2>Question 6: Where does the Giraffe live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="cold">
          <div class="emoji">🦌</div>
          <h2>Question 7: Where does the Reindeer live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="hot">
          <div class="emoji">🦘</div>
          <h2>Question 8: Where does the Kangaroo live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="cold">
          <div class="emoji">🐆</div>
          <h2>Question 9: Where does the Snow Leopard live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>

        <div class="question" data-correct="hot">
          <div class="emoji">🦦</div>
          <h2>Question 10: Where does the Meerkat live?</h2>
          <button onclick="checkAnswer('cold', this)">Cold Region ❄️</button>
          <button onclick="checkAnswer('hot', this)">Hot Region 🌞</button>
        </div>
      </div>
      <div id="result"></div>

      <script>
        let score = 0;
        let points = 0;
        let currentQuestion = 0;
        const totalQuestions = 10;
        
        const pointValues = {
          0: 10,
          1: 10,
          2: 10,
          3: 10,
          4: 15,
          5: 10,
          6: 15,
          7: 10,
          8: 15,
          9: 15
        };

        function checkAnswer(correct, button) {
          const selected = button.textContent.toLowerCase().includes('cold') ? 'cold' : 'hot';
          if (selected === correct) {
            score++;
            points += pointValues[currentQuestion];
            button.style.backgroundColor = '#2ecc71';
          } else {
            button.style.backgroundColor = '#e74c3c';
          }
          
          setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < totalQuestions) {
              document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
              document.querySelectorAll('.question')[currentQuestion].classList.add('active');
            } else {
              showResult();
            }
          }, 1000);
        }

        function showResult() {
          document.getElementById('quiz').style.display = 'none';
          const percentage = (score/totalQuestions) * 100;
          let emoji = '🎉';
          if (percentage < 50) emoji = '😢';
          else if (percentage < 80) emoji = '👍';
          document.getElementById('result').innerHTML = 
            '<h2>Quiz completed! ' + emoji + '</h2>' +
            '<p>Your score: ' + score + '/' + totalQuestions + ' (' + percentage + '%)</p>' +
            '<p>Total points earned: ' + points + '/120 points</p>';
        }
      </script>
    </body>
    </html>
  `)
})

export default app