import BUS from './bus';
import codeMirror from './CodeMirror';
import dataAction from './dataAction';
import { tipSuccess, tipError } from './util';

/**
 * 增删的类名
 * @param {string} content
 */
export function modifyTextareaAttrId(content: string) {
  return (BUS.textarea.dataset.id = content);
}

/**
 * 增删的类名
 * @param {string} className
 */
export function modifyTextareaClass(type: string, className: string) {
  if (type === 'add') return BUS.textarea.classList.add(className);
  if (type === 'remove') return BUS.textarea.classList.remove(className);
}

/**
 * 修改文本框的锁定非锁定类名
 * @param {boolean} classState
 */
export function modifyTextareaLockState(classState: boolean) {
  if (classState) return modifyTextareaClass('add', 'lock');
  return modifyTextareaClass('remove', 'lock');
}

/**
 * 标注当前激活项的类型 home url local 三种
 * 提供相应按钮和背景
 * @param {string} className
 */
export function modifyTextareaType(className: string) {
  const list = ['local', 'home', 'net'];
  list.forEach((item) => {
    if (item === className) modifyTextareaClass('add', item);
    else modifyTextareaClass('remove', item);
  });
}

/**
 * CodeMirror事件文本内容被修改时浮现保存按钮
 * @param {Object} CodeMirror 文本编辑器对象
 */
export function changeTextareaTip(CodeMirror: any) {
  const id = BUS.textarea.dataset.id;
  const flag = dataAction.inconformity(id, CodeMirror.getValue());
  if (flag) modifyTextareaClass('add', 'save');
  else modifyTextareaClass('remove', 'save');
  return;
}

/**
 * 更新文本框内容
 */
export function eventTextareaUpdate() {
  const id = BUS.textarea.dataset.id;
  dataAction.asyncUpdateHosts(id);
}

/**
 * 保存文本框内容
 */
export function eventTextareaSave() {
  const id = BUS.textarea.dataset.id;
  const curItem = dataAction.getItemInfo(id);
  curItem.hosts = codeMirror.getValue();
  dataAction.updateUseHosts(() => {
    modifyTextareaClass('remove', 'save');
    tipSuccess('保存成功'); // 假提示 实际保存失败会再次提醒
  });
}
