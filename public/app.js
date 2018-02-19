/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const run = document.querySelector('#run');
  const share = document.querySelector('#share');
  const closeShare = document.querySelector('.close-share');
  const baseUrl = document.getElementById('baseUrl');
  const spinner = document.getElementById('spinner');

  let ws;

  let waitingOnResults = false;

  var a2h = new AnsiUp();

  // a2h.use_classes = true;

  function startTest () {
    waitingOnResults = true;
    run.disabled = true;
    run.innerText = "Test Running";
    spinner.className = 'show';
  }
  function endTest () {
    waitingOnResults = false;
    run.disabled = false;
    run.innerText = "Run Test";
    spinner.className = '';
  }

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

    ws = new WebSocket(`ws://${location.host}`);
    ws.onmessage = (msg) => {
      if (msg.data == 'Tests completed!') {
        endTest();
      }

      showMessage(msg.data)
    };
    ws.onerror = () => showMessage('Connection error');
    ws.onopen = () => {
      endTest();
    };
    ws.onclose = () => {
      if (waitingOnResults) {
        showMessage('Connection closed. Please retry.');
      }
      ws = null;
      endTest();
    };
  };

  run.onclick = () => {
    if (!ws) {
      connect();
    }

    let data = {
      baseUrl: baseUrl.value,
      code: editor.getValue()
    };

    ws.send(JSON.stringify(data));

    startTest();

    _paq.push(['trackEvent', 'Functionality', 'Button', 'Run']);
  };

  share.onclick = () => {
    var data = new FormData();
    data.append('baseUrl', baseUrl.value);
    data.append('code', editor.getValue());

    let req = fetch("/save", {
      method: "POST",
      body: data
    });

    req.then(function(response) {
      return response.text();
    }).then(function(id) {
      let shareUrl = new URL('/share/' + id, document.location);
      let input = document.getElementById('sharable-url');
      document.getElementById('shareUrl').className = "show";
      document.getElementById('sharable-url').value = shareUrl.href;
      input.select();
      history.pushState(null, null, shareUrl.href);
    });

    _paq.push(['trackEvent', 'Functionality', 'Button', 'Share']);
  };

  closeShare.onclick = () => {
      document.getElementById('shareUrl').className = "";
  }

  connect();
})();