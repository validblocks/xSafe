/* eslint-disable @typescript-eslint/no-unused-vars */
export class ConfirmModalPayload {
  showPromiseResolution = (result: boolean): any => null;

  show(title: string, confirmButtonTitle: string): Promise<boolean> {
    this.handleModalShow(title, confirmButtonTitle);

    return new Promise((resolve) => {
      this.showPromiseResolution = resolve;
    });
  }

  handleModalShow = (title: string, confirmButtonTitle: string): any => null;

  handleModalClose() {
    this.showPromiseResolution(false);
  }

  handleModalConfirm() {
    this.showPromiseResolution(true);
  }
}

const confirmModal = new ConfirmModalPayload();

export function useConfirmModal() {
  return confirmModal;
}
