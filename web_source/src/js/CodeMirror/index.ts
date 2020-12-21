import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
// 语法逻辑
import './modeHosts';
// 主题样式
import './hosts.css';
// 高亮当前行
import 'codemirror/addon/selection/active-line';
// 滚动条
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// 搜索
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
// 相关事件
import { changeTextareaTip, eventTextareaSave } from '../textarea';

let target = null;
let CodeMirrorEditor = null;
const options = {
  mode: 'hosts',
  theme: 'hosts',
  tabSize: 2,
  readOnly: false, // 只读模式
  lineNumbers: true, //显示行号
  styleActiveLine: true, // 高亮当前行
  lineWrapping: true, // 换行
  scrollbarStyle: 'overlay', // 滚动条样式
  extraKeys: {
    'Ctrl-S': eventTextareaSave,
  },
};

/**
 * 初始化文本编辑器
 * @param {boolean} readOnly 是否只读
 */
function init(readOnly: boolean = false) {
  options.readOnly = readOnly;
  target = document.getElementById('textarea');
  CodeMirrorEditor = CodeMirror.fromTextArea(target, options);
  CodeMirrorEditor.setSize('100%', '100%');
  CodeMirrorEditor.on('change', changeTextareaTip);
}

/**
 * 设置编辑器数据
 * @param {string} text 文本内容
 * @param {boolean} readOnly 是否只读
 */
function setValue(text: string, readOnly: boolean = false) {
  CodeMirrorEditor.setValue(text);
  if (typeof readOnly === 'boolean') CodeMirrorEditor.setOption('readOnly', readOnly);
}

/**
 * 获取编辑器中文本数据
 */
function getValue(): string {
  return CodeMirrorEditor.getValue();
}

/**
 * 设置当前项为只读
 * @param {boolean} readOnly 是否只读
 */
function setReadOnly(readOnly: boolean) {
  return CodeMirrorEditor.setOption('readOnly', readOnly);
}

export default {
  target: CodeMirrorEditor,
  init,
  setValue,
  getValue,
  setReadOnly,
};
