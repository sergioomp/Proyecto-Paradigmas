document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('chatForm');
    const chatBox = document.getElementById('chatBox');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const inputField = form.querySelector('[name="UserInput"]');
        const userInput = inputField.value.trim();

        if (!userInput) return;

        chatBox.innerHTML += `
            <li class="chat-entry temp">
                <div class="user-msg">${userInput}</div>
                <div class="bot-msg">Asistente escribiendo...</div>
            </li>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

        const response = await fetch('/Agente/Send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserInput: userInput })
        });

        if (response.ok) {
            const html = await response.text();

            const temp = document.querySelector('.chat-entry.temp');
            if (temp) temp.remove();

            chatBox.innerHTML += html;
            chatBox.scrollTop = chatBox.scrollHeight;
            inputField.value = '';
        } else {
            alert('Error al procesar el mensaje.');
        }
    });
});
