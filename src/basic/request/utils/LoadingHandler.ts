/* eslint-disable max-len */
import { ElLoading } from 'element-plus';
// import 'element-plus/es/components/loading/style/css';

export class LoadingHandler {
  private count = 0

  private loadingInstance: ReturnType<(typeof ElLoading)['service']> | null = null

  display() {
    this.count += 1;
    const spinner = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>';
    this.loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      svgViewBox: '0 0 20 20',
      spinner,
      background: 'rgba(255, 255, 255, 0.3)',
      customClass: 'mp-general-loading-box',
    });
  }

  hidden() {
    this.count -= 1;
    if (this.count < 0) this.count = 0;
    if (this.count === 0 && this.loadingInstance) this.loadingInstance.close();
  }

  hiddenByForce() {
    this.count = 0;
    if (this.loadingInstance) this.loadingInstance.close();
  }
}
