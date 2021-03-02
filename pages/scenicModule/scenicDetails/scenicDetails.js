import esRequest from '../../../utils/esRequest';
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';

Page({
  data: {
    id_key: '',
    loginShow: false,
    windowWidth: 0,
    windowHeight: 0,
    scenicId: '',
    scenicDetails: {},
    scenicspotImgs: [],
    markers: [],
    isFollow: '0'
  },

  onLoad: function (options) {
    this.data.id_key = wx.getStorageSync('id_key') ? wx.getStorageSync('id_key').toString() : ''
    this.data.scenicId = options.id ? options.id : ''
  },

  onReady: function () {
    this.setData({
      windowWidth: wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  onShow: function () {
    this.getScenicSpot()
    this.isPunchClock()
  },

    // 未登录跳转倒登录界面
    dialogButtontap() {
      wx.redirectTo({
        url: '/pages/loginModule/loginPage/loginPage',
      })
    },

  // 景点详情
  getScenicSpot: function () {
    let data = {
      id: this.data.scenicId
    }
    esRequest('scenicspot_info', data).then(res => {
      if (res && res.data.code === 0) {
        this.setData({
          scenicDetails: res.data.data,
          scenicspotImgs: res.data.data.scenicspot_imgs.split('，'),
          markers: [{
            latitude: res.data.data.latitude,
            longitude: res.data.data.longitude,
            width: 18,
            height: 18,
            iconPath: '/images/mineModule/bj2.png'
          }]
        })
      } else {
        Toast.fail('系统错误')
      }
    })
    
  },

  // 是否已打卡
  isPunchClock: function () {
    let data = {
      scenicspot_id: this.data.scenicId,
      followers_id: this.data.id_key,
    }
    esRequest('is_follow_scenicspot', data).then(res => {
      if (res && res.data.code === 0) {
        this.setData({
          isFollow: res.data.type
        })
      } else {
        Toast.fail('系统错误')
      }
    })
  },

  // 打卡
  punchClock: function () {
    if (!this.data.id_key) {
      console.log('请先登录')
      this.setData({
        loginShow: true
      })
    } else {
      let data = {
        followers_id: this.data.id_key,
        scenicspot_id: this.data.scenicDetails.id,
        scenicspot_name: this.data.scenicDetails.scenicspot_name,
        scenicspot_img: this.data.scenicDetails.scenicspot_img
      }
      esRequest('follow_scenicspot', data).then(res => {
        if (res && res.data.code === 0) {
          wx.setStorageSync('tp_key', '03')
          Toast.success('打卡成功')
          this.isPunchClock()
        } else {
          Toast.fail('系统错误')
        }
      })
    }
  },

  // 取消打卡
  cancePunch: function () {
    let data = {
      followers_id: this.data.id_key,
      scenicspot_id: this.data.scenicDetails.id
    }
    esRequest('cancel_scenicspot', data).then(res => {
      if (res && res.data.code === 0) {
        wx.setStorageSync('tp_key', '03')
        Toast.success('取消打卡')
        this.isPunchClock()
      } else {
        Toast.fail('系统错误')
      }
    })
  },

  // 地图跳转
  mapComponent: function () {
    let _this = this
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function (res) {
              _this.navigateMap()
            }
          })
        } else {
          _this.navigateMap()
        }
      }
    })
  },
  navigateMap: function () {
    let sname = this.data.scenicDetails.scenicspot_name
    let splace = this.data.scenicDetails.scenicspot_place
    let slatitude = this.data.scenicDetails.latitude
    let slongitude = this.data.scenicDetails.longitude
    wx.navigateTo({
      url: '/pages/components/mapComponent/mapComponent?sname=' + sname + '&splace=' + splace + '&slatitude=' + slatitude + '&slongitude=' + slongitude
    })
  }

})