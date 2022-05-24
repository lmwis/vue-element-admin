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

        <el-button style="margin-left: 10px;" type="success" @click.native.prevent="loadLocationData()">
          查询
        </el-button>
      </sticky>
    </div>
    <div id="container" />
  </div>

</template>

<script>
import AMap from 'AMap'
import Sticky from '@/components/Sticky'
import { queryLocationData } from '@/api/locationData'

export default {
  name: 'Guide',
  components: { Sticky },
  data() {
    return {
      map: null,
      searchMode: '',
      startTime: 1,
      endTime: 1,
      infoWindow: null,
      circleList: [],
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
  mounted() {
    this.initMap()
    this.endTime = new Date().getTime()
    this.startTime = this.endTime - 1000 * 60 * 60
    this.loadLocationData()
    // this.loadLocationData({longitude: 108.33497478898832, latitude: 32.95589845021575})
  },
  methods: {
    initMap() {
      this.map = new AMap.Map('container', {
        // viewMode: '3D', // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        resizeEnable: true,
        center: [108.33497478898832, 32.95589845021575] // 初始化地图中心点位置
      })
    },
    loadLocationData() {
      const startTime = new Date(this.startTime).getTime()
      const endTime = new Date(this.endTime).getTime()
      queryLocationData({ startTime: startTime, endTime: endTime })
        .then((response) => {
          console.log('获取数据成功', response)
          // 清除现有标记
          this.clearCircleMap()
          for (const dataKey in response.data.list) {
            const curData = response.data.list[dataKey]
            this.markCircleMap(curData)
          }
        })
        .catch(() => {
        })
    },
    clearCircleMap() {
      this.map.clearMap()
    },
    markCircleMap(data) {
      const circle = new AMap.Circle({
        center: [data.longitude, data.latitude],
        radius: 10 + Math.random() * 10, // 3D视图下，CircleMarker半径不要超过64px
        strokeColor: 'white',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: 'rgba(0,0,255,1)',
        fillOpacity: 0.5,
        zIndex: 10,
        bubble: true,
        cursor: 'pointer',
        clickable: true
      })
      this.map.add(circle)
      this.map.setFitView()
      const thatMap = this.map
      const that = this
      circle.on('mouseover', function() {
        console.log('当前:', data)
        const info = []
        info.push(that.convertTimeStamp(data.timeStamp))
        info.push(data.longitude)
        info.push(data.latitude)
        that.infoWindow = new AMap.InfoWindow({
          content: info.join('<br/>') // 使用默认信息窗体框样式，显示信息内容
        })
        that.infoWindow.open(thatMap, [data.longitude, data.latitude])
      })
      circle.on('mouseout', function() {
        that.infoWindow.close()
      })
      this.circleList.push(circle)
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
<style>
#container{
  padding:0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
.time-container {
  display: inline-block;
}

</style>
