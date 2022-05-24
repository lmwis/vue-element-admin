import request from '@/utils/request'

export function queryAppUsageEventData(queryParam) {
  console.log('queryParam', JSON.stringify(queryParam))
  return request({
    url: '/app/event',
    method: 'get',
    // params: queryParam
    params: {
      mode: queryParam.mode,
      startTime: queryParam.startTime,
      endTime: queryParam.endTime
    }
  })
}

