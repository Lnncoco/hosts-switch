// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function (mod) {
  if (typeof exports == 'object' && typeof module == 'object')
    // CommonJS
    mod(require('codemirror/lib/codemirror'));
  else if (typeof define == 'function' && define.amd)
    // AMD
    define(['codemirror/lib/codemirror'], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function (CodeMirror) {
  'use strict';

  CodeMirror.defineMode('hosts', function (config, parserConfig) {
    var indentUnit = config.indentUnit;
    var curPunc;

    function tokenBase(stream, state) {
      var ch = stream.next();
      if (ch == '#') {
        stream.skipToEnd();
        return 'comment';
      }

      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/);
        return 'number';
      }

      stream.eatWhile(/[\w\$_]/);
      return 'variable';
    }

    function Context(indented, column, type, align, prev) {
      this.indented = indented;
      this.column = column;
      this.type = type;
      this.align = align;
      this.prev = prev;
    }

    //Interface
    return {
      startState: function (basecolumn) {
        return {
          tokenize: null,
          context: new Context((basecolumn || 0) - indentUnit, 0, 'top', false),
          indented: 0,
          startOfLine: true,
        };
      },

      token: function (stream, state) {
        var ctx = state.context;
        if (stream.sol()) {
          if (ctx.align == null) ctx.align = false;
          state.indented = stream.indentation();
          state.startOfLine = true;
        }
        if (stream.eatSpace()) return null;
        curPunc = null;
        var style = (state.tokenize || tokenBase)(stream, state);
        if (style == 'comment') return style;
        if (ctx.align == null) ctx.align = true;

        if (curPunc == ctx.type) {
          state.context = state.context.prev;
        }
        state.startOfLine = false;
        return style;
      },

      electricChars: '{}',
      lineComment: '#',
      fold: 'brace',
    };
  });

  CodeMirror.defineMIME('hosts', {
    name: 'hosts',
    multiLineStrings: true,
  });
});
