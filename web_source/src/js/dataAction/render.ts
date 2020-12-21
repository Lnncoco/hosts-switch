import DATA from './DATA';
import BUS from '../bus';
import CodeMirror from '../CodeMirror';
import template from '~/lib/template';
import { modifyTextareaLockState, modifyTextareaType, modifyTextareaAttrId } from '../textarea';

function inferType(item) {
  let curType = 'local';
  if (item.home) curType = 'home';
  if (item.url) curType = 'net';
  return curType;
}

/**
 * 渲染数据
 */
export function render() {
  if (process.env.NODE_ENV !== 'production') console.log('render data', DATA.getData());

  const activeData = DATA.getActionItemInfo();
  // 判断当前项种类
  modifyTextareaType(inferType(activeData));
  modifyTextareaLockState(activeData.lock);
  modifyTextareaAttrId(activeData.id.toString());

  const html = template('template_nav', DATA.getData());
  BUS.nav.innerHTML = html; // 将渲染好的html插入到nav中
  // 设置nav高度 过长时能显示滚动条
  BUS.nav.style.height = `${document.body.clientHeight - 5}px`;

  renderTextareaContent(activeData.id.toString());
  return true;
}

/**
 * 修改文本框内容
 * @param {string} id
 */
export async function renderTextareaContent(id: string) {
  const itemData = DATA.getItemInfo(id);
  CodeMirror.setValue(itemData.hosts, itemData.lock);
}

export default render;
