'use strict'

class Editor {
  constructor(element) {
    this.selfEl = $(element) || $(document.body);
    this.inputEl = $('<textarea/>').
      addClass('editor-input').
      attr({
        // rows: '40',
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off'
      });
    this.consoleEl = $('<div/>').
      addClass('editor-console');
    this.runEl = $('<button/>').
      addClass('editor-run').
      html('Run');
    this.outputEl = $('<div/>').
      addClass('editor-output').
      attr({
        rows: '10',
        readonly: 'readonly'
      });
    this.inputEl.on('focus', function(event) {
      event.stopPropagation();
      event.preventDefault();
      this.focus();
    });
    this.runEl.click($.proxy(function(event) {
      event.stopPropagation();
      event.preventDefault();
      this.evaluate();
      return true;
    }, this)
    );

    this.consoleEl.append(this.runEl);
    this.consoleEl.append(this.outputEl);
    this.selfEl.append(this.inputEl);
    this.selfEl.append(this.consoleEl);
  }

  get input() {
    return this.inputEl.val();
  }

  set input(value) {
    return this.inputEl.val(value);
  }

  get output() {
    return this.outputEl.text();
  }

  focus() {
    this.inputEl.focus();
  }

  appendOutput(text) {
    let textEl = $('<div/>').text(text);
    this.outputEl.append(textEl);
    this.outputEl.scrollTop(this.outputEl[0].scrollHeight);
  }

  evaluate() {
    let data = {
      code: this.input,
    }

    $.ajax({
      type: 'POST',
      url: '/_evaluate',
      timeout: 60000,
      data: data,
      success: $.proxy(function(response) {
        this.appendOutput(response.output);
        this.focus();
      }, this),
    });
  }
}
