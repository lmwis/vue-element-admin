import request from '@/utils/request'

export function queryLocationData(queryParam) {
  return request({
    url: '/location',
    method: 'get',
    // params: queryParam
    params: {
      startTime: queryParam.startTime,
      endTime: queryParam.endTime
    }
  })
}

