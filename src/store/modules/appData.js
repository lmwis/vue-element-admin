import { queryAppUsageEventData } from '@/api/appData'

const state = {
  list: [],
  count: 0,
  startTime: 0,
  endTime: 0
}

const mutations = {
  SET_ALL: (state, data) => {
    state.list = data.list
    state.count = data.count
    state.startTime = data.startTime
    state.endTime = data.endTime
  }
}

const actions = {
  // get user info
  queryAppUsageEventData({ commit }, queryParam) {
    return new Promise((resolve, reject) => {
      queryAppUsageEventData(queryParam).then(response => {
        console.log('queryAppUsageEventData::' + JSON.stringify(response))
        if (response.status === 'success') {
          commit('SET_ALL', response.data)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
