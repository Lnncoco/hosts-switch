declare namespace DATA {
  export interface item {
    home?: boolean; // 本地使用Hosts项标识
    id: number; // 项唯一id
    name: string; // 项名称
    active: boolean; // 是否激活显示
    checked: boolean; // 是否开启
    lock: boolean; // 是否只读 默认false
    url: string; // url
    status: boolean; // 当网络获取报错时，此项为false
    hosts: string; // HOSTS文本内容
  }
  export type list = item[];
}
