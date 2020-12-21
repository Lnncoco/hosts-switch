import { getSystemHosts, requestHosts, backupLocalHosts, getConfigData, saveConfigData, tipSuccess, tipWarning, tipError } from '../util';
import defaultConfig from './defaultConfig';
// 内部组件
import DATA from './DATA';
import render, { renderTextareaContent } from './render';

/**
 * 数据状态统一控制
 * get 函数返回需要的数据信息
 * async 返回Promise数据
 * 除了render init其余为操作项，都返回this
 */

/**
 * 初始化（始终存在默认项本地Hosts）
 */
async function init() {
  backupLocalHosts(); // 有备份文件时会自动跳过备份 文件名system.bak
  const systemHosts = await getSystemHosts();
  defaultConfig[0].hosts = typeof systemHosts !== 'boolean' ? systemHosts : '';
  defaultConfig[1].hosts = typeof systemHosts !== 'boolean' ? systemHosts : '';
  const config = await getConfigData();
  if (typeof config === 'boolean' && config === false) return; // 如果读取错误不再继续进行
  if (!config) saveConfigData(defaultConfig); // 没有main字段时会返回null
  DATA.iniData(config || defaultConfig);
}

export default {
  getData: DATA.getData,

  render,

  init: async function () {
    await init();
    render();
  },

  /**
   * 添加新的项
   * @param {string} name
   */
  add: function (name?: string) {
    DATA.add(name);
    return this;
  },

  /**
   * 删除指定项参数
   * @param {string} id
   */
  remove: function (id: string) {
    DATA.remove(id);
    return this;
  },

  /**
   * 当前项Switch状态切换
   * @param {string} id
   * @param {boolean} status
   */
  checked: function (id: string, status: boolean) {
    DATA.checked(id, status);
    return this;
  },

  /**
   * 当前项状态激活（其他项切换为关闭）
   * @param {string} id
   */
  active: function (id: string) {
    DATA.active(id);
    return this;
  },

  /**
   * 修改指定项参数
   * @param {string} id
   * @param {Object} params
   * @param {function} fn 回调函数
   */
  modify: function (id: string, params: { name?: string; url?: string; lock?: boolean }, fn?: () => any) {
    DATA.modify(id, params);
    fn?.();
    return this;
  },

  /**
   * 更新使用中Hosts数据(合并switch项为true的数据)
   * @param {function} fn
   */
  updateUseHosts: DATA.updateUseHosts,

  /**
   * 获取指定项的所有信息
   * @param {string} id
   */
  getItemInfo: DATA.getItemInfo,

  /**
   * 获取当前激活项的所有信息(如果没激活项则返回第一项)
   */
  getActionItemInfo: DATA.getActionItemInfo,

  /**
   * 获取指定项的Hosts信息
   * @param {string} id
   */
  getItemHosts: DATA.getItemHosts,

  /**
   * 更新指定id远程Hosts信息
   * @param {string} id
   */
  asyncUpdateHosts: async function (id: string) {
    const curData = DATA.getItemInfo(id);
    if (curData.home) {
      // 外部修改存到当前数据
      const res = await getSystemHosts();
      if (typeof res !== 'boolean') {
        if (curData.hosts !== res) {
          curData.hosts = res;
          render();
          tipSuccess(`请手动保存外部修改，切换后数据将丢失`);
        } else tipSuccess(`${curData.name} 刷新成功`);
      } else tipError(`${curData.name} 刷新失败`);
      return;
    } else if (curData.url) {
      const res = await requestHosts(curData.url);
      if (res.code) {
        tipError(`"${curData.name}" 更新错误: ${res.message}`);
        curData.status = false; // 获取失败设置false
      } else {
        curData.hosts = res.html;
        curData.status = true;
        DATA.updateUseHosts();
        tipSuccess(`"${curData.name}" 更新成功`);
        if (curData.active) renderTextareaContent(curData.id.toString());
      }
    }
  },

  /**
   * 更新所有远程Hosts信息
   */
  asyncUpdateAllHosts: async function () {
    DATA.modifyEvery(
      (item) => !!item.url, // 更新的条件
      async (curData, index) => {
        const res = await requestHosts(curData.url);
        if (res.code) {
          setTimeout((e) => {
            tipError(`"${curData.name}"更新错误: ${res.message}`);
          }, index * 360);
          curData.status = false; // 获取失败设置false
        } else {
          curData.hosts = res.html;
          curData.status = true;
          tipSuccess(`"${curData.name}"更新成功`);
          if (curData.active) renderTextareaContent(curData.id.toString());
        }
      },
      DATA.updateUseHosts // 完成后需执行 更新Hosts函数
    );
  },

  /**
   * 比较指定id hosts数据与传入数据是否有差异
   * @param {string} id
   * @param {string} diffText
   */
  inconformity: function (id: string, diffText: string) {
    const curData = DATA.getItemInfo(id);
    if (curData.home) return false;
    return !(curData.hosts === diffText);
  },
};
