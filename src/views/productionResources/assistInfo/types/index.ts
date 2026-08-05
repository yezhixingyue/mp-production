import { AssistInfoTypeEnum } from './enum';

export interface IAssistListItem {
  ID: string;
  Name: string;
  Type: AssistInfoTypeEnum;
  Positions: { ID: number; Name: string }[]
  ReportWorkings: { ID: number; Name: string }[]
  MapWorkings: { ID: number; Name: string }[]
}

interface INoteInfo {
  ID: string
  Name: string
  Type: AssistInfoTypeEnum
}

export interface INoteDisplayPosition {
  ID: number
  Key: string;
  Name: string;
  Types: AssistInfoTypeEnum[]
  Notes: INoteInfo[]
}

export interface IResourceNoteGroup {
  Type: AssistInfoTypeEnum
  Notes: Pick<INoteInfo, 'ID' | 'Name'>[]
}
