import { nextTick } from 'vue';
import { IOrderFileInfo } from '../../../types/types';
import UploadFilesDialog from '../components/UploadFilesComp/UploadFilesDialog.vue';

export interface IUploadFile {
  file: IOrderFileInfo;
  /** indexes第1项为-1时 指其位于组合生产线上 */
  indexes: [number, number]
}

export class FileUploader {
  visible = false

  fileList: IUploadFile[] = []

  uploadCompRef: InstanceType<typeof UploadFilesDialog> | null = null

  setUpload(fileList: IUploadFile[]) {
    return new Promise((resolve) => {
      if (fileList.length === 0) {
        resolve(true);
        return;
      }

      if (!this.uploadCompRef) {
        resolve(false);
        return;
      }

      const _handler = async () => {
        this.fileList = fileList;
        this.visible = true;

        await nextTick();

        const result = await this.uploadCompRef?.upload();
        resolve(!!result);

        if (result) {
          this.visible = false;
        }
      };

      try {
        _handler();
      } catch (error) {
        console.error(error);
        resolve(false);
      }
    });
  }
}
