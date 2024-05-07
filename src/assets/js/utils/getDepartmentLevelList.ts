import { IDepartment, IDepartmentLevelItem } from '@/views/companyManage/DepartmentManage/js/types';
import { IJobPost } from '@/views/companyManage/JobPostManage/js/types';
import { IStaff } from '@/views/companyManage/StaffManage/js/types';

/** 获取部门树形结构列表数据 */
export const getDepartmentLevelList = (list: IDepartment[]) => {
  const level1List = list.filter(item => item.Level === 1).map(i => ({ ...i, children: [] }));
  level1List.unshift({
    ID: -666, Name: '无', children: [], Level: 1, ParentID: -1,
  });

  const _list = level1List.map(level1 => {
    const _level1: IDepartmentLevelItem = { ...level1, children: [] };
    const _level2list = list.filter(item => item.Level === 2 && item.ParentID === level1.ID)
      .map(item => ({ ...item, children: [] }));
    _level2list.unshift({
      ID: -666, Name: '无', children: [], Level: 2, ParentID: level1.ID,
    });
    _level1.children = _level2list;
    _level1.children.forEach(level2 => {
      const _level3list = list.filter(item => item.Level === 3 && item.ParentID === level2.ID);
      _level3list.unshift({
        ID: -666, Name: '无', Level: 3, ParentID: level2.ID,
      });
      // eslint-disable-next-line no-param-reassign
      level2.children = _level3list;
    });
    return _level1;
  });

  return _list;
};

/** 获取员工所属岗位列表数据 */
export const getDepartmentDisplayList = ({ PositionList }: Pick<IStaff, 'PositionList'>, departmentLvList: IDepartmentLevelItem[], jobPostList: IJobPost[]) => {
  if (Array.isArray(PositionList) && PositionList.length > 0) {
    const list = PositionList.map(({ First, Second }) => {
      const { FirstDepartmentID, SecondDepartmentID, ThirdDepartmentID } = First;
      const { PositionID } = Second;
      const t = jobPostList.find(it => it.PositionID === PositionID);
      const PositionName = t && t.PositionName ? t.PositionName : '';
      let str = '';
      const _getDepartmentName = (id: number, _list: IDepartmentLevelItem[]) => {
        if ((!id && id !== 0) || id === -666 || !Array.isArray(_list)) return undefined;
        const t = _list.find(it => it.ID === id);
        return t && { Name: t.Name, arr: t.children };
      };
      const f = _getDepartmentName(FirstDepartmentID, departmentLvList);
      if (f) {
        str += f.Name;
        const s = _getDepartmentName(SecondDepartmentID, f.arr || []);
        if (s) {
          str += `-${s.Name}`;
          const third = _getDepartmentName(ThirdDepartmentID, s.arr || []);
          if (third) {
            str += `-${third.Name}`;
          }
        }
      }
      return [str, PositionName].filter(it => it).join(' ');
    });
    return list.filter(it => it);
  }
  return [];
};
