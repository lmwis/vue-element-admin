import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/userInfo/login',
    method: 'post',
    data: {
      username: data.username,
      token: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
