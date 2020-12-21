/// <reference path="./dataAction/DATA.d.ts" />

import BUS from './bus';
import template from '~/lib/template';
import dataAction from './dataAction';
import CodeMirror from './CodeMirror';
import { modifyTextareaLockState } from './textarea';
import { refreshDnsCache } from './util';
import { openDialog, setDialog, closeDialog, dialogApply } from './dialog';
import iconModify from '~/asset/edit.svg';
import iconRefresh from '~/asset/refresh.svg';
import iconDownload from '~/asset/download.svg';
import iconRemove from '~/asset/subtraction.svg';
import iconAddition from '~/asset/addition.svg';
import iconLock from '~/asset/lock.svg';
import iconUnlock from '~/asset/unlock.svg';

const contextMenu = {
  li: function (itemData: DATA.item) {
    const lock = { line: false, text: '锁定此项', icon: iconLock, action: 'lock' };
    const unlock = { line: false, text: '解锁此项', icon: iconUnlock, action: 'unlock' };
    const list = [
      { line: false, text: '修改参数', icon: iconModify, action: 'modify' },
      { line: false, text: '更新数据', icon: iconDownload, action: 'update' },
      { line: true },
      { line: false, text: '添加新项', icon: iconAddition, action: 'add' },
      { line: false, text: '删除此项', icon: iconRemove, action: 'remove' },
    ];

    // 固定插入在第一层次的最后
    let index = 0;
    for (const item of list) {
      if (item.line) {
        if (itemData.lock) list.splice(index, 0, unlock);
        else list.splice(index, 0, lock);
        break;
      }
      index++;
    }

    return list;
  },
  nav: function () {
    return [
      { line: false, text: '添加新项', icon: iconAddition, action: 'add' },
      { line: false, text: '全部更新', icon: iconDownload, action: 'updateAll' },
      { line: false, text: '刷新缓存', icon: iconRefresh, action: 'refresh' },
    ];
  },
};

const actionFn = {
  lock: function () {
    dataAction.modify(BUS.mouseTargetId, { lock: true }, () => {
      const activeData = dataAction.getActionItemInfo();
      if (activeData.id.toString() === BUS.mouseTargetId.toString()) {
        modifyTextareaLockState(true);
        CodeMirror.setReadOnly(true);
      }
    });
  },
  unlock: function () {
    dataAction.modify(BUS.mouseTargetId, { lock: false }, () => {
      const activeData = dataAction.getActionItemInfo();
      if (activeData.id.toString() === BUS.mouseTargetId.toString()) {
        modifyTextareaLockState(false);
        CodeMirror.setReadOnly(false);
      }
    });
  },
  modify: function () {
    const activeData = dataAction.getItemInfo(BUS.mouseTargetId);
    setDialog(activeData.name, activeData.url);
    openDialog();
  },
  add: function () {
    dataAction.add().active('-1').render(); // active到最新项
  },
  remove: function () {
    dataAction.remove(BUS.mouseTargetId).render();
    BUS.mouseTargetId = null; // 清除当前id指向
  },
  update: function () {
    dataAction.asyncUpdateHosts(BUS.mouseTargetId);
  },
  updateAll: function () {
    dataAction.asyncUpdateAllHosts();
  },
  refresh: function () {
    refreshDnsCache();
  },
};

/**
 * 初始化操作
 */
function init() {
  window.oncontextmenu = function (event: MouseEvent) {
    event.preventDefault();
    show(event);
    return false;
  };
  // 单击dialog 取消按钮
  document.querySelector('#dialog_cancel').addEventListener('click', closeDialog, false);
  // 单击dialog 确定按钮
  document.querySelector('#dialog_apply').addEventListener('click', dialogApply, false);

  document.addEventListener('click', close);
  BUS.contextMenu.addEventListener('click', function (e) {
    for (const item of e.path) {
      if (item.tagName === 'LI') {
        const action = item.dataset.action;
        if (actionFn[action]) actionFn[action]();
        break;
      }
    }
  });
}

/**
 * 当前鼠标右键激活项增删指示状态
 * @param {boolean} status
 * @param {HTMLElement} target 要处理的DOM对象
 */
function curMouseItemStatus(status: boolean, target?: HTMLElement) {
  if (status) return target.classList.add('mouse');
  document.querySelector('#nav ul .mouse')?.classList.remove('mouse');
}

/**
 * 判断是否是菜单项
 * @param {MouseEvent} event
 */
function isNavItem(event: MouseEvent) {
  return (event as any).path.some((element) => {
    curMouseItemStatus(false);
    if (element.tagName === 'LI') {
      // 处理类名判断是否是菜单项
      const className = element.className;
      if (className && className.split(' ').includes('nav-item')) {
        curMouseItemStatus(true, element); // 当前右键激活项添加类名
        BUS.mouseTargetId = element.dataset.id; // 存储当前节点的id
        const itemData = dataAction.getItemInfo(BUS.mouseTargetId); // 获取当前项的数据
        BUS.contextMenu.innerHTML = template('template_contextMenu', { target: itemData.name, list: contextMenu.li(itemData), isLocal: !itemData.url, isHome: itemData.home }); // 渲染li右键菜单
        return true;
      }
    } else if (element.tagName === 'NAV') {
      BUS.contextMenu.innerHTML = template('template_contextMenu', { list: contextMenu.nav() }); // 渲染nav右键菜单
      return true;
    }
    return false;
  });
}

/**
 * 显示右键菜单
 * @param {MouseEvent} event
 */
function show(event: MouseEvent) {
  if (!isNavItem(event)) return;
  // 获取当前鼠标位置
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  // 判断边界值，防止菜单栏溢出可视窗口
  const winHeight = document.documentElement.clientHeight ?? document.body.clientHeight;
  if (mouseY > winHeight - BUS.contextMenu.offsetHeight) mouseY = winHeight - BUS.contextMenu.offsetHeight - 10;
  else mouseY = mouseY;

  BUS.contextMenu.style.left = `${mouseX}px`;
  BUS.contextMenu.style.top = `${mouseY}px`;
}

/**
 * 关闭右键菜单
 */
function close() {
  // 使用 display: none 会导致offsetHeight获取高度为0的情况
  BUS.contextMenu.style.left = '-99999px';
  BUS.contextMenu.style.top = '-99999px';
  BUS.mouseTarget = null;
  curMouseItemStatus(false);
}

export default { init, show, close };
