export interface IGetParams {
  token?: string
}
export interface IGetRes {
  area: string
  areaCode: string
  areaid: string
  dayList: any[]
}
export interface IMessageHistoryRes {
  code: number
  data: any[]
  msg: string
}


export interface IMockLoginRes {
  name: string
}
