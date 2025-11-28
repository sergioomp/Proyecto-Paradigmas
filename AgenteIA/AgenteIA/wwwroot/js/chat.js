document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('chatForm');
    const chatBox = document.getElementById('chatBox');
    const inputField = form.querySelector('[name="UserInput"]');

    let pendingMessage = null;

    inputField.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const text = inputField.value.trim();
            if (text === "") return;

            pendingMessage = text;
            inputField.value = "";

            form.dispatchEvent(new Event("submit"));
        }
    });


    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        let userInput = pendingMessage ?? inputField.value.trim();

        if (!userInput) return;

        pendingMessage = null;

        inputField.value = "";

        chatBox.innerHTML += `
            <li class="chat-entry temp">
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
        } else {
            alert('Error al procesar el mensaje.');
        }
    });
});
