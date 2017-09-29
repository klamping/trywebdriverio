/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const run = document.querySelector('#run');

  let ws;

  const showMessage = (message) => {
    console.log(message);
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

    fetch('/run', { method: 'POST', body: form })
      .then(handleResponse)
      .catch((err) => showMessage(err.message));
  };

  function connect () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onmessage = (msg) => showMessage(msg.data);
    ws.onerror = () => showMessage('WebSocket error');
    ws.onopen = () => showMessage('WebSocket connection established');
    ws.onclose = () => { showMessage('WebSocket connection closed'); ws = null; };
  };
})();