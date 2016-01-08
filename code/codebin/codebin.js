(function(window, document) {
  var CodeMirror = window.CodeMirror;
  var textArea = document.getElementById('code');
  var host = 'https://blog.bomsy.org'

  function messageListener(event) {
    if (event.origin !== host) {
      return;
    }
    setEditorValue(event.data);
  }  

  if (window.addEventListener) {
    window.addEventListener('message', messageListener, false);
  } else {
    window.attachEvent('onmessage', messageListener);
  }

  var editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: 'htmlmixed'
  });

  function setEditorValue(value) {
    editor.setValue(value);
  }


})(window, document);
