/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const run = document.querySelector('#run');

  let ws;

  var a2h = new AnsiUp;

  const showMessage = (message) => {
    console.log(message);
    message = a2h.ansi_to_html(message);
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  };

  const handleResponse = (response) => {
    return response.ok
      ? response.json().then((data) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  };

  run.onclick = () => {
    if (!ws) {
      connect();
    }

    var form = new FormData(document.getElementById('test-form'));

    fetch('http://localhost:3333/run', { method: 'POST', body: form })
      .then(handleResponse)
      .catch((err) => showMessage(err.message));
  };

  function connect () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://localhost:3333`);
    ws.onmessage = (msg) => showMessage(msg.data);
    ws.onerror = () => showMessage('WebSocket error');
    ws.onopen = () => showMessage('WebSocket connection established');
    ws.onclose = () => { showMessage('WebSocket connection closed'); ws = null; };
  };
})();