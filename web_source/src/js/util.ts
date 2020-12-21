import LightTip from 'lu2/theme/pure/js/common/ui/LightTip';
import * as aardio from 'aardio';

/* 工具函数 */

/**
 * 成功tip
 * @param {string} text
 * @param {number} duration 毫秒
 */
export function tipSuccess(text: string, duration?: number) {
  new LightTip(text ?? '操作成功', {
    type: 'success',
    duration: duration ?? 3000,
  });
}

/**
 * 异常tip
 * @param {string} text
 */
export function tipWarning(text: string) {
  new LightTip(text ?? '操作异常', { type: 'warning', duration: 3000 });
}

/**
 * 失败tip
 * @param {string} text
 * @param {number} duration 毫秒
 */
export function tipError(text: string, duration?: number) {
  new LightTip(text ?? '操作失败', {
    type: 'error',
    duration: duration ?? 3000,
  });
}

/* aardio相关操作 */

/**
 * 获取本地Hosts
 */
export function getSystemHosts() {
  return aardio.getSystemHosts().catch((e) => {
    tipError(e);
    return false;
  });
}

/**
 * 保存到本地Hosts
 * @param {string} content
 */
export function saveSystemHosts(content: string) {
  return aardio
    .saveSystemHosts(content)
    .then((res) => {
      if (!res) tipError('写入失败，请用管理员权限启动再重试');
      return res;
    })
    .catch((e) => tipError(e));
}

/**
 * 发送请求获取网络Hosts
 * @param {string} url
 * @param {aardio.IProxy} proxy
 */
export function requestHosts(url: string, proxy?: aardio.IProxy) {
  return aardio.requestHosts(url, proxy).catch((e) => ({ code: 9, message: '程序调用错误', html: '' }));
}

/**
 * 刷新DNS缓存
 */
export function refreshDnsCache() {
  aardio
    .clearDnsCache()
    .then((res) => {
      console.log('ers', res);
    })
    .catch((e) => tipError('程序调用错误'));
  tipSuccess('刷新完成');
  return;
}

/**
 * 备份系统文件
 * @param {boolean} coverage
 */
export function backupLocalHosts(coverage?: boolean) {
  return aardio.backupLocalHosts(coverage).catch((e) => ({ code: 9, message: e }));
}

/**
 * 读取全部数据
 */
export function getConfigData() {
  return aardio
    .getConfigData()
    .then((res) => {
      if (res.main) return res.main;
      else return null;
    })
    .catch((e) => {
      tipError('读取数据失败');
      return false;
    });
}

/**
 * 保存全部数据
 */
export function saveConfigData(data: Object) {
  return aardio.saveConfigData(data).catch((e) => {
    tipError('保存数据失败');
    return false;
  });
}
