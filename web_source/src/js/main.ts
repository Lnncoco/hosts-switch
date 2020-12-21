import 'normalize.css';
import 'lu2/theme/pure/css/common/ui';
import '~/styles/index.less';
import init from './init';

if (process.env.NODE_ENV !== 'production') {
  console.log('▄▄▌   ▐ ▄  ▐ ▄  ▄▄·        ▄▄·       ');
  console.log('██•  •█▌▐█•█▌▐█▐█ ▌▪▪     ▐█ ▌▪▪     ');
  console.log('██▪  ▐█▐▐▌▐█▐▐▌██ ▄▄ ▄█▀▄ ██ ▄▄ ▄█▀▄ ');
  console.log('▐█▌▐▌██▐█▌██▐█▌▐███▌▐█▌.▐▌▐███▌▐█▌.▐▌');
  console.log('.▀▀▀ ▀▀ █▪▀▀ █▪·▀▀▀  ▀█▄▀▪·▀▀▀  ▀█▄▀▪  ', '调试模式', process.env.NODE_ENV);
}

window.onload = init;
