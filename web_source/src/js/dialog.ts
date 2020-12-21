import BUS from './bus';
import dataAction from './dataAction';
import { tipSuccess } from './util';

/* dialog相关 */
export function openDialog() {
  BUS.dialog.style.display = 'block';
  BUS.shade.style.display = 'block';
}

export function closeDialog() {
  BUS.dialog.style.display = 'none';
  BUS.shade.style.display = 'none';
  clearDialog();
}

export function setDialog(text: string, url?: string) {
  (BUS.inputName as HTMLInputElement).value = text ?? '';
  (BUS.inputUrl as HTMLInputElement).value = url ?? '';
}
export function clearDialog() {
  BUS.inputName.removeAttribute('data-id');
  (BUS.inputName as HTMLInputElement).value = '';
  (BUS.inputUrl as HTMLInputElement).value = '';
}

export function dialogApply() {
  if (BUS.mouseTargetId) {
    const name = (BUS.inputName as HTMLInputElement).value;
    const url = (BUS.inputUrl as HTMLInputElement).value;
    dataAction.modify(BUS.mouseTargetId, { name, url }).render();
    BUS.mouseTargetId = null;
    tipSuccess('操作成功');
    closeDialog();
  }
}
