export default [
  {
    home: true, // 本地使用Hosts项标识
    id: 0,
    name: 'System Hosts',
    active: true,
    checked: true,
    lock: true, // 只能自定义新项修改 保存后自动混合入系统Hosts
    url: '',
    status: true,
    hosts: '',
  },
  {
    id: 1,
    name: 'Local Hosts',
    active: false,
    checked: true,
    lock: false,
    url: '',
    status: true,
    hosts: '',
  },
  {
    id: 2,
    name: 'Github Hosts',
    active: false,
    checked: false,
    lock: false,
    url: 'https://gitee.com/xueweihan/codes/6g793pm2k1hacwfbyesl464/raw?blob_name=GitHub520.yml',
    status: true,
    hosts: '',
  },
  {
    id: 3,
    name: 'Google Hosts',
    active: false,
    checked: false,
    lock: false,
    url: 'https://raw.githubusercontent.com/googlehosts/hosts/master/hosts-files/hosts',
    status: true,
    hosts: '',
  },
];
