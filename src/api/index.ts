import request from '/@/service'
import { useRequest } from '/@/hooks'
import type { IGetParams, IMessageHistoryRes } from './types'
import { IUserInfo } from '/@/store/modules/types'
// export const getAddrs = (data: IGetParams) => {
//   return request<IGetParams, IGetRes>({
//     url: '/api/common/postcode/getAddrs',
//     method: 'GET',
//     data,
//   })
// }
// export const useGetAddr = (data: IGetParams) => {
//   return useRequest<IGetParams>(getAddrs, data)
// }
export const getMessage = (data: {
  lastId: string,
  token: string,
}) => {
  return request<{
    lastId: string,
    token: string,
  }, any>({
    url: '/index/im/history',
    method: 'POST',
    data,
  })
}
export const getUserInfo = (data: {
  token: string,
}) => {
  return request<{
    token: string,
  }, IUserInfo>({
    url: '/index/im/userinfo',
    method: 'POST',
    data,
  })
}
export const sendMsg = (data: {
  token: string,
  msg: string,
}) => {
  return request<{
    token: string,
    msg: string,
  }, any>({
    url: '/index/im/msg',
    method: 'POST',
    data,
  })
}
export const getMoney = (data: {
  uuid: string,
}) => {
  return request<{
    uuid: string,
  }, {
    money: string,
    periods: string
  }>({
    url: '/index/index/getmoney',
    method: 'POST',
    data,
  })
}

export const bindUserToken = (data: {
  uid: string | number,
  client_id: string,
}) => {
  return request<{
    uid: string | number,
    client_id: string,
  }, any>({
    url: '/index/im/bind',
    method: 'POST',
    data,
  })
}
export const sendMessage = (data: {
  token: string,
  msg: string,
}) => {
  return request<{
    token: string,
    msg: string,
  }, any>({
    url: '/index/im/send',
    method: 'POST',
    data,
  })
}