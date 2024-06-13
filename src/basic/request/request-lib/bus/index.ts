import { RequestCore } from '../core';
import { getRequestor } from '../imp/axios';
import { ICoreOptions } from '../core/types';

export const create = (options: ICoreOptions) => new RequestCore(getRequestor(), options);
