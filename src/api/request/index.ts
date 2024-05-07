import { instance } from './instance';

export { instance };
export const request = instance.request.bind(instance);
