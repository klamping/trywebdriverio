/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const run = document.querySelector('#run');

  let ws;

  var a2h = new AnsiUp();

  // a2h.use_classes = true;

  const showMessage = (message) => {
    message = a2h.ansi_to_html(message);

    if(message.indexOf("\n")==-1){
      message += '\n';
    }

    messages.innerHTML += message;
    messages.scrollTop = messages.scrollHeight;
  };

  function connect () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://localhost:3333`);
    ws.onmessage = (msg) => {
      if (msg.data == 'Tests completed!') {
        document.getElementById('run').disabled = false;
      }

      showMessage(msg.data)
    };
    ws.onerror = () => showMessage('WebSocket error');
    ws.onopen = () => {
      // undisable button
      document.getElementById('run').disabled = false;
    };
    ws.onclose = () => {
      showMessage('WebSocket connection closed');
      ws = null;
      document.getElementById('run').disabled = true;
    };
  };

  run.onclick = () => {
    if (!ws) {
      connect();
    }

    let data = {
      baseUrl: document.getElementById('baseUrl').value,
      code: editor.getValue()
    };

    document.getElementById('run').disabled = true;

    ws.send(JSON.stringify(data));
  };

  connect();
})();