import {
  IExceptionChunk, IExceptionPlate, IExceptionUnionLine, IExceptionWorking,
} from '../../js/type';
import { IRevocationChunk } from './type';

export interface IExceptionWorking4RuleForm extends IExceptionWorking {
  checked: boolean
  _ReceiveMaterial: boolean
  _PlateMaking?: boolean
}

interface IExceptionChunk4RuleForm extends IExceptionChunk {
  WorkingList: IExceptionWorking4RuleForm[]
}

export interface IRevocationChunk4RuleForm extends IRevocationChunk {
  checked: boolean
}

export interface IExceptionUnionLine4RuleForm extends IExceptionUnionLine {
  WorkingList: IExceptionWorking4RuleForm[]
}

export interface IExceptionPlate4Form extends Omit<IExceptionPlate, 'Reproduce' | 'ChildList'> {
  Reproduce: {
    /** 重新生产 */
    _remark: boolean
    /** 重新领料 */
    ReceiveMaterial: boolean
    /** 重新制版 */
    Platemaking: boolean
    /** 是否可以重新制版 */
    _PlatemakingDisabled: boolean
  } | null
  WorkingList: IExceptionWorking4RuleForm[]
  ChunkList: IExceptionChunk4RuleForm[]
  ChildList: null | IExceptionPlate4Form[]
  parentPlate?: IExceptionPlate4Form
}

export interface IRedoInfo4RuleForm {
  /** 重做 - 组合工序列表 */
  UnionLine: IExceptionUnionLine4RuleForm | null
  /** 重做大版列表 */
  PlateList: IExceptionPlate4Form[]
}
