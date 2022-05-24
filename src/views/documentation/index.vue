<template>
  <div>
    <div>
      <sticky :z-index="10" class-name="sub-navbar">

        <el-select v-model="searchMode" clearable placeholder="查询范围">
          <el-option
            v-for="item in platformsOptions"
            :key="item.key"
            :label="item.name"
            :value="item.key"
            @click.native.prevent="selectQueryDate()"
          />
        </el-select>

        <div class="time-container">
          <el-date-picker v-model="startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Release time" />
        </div>
        <div class="time-container">
          <el-date-picker v-model="endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Release time" />
        </div>

        <el-button style="margin-left: 10px;" type="success" @click.native.prevent="loadAppUsageEventData()">
          查询
        </el-button>
      </sticky>
    </div>
    <div class="app-container documentation-container">

      <div class="radio">
        排序：
        <el-radio-group v-model="reverse">
          <el-radio :label="true">倒序</el-radio>
          <el-radio :label="false">正序</el-radio>
        </el-radio-group>
      </div>
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
          placement="top"
        >
          <el-card>
            <h4>{{ activity.content }}</h4>
            <el-image
              style="width: 100px; height: 100px"
              :src="activity.pictureUrl"
            />
          </el-card>
        </el-timeline-item>
      </el-timeline>

    </div>
  </div>
</template>

<script>
import { queryAppUsageEventData } from '@/api/appData'
import Sticky from '@/components/Sticky'

export default {
  name: 'Documentation',
  components: { Sticky },
  data() {
    return {
      searchMode: '',
      startTime: 1,
      endTime: 1,
      reverse: false,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15',
        size: 'large'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13',
        size: 'large'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11',
        size: 'large'
      }],
      url: '',
      platforms: ['a-platform'],
      platformsOptions: [
        { key: '1', name: '最近一小时' },
        { key: '2', name: '当天' }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  onload() {

  },
  mounted() {
    this.endTime = new Date().getTime()
    this.startTime = this.endTime - 1000 * 60 * 60
    this.loadAppUsageEventData()
  },
  methods: {
    loadAppUsageEventData() {
      const startTime = new Date(this.startTime).getTime()
      const endTime = new Date(this.endTime).getTime()
      queryAppUsageEventData({ mode: this.searchMode, startTime: startTime, endTime: endTime })
        .then((response) => {
          console.log('获取数据成功', response)
          const temp = []
          for (const dataKey in response.data.list) {
            const curData = response.data.list[dataKey]
            const dateStr = this.convertTimeStamp(curData.startTime)
            temp.push({
              content: curData.appInfo.name + ' - ' + this.convertStringTime(curData.continueTime),
              timestamp: dateStr,
              size: 'large',
              type: 'primary',
              pictureUrl: curData.appInfo.pictureUrl
            })
          }
          this.activities = temp
        })
        .catch(() => {
        })
    },
    convertTimeStamp(timeStamp) {
      const date = new Date(timeStamp)
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    convertStringTime(value) {
      let theTime = parseInt(value / 1000)// 秒
      let theTime1 = 0// 分
      let theTime2 = 0// 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      let result = '' + parseInt(theTime) + '秒'

      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      return result
    },
    selectQueryDate() {
      if (this.searchMode === '1') {
        this.endTime = new Date().getTime()
        this.startTime = this.endTime - 1000 * 60 * 60
      } else if (this.searchMode === '2') {
        this.endTime = new Date().getTime()
        this.startTime = new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 10px;
}

.time-container {
  display: inline-block;
}
</style>
