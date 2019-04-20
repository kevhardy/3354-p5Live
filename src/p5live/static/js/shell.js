'use strict'

class Shell {
  constructor(element) {
    this.selfEl = $(element) || $(document.body);
    this.outputEl = $('<div/>').
      addClass('shell-output');
    this.inputEl = $('<div/>').
      addClass('shell-input');
    this.caretEl = $('<textarea/>').
      addClass('shell-caret').
      attr({
        rows: '4',
        readonly: 'readonly'
      }).
      html('&gt;&gt;&gt;');
    this.promptEl = $('<textarea/>').
      addClass('shell-prompt').
      attr({
        rows: '4',
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off'
      });

    this.promptEl.on('focus', function(event) {
      event.stopPropagation();
      event.preventDefault();
      this.focus();
    });
    this.promptEl.on('keydown', $.proxy(function(event) {
      switch (event.which) {
        case 13:
          event.stopPropagation();
          event.preventDefault();
          this.evaluate();
          return true;
        }
      }, this)
    );

    this.inputEl.append(this.caretEl);
    this.inputEl.append(this.promptEl);
    this.selfEl.append(this.outputEl);
    this.selfEl.append(this.inputEl);

    this.evaluating = false;
  }

  get prompt() {
    return this.promptEl.val();
  }

  set prompt(value) {
    return this.promptEl.val(value);
  }

  get output() {
    return this.outputEl.text();
  }

  focus() {
    this.promptEl.focus();
  }

  appendOutput(text, statement) {
    let textEl = $('<div/>').text(text);
    if (statement) {
      let stateEl = $('<div/>').text('>>> ' + statement);
      this.outputEl.append(stateEl);
    }
    this.outputEl.append(textEl);
  }

  clearPrompt() {
    this.prompt = '';
  }

  evaluate() {
    let data = {
      statement: this.prompt,
    }

    this.clearPrompt();

    $.ajax({
      type: 'POST',
      url: '/_evaluate',
      timeout: 60000,
      data: data,
      success: $.proxy(function(response) {
        this.appendOutput(response.output, data.statement);
        this.focus();
      }, this),
    });
  }
}
