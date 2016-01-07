(function(win, doc) {
  var CodeMirror = win.CodeMirror;
  var textArea = doc.getElementById('code');
  
  var editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true
  });

})(window, document);
