<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kish MD</title>
    <style>
        :root {
            --primary-color: #7c3aed;
            --secondary-color: #4f46e5;
            --text-color: #1f2937;
            --bg-color: #ffffff;
        }

        [data-theme="dark"] {
            --primary-color: #8b5cf6;
            --secondary-color: #6366f1;
            --text-color: #f3f4f6;
            --bg-color: #1a1a1a;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--text-color);
            min-height: 100vh;
            transition: background 0.3s, color 0.3s;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: var(--bg-color);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-color);
            color: var(--text-color);
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .theme-toggle:hover {
            transform: scale(1.05);
        }

        .chat-container {
            height: 60vh;
            overflow-y: auto;
            padding: 15px;
            border: 2px solid var(--primary-color);
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .message {
            margin: 10px 0;
            padding: 12px;
            border-radius: 8px;
            max-width: 80%;
        }

        .user-message {
            background: var(--primary-color);
            color: white;
            margin-left: auto;
        }

        .bot-message {
            background: rgba(79, 70, 229, 0.1);
            border: 1px solid var(--primary-color);
            margin-right: auto;
        }

        .input-container {
            display: flex;
            gap: 10px;
        }

        input {
            flex: 1;
            padding: 15px;
            border: 2px solid var(--primary-color);
            border-radius: 8px;
            background: var(--bg-color);
            color: var(--text-color);
            font-size: 16px;
        }

        button {
            padding: 15px 25px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        button:hover {
            transform: scale(1.05);
            background: var(--secondary-color);
        }

        .loading {
            display: none;
            color: var(--primary-color);
            text-align: center;
            padding: 10px;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        .loading span {
            animation: pulse 1.5s infinite;
        }
    </style>
</head>
<body>
    <button class="theme-toggle" onclick="toggleTheme()">🌓 Toggle Theme</button>
    <div class="container">
        <h1 style="color: var(--primary-color); text-align: center;">Kish MD</h1>
        <div class="chat-container" id="chatContainer"></div>
        <div class="input-container">
            <input type="text" id="userInput" placeholder="Ask me anything..." />
            <button onclick="sendMessage()">Send</button>
        </div>
        <div class="loading" id="loading">Generating response<span>...</span></div>
    </div>

    <script>
        let isDarkMode = false;

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        }

        async function sendMessage() {
            const userInput = document.getElementById('userInput');
            const chatContainer = document.getElementById('chatContainer');
            const loading = document.getElementById('loading');
            
            if (!userInput.value.trim()) return;

            // Add user message
            chatContainer.innerHTML += `
                <div class="message user-message">
                    ${userInput.value}
                </div>
            `;

            // Show loading
            loading.style.display = 'block';
            
            try {
                const response = await fetch(`https://kish-chat-gpt.onrender.com/gpt?query=${encodeURIComponent(userInput.value)}`);
                const data = await response.json();

                // Add bot message
                chatContainer.innerHTML += `
                    <div class="message bot-message">
                        ${data.response.replace(/\n/g, '<br>')}
                    </div>
                `;
            } catch (error) {
                chatContainer.innerHTML += `
                    <div class="message bot-message" style="color: #ef4444">
                        Error fetching response. Please try again.
                    </div>
                `;
            }

            // Clear input and hide loading
            userInput.value = '';
            loading.style.display = 'none';
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // Enter key support
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
