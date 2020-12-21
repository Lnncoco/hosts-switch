/// <reference path="DATA.d.ts" />
import CodeMirror from '../CodeMirror';
import { saveSystemHosts, saveConfigData } from '../util';

// 存放host渲染数据
let DATA: DATA.list = [];

/**
 * 获取DATA数据
 */
export function iniData(data: DATA.list) {
  DATA = JSON.parse(JSON.stringify(data));
  return true;
}

/**
 * 获取DATA数据
 */
export function getData() {
  return DATA;
}

/**
 * 获取当前激活项的所有信息
 */
export function getActionItemInfo() {
  for (const item of DATA) {
    if (item.active) return item;
  }
  DATA[0].active = true; // 如果没有激活项就默认激活第一个
  return DATA[0];
}

/**
 * 获取指定项的所有信息
 * @param {string} id
 */
export function getItemInfo(id: string) {
  for (const item of DATA) {
    if (item.id.toString() === id.toString()) return item;
  }
}

/**
 * 获取指定项的Hosts信息
 * @param {string} id
 */
export function getItemHosts(id: string) {
  for (const item of DATA) {
    if (item.id.toString() === id.toString()) return item.hosts;
  }
}

/**
 * 获取本地使用项(home项)
 */
export function getUseItemInfo() {
  const use = DATA[0];
  if (use.home) return use;
  for (const item of DATA) {
    if (item.home) return item;
  }
  return false;
}

/**
 * 添加新的项
 * @param {string} name
 * @param {function} fn
 */
export function add(name?: string, fn?: (list: DATA.list) => any) {
  DATA.push({
    id: DATA[DATA.length - 1].id + 1,
    name: name ? name : `新增项${DATA.length + 1}`,
    active: false,
    checked: false,
    lock: false,
    url: '',
    status: true,
    hosts: '',
  });
  fn?.(DATA);
  return true;
}

/**
 * 删除指定项参数
 * @param {string} id
 * @param {function} fn
 */
export function remove(id: string, fn?: (list: DATA.list, home: DATA.item) => any) {
  let curIndex = -1;
  DATA.forEach((item, index) => {
    if (item.id.toString() === id.toString()) {
      curIndex = index;
    }
  });
  if (curIndex >= 0) {
    DATA.splice(curIndex, 1);
    updateUseHosts(fn);
    return true;
  }
  return false;
}

/**
 * 修改指定项参数
 * @param {string} id
 * @param {Object} params
 */
function modify(id: string, params: { name?: string; url?: string; lock?: boolean }) {
  for (const item of DATA) {
    if (item.id.toString() === id.toString()) {
      if (params.name) item.name = params.name;
      if (params.url) item.url = params.url;
      if (typeof params.lock === 'boolean') {
        item.lock = params.lock;
      }
      break;
    }
  }
  return true;
}

/**
 * 修改多项的多项参数
 * @param {function} isFn 判断是否执行的函数
 * @param {function} modifyFn 需要执行的函数
 * @param {function} finalFn 完成后执行的函数
 */
function modifyEvery(isFn: (curItem: DATA.item) => boolean, modifyFn: (item: DATA.item, index: number) => void, finalFn?: () => void) {
  if (isFn) {
    let index = 0;
    for (const item of DATA) {
      if (isFn(item)) modifyFn?.(item, index);
      index++;
    }
    finalFn?.();
    return true;
  }
  return false;
}

/**
 * 当前项状态激活（其他项切换为关闭）
 * @param {string} id
 * @param {function} fn
 */
export function active(id: string, fn?: (list: DATA.list, home: DATA.item) => any) {
  let curItem: false | DATA.item = false;
  let curId = id.toString();
  if (id === '-1') curId = (DATA.length - 1).toString(); // 激活最后一项
  DATA.forEach((item) => {
    if (item.active) item.hosts = CodeMirror.getValue();
    // 只能一个激活
    if (item.id.toString() === curId) {
      item.active = true;
      curItem = item;
    } else item.active = false;
  });
  return updateUseHosts(fn);
}

/**
 * 当前项Switch状态切换
 * @param {string} id
 * @param {boolean} status
 * @param {function} fn
 */
export function checked(id: string, status: boolean, fn?: (list: DATA.list, home: DATA.item) => any) {
  DATA.forEach((item) => {
    // 能够开启多个 多个合并到本地HOSTS
    if (item.id.toString() === id.toString()) item.checked = status;
  });
  return updateUseHosts(fn);
}

/**
 * 更新使用中Hosts数据(合并switch项为true的数据)
 * active checked add remove 调用
 * @param {function} fn
 */
export function updateUseHosts(fn?: (list: DATA.list, home: DATA.item) => any) {
  const use = getUseItemInfo();
  if (!use) return false;
  let hosts = '';
  for (const item of DATA) {
    if (item.checked && item.status && !item.home) {
      if (hosts) hosts += '\r\n\r\n';
      hosts += item.hosts;
    }
  }
  use.hosts = hosts;
  saveSystemHosts(use.hosts); // 应用到系统
  saveConfigData(DATA); // System Hosts项变了 每次更新保存整体数据
  if (fn) return fn(DATA, use);
  return true;
}

export default {
  iniData,
  add,
  remove,
  // 改
  modify,
  modifyEvery,
  active,
  checked,
  updateUseHosts,
  // 查
  getData,
  getItemInfo,
  getActionItemInfo,
  getItemHosts,
  getUseItemInfo,
};
