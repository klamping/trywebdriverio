/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const run = document.querySelector('#run');

  let ws;

  var a2h = new AnsiUp;

  const showMessage = (message) => {
    message = a2h.ansi_to_html(message);

    if(message.indexOf("\n")==-1){
      message += '\n';
    }

    messages.innerHTML += message;
    messages.scrollTop = messages.scrollHeight;
  };

  const handleResponse = (response) => {
    return response.ok
      ? response.json().then((data) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  };

  function connect () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://localhost:3333`);
    ws.onmessage = (msg) => {
      showMessage(msg.data)
    };
    ws.onerror = () => showMessage('WebSocket error\n');
    ws.onopen = () => showMessage('WebSocket connection established\n');
    ws.onclose = () => { showMessage('WebSocket connection closed\n'); ws = null; };
  };

  run.onclick = () => {
    if (!ws) {
      connect();
    }

    let data = {
      baseUrl: document.getElementById('baseUrl').value,
      code: document.getElementById('code').value
    };

    ws.send(JSON.stringify(data));
  };

  connect();
})();