import BUS from './bus';
import codeMirror from './CodeMirror';
import dataAction from './dataAction';
import contextMenu from './contextMenu';
import { eventTextareaUpdate, eventTextareaSave } from './textarea';

export default function init() {
  initBusData();
  initBind();
  // 初始化导航栏
  dataAction.init();
  // 初始化编辑器
  codeMirror.init();
}

/* 初始化DOM对象相关数据 */
function initBusData() {
  BUS.nav = document.querySelector('#nav ul'); // 导航栏
  BUS.textarea = document.querySelector('.textarea'); // 文本组件框
  BUS.dialog = document.querySelector('.dialog-item'); // 弹出窗
  BUS.inputName = document.querySelector('.item-body input[name=name]'); // 弹出窗输入框name
  BUS.inputUrl = document.querySelector('.item-body input[name=url]'); // 弹出窗输入框url
  BUS.shade = document.querySelector('.shade'); // 遮罩层
  BUS.contextMenu = document.querySelector('.context-menu'); // 右键菜单
}

/* 禁用影响使用的快捷键 */
function disabledKeyboardShortcuts() {
  window.onkeydown = window.onkeyup = window.onkeypress = function (event: KeyboardEvent) {
    //禁止ctrl+u
    if (event.ctrlKey && event.key.toLowerCase() == 'u') return false;
    //禁止ctrl+s
    if (event.ctrlKey && event.key.toLowerCase() == 's') return false;
    //禁止ctrl+shift+i
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() == 'i') return false;
    //禁止 F5
    if (event.key == 'F5') return false;
    //禁止 F12
    if (event.key == 'F12') return false;
  };
}

/* 初始化绑定 */
function initBind() {
  if (process.env.NODE_ENV === 'production') disabledKeyboardShortcuts();
  // 鼠标右键绑定
  contextMenu.init();
  // nav上的 option与switch响应
  BUS.nav.addEventListener('click', function (e) {
    // 开启关闭切换
    if ((e.target as HTMLElement).tagName === 'INPUT') {
      const checked = (e.target as HTMLInputElement).checked;
      const id = (e as any).path[2].dataset.id;
      dataAction.checked(id, checked).render();
    }
    // 切换active
    if ((e.target as HTMLElement).tagName === 'LI') {
      const id = (e.target as HTMLElement).dataset.id;
      dataAction.active(id).render();
    }
  });
  // 文本框中刷新按钮
  document.querySelector('.textarea .operation .refresh').addEventListener('click', eventTextareaUpdate);
  // 文本框中更新按钮
  document.querySelector('.textarea .operation .net').addEventListener('click', eventTextareaUpdate);
  // 文本框中保存按钮
  document.querySelector('.textarea .operation .save').addEventListener('click', eventTextareaSave);
}
