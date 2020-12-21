/// <reference types="aardio" />

declare namespace aardio {
  interface IProxy {
    ua?: string;
    host: string;
    user?: string;
    password?: string;
  }

  interface External {
    /** 获取系统HOSTS文本 */
    getSystemHosts(): Promise<string>;
    /** 保存到系统HOSTS文本 */
    saveSystemHosts(content: string): Promise<string>;
    /** 清理DNS缓存 */
    clearDnsCache(): Promise<boolean>;
    /** 发送请求获取网络HOSTS */
    requestHosts(url: string, proxy?: IProxy): Promise<{ code: string; message: string; html?: string }>;
    /** 备份系统文件 */
    backupLocalHosts(coverage?: boolean): Promise<boolean>;
    /** 读取全部数据 */
    getConfigData(): Promise<any>;
    /** 保存全部数据 */
    saveConfigData(data: Object): Promise<string>;
  }
}
