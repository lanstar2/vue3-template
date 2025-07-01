import {
  IPermissionList,
  IRoleList,
  IUserDetail,
  IUserList,
} from '/@/api/types/mock'
export interface CountInterface {
  count: number
}
export interface IUser {
  userList: IUserList[]
  roleList: IRoleList[]
  permissionList: IPermissionList[]
  userDetail?: IUserDetail
  curId: number
}
export interface IUserInfo {
  avatar: string
  nickname: string
  id: number
  points: string
}
export interface IMessage {
  alarm: boolean
  content: string
  fromId?: number
  createdAt: number
  adminId: number
  id: number
  imgUrl: string
  msgType: number
  name: string
  order_id: string
  fromUser: number
}