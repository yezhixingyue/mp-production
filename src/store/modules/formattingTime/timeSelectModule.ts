import { ConvertTimeFormat, getSecondTime } from '@/assets/js/utils/ConvertTimeFormat';
import { defineStore, DefineStoreOptions } from 'pinia';

interface DateType {
  First: string,
  Second:string,
}
interface IState {
  selectedTimeArr: number[],
  newDate:Date,
}
interface IActions {
  updateNewDate:()=>void,
}
type IGetters = {
  AlltimeDate: ()=> DateType
  TodayDate: ()=> DateType
  YesterdayDate: ()=> DateType
  BeforeYesterdayTimeDate: ()=> DateType
  curWeekDate: ()=> DateType
  lastWeekDate: ()=> DateType
  curMonthDate: ()=> DateType
  lastMonthDate: ()=> DateType
};
/**
 * 该模块主要用于时间选择模块,为公共模块,方便在需要使用时调用
 */

const options: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'timeSelectModule',
  state: () => ({
    /* 时间选择相关
    -------------------------------*/
    selectedTimeArr: [],
    newDate: new Date(),
  }),
  getters: {
    /* 时间选择相关
    -------------------------------*/
    AlltimeDate() {
      return {
        First: '',
        Second: '',
      };
    },
    TodayDate() {
      console.log(this.newDate);

      const stringDate = ConvertTimeFormat(new Date(this.newDate));
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    YesterdayDate() {
      const stringDate = ConvertTimeFormat(
        new Date(new Date(this.newDate).getTime() - 1000 * 60 * 60 * 24),
      );
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    BeforeYesterdayTimeDate() {
      const stringDate = ConvertTimeFormat(
        new Date(new Date(this.newDate).getTime() - 1000 * 60 * 60 * 24 * 2),
      );
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    curWeekDate() {
      const day = new Date().getDay();
      const num = day - 1 >= 0 ? day - 1 : 6;
      const stringDate1 = ConvertTimeFormat(
        new Date(new Date(this.newDate).getTime() - 24 * 60 * 60 * 1000 * num),
      );
      const stringDate2 = ConvertTimeFormat(
        new Date(new Date(stringDate1).getTime() + 6 * 24 * 60 * 60 * 1000),
      );
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
      };
    },
    lastWeekDate() {
      const day = new Date().getDay();
      const num = day - 1 >= 0 ? day - 1 : 6;
      const stringDate1 = ConvertTimeFormat(
        new Date(new Date(this.newDate).getTime() - 24 * 60 * 60 * 1000 * (num + 7)),
      );
      const stringDate2 = ConvertTimeFormat(
        new Date(new Date(this.newDate).getTime() - 24 * 60 * 60 * 1000 * (num + 1)),
      );
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
      };
    },
    curMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(new Date(this.newDate).setDate(1)));
      const m = new Date(this.newDate).getMonth();
      const t = new Date(new Date(new Date(new Date().setDate(1)).setMonth(m + 1)).setDate(0));
      const stringDate2 = ConvertTimeFormat(new Date(t));
      // const stringDate2 = ConvertTimeFormat(new Date(state.newDate));
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
      };
    },
    lastMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(
        new Date(
          new Date(this.newDate).setDate(1),
        ).setMonth(new Date(this.newDate).getMonth() - 1),
      ));
      const stringDate2 = ConvertTimeFormat(new Date(new Date(this.newDate).setDate(0)));
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
      };
    },
    last7Date() {
      const BeginDate = ConvertTimeFormat(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 6));
      const TodayDate = ConvertTimeFormat(new Date());
      return {
        First: `${BeginDate}T00:00:00.000Z`,
        Second: `${TodayDate}T23:59:59.997Z`,
      };
    },
    /* 财务时间选择相关
    -------------------------------*/
    financeAlltimeDate() {
      return {
        First: '',
        Second: '',
      };
    },
    financeTodayDate() {
      const stringDate = ConvertTimeFormat(new Date(this.newDate));
      const secondDate = getSecondTime(new Date(this.newDate));
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeYesterdayDate() {
      const date = new Date(new Date(this.newDate).getTime() - 1000 * 60 * 60 * 24);
      const stringDate = ConvertTimeFormat(date);
      const secondDate = getSecondTime(date);
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeDayBeforeYesterdayTimeDate() {
      const date = new Date(new Date(this.newDate).getTime() - 1000 * 60 * 60 * 24 * 2);
      const stringDate = ConvertTimeFormat(date);
      const secondDate = getSecondTime(date);
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeCurMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(new Date(this.newDate).setDate(1)));
      const m = new Date(this.newDate).getMonth();
      const t = new Date(new Date(new Date(new Date().setDate(1)).setMonth(m + 1)).setDate(0));
      const secondDate = getSecondTime(t);
      return {
        First: `${stringDate1}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeLastMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(
        new Date(new Date(this.newDate)
          .setDate(1)).setMonth(new Date(this.newDate).getMonth() - 1),
      ));
      const secondDate = getSecondTime(new Date(new Date(this.newDate).setDate(0)));
      return {
        First: `${stringDate1}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
  },
  // mutations: {
  /* 时间选择相关
    -------------------------------*/
  // setSelectTime(state, [type, num, obj]) {
  //   if (type !== 'timeSelect') {
  //     const timeObj = this.getters[`timeSelectModule/${type}`];
  //     state.objForOrderList.PlaceDate = timeObj;
  //   } else {
  //     state.objForOrderList.PlaceDate = obj;
  //   }
  //   state.selectedTimeArr = [0, 0, 0, 0, 0, 0];
  //   state.selectedTimeArr[num] = 1;
  // //  console.log(state.objForOrderList);
  // },
  /* 更新时间
    -------------------------------*/
  // },
  actions: {
    updateNewDate() {
      this.newDate = new Date();
    },
  },
};
export const useTimeSelectModuleStore = defineStore(options);
