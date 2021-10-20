import esRequest from '../../../utils/esRequest';
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';

Page({
  data: {
    id_key: '',
    windowWidth: 0,
    windowHeight: 0,
    journalism_area: '',
    dropTitle1: '全部地区',
    address: '',
    journalism_type: '',
    dropTitle2: '全部分类',
    page: 1,
    limit: 10,
    totalCount: 0,
    journalismList: [],
  },

  onLoad: function (options) {
  },

  onReady: function () {
    this.setData({
      windowWidth: wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  onShow: function () {
    this.getTopicClass()
  },

  dropTap1: function (e) {
    this.setData({
      page: 1,
      limit: 10,
      totalCount: 0,
      journalismList: [],
      journalism_area: e.currentTarget.dataset.id,
      dropTitle1: e.currentTarget.dataset.title
    })
    this.selectComponent('#item1').toggle('false');
    // this.getTopicClass()
  },

  dropTap2: function (e) {
    this.setData({
      page: 1,
      limit: 10,
      totalCount: 0,
      journalismList: [],
      journalism_type: e.currentTarget.dataset.id,
      dropTitle2: e.currentTarget.dataset.title
    })
    this.selectComponent('#item2').toggle(false);
    // this.marryList()
  },

  // 热门话题列表
  getTopicClass: function () {
    let data = {
      page: this.data.page,
      limit: this.data.limit,
      state: '02'
    }
    esRequest('topic_class', data).then(res => {
      if (res && res.data.code === 0) {
        this.setData({
          totalCount: res.data.totalCount,
          journalismList: this.data.journalismList.concat(res.data.data)
        })
      } else {
        Toast.fail('系统错误')
      }
    })
  },
  
  // 话题列表
  goTopicList: function (e) {
    wx.navigateTo({
      url: '/pages/topicModule/topicList/topicList?id=' + e.currentTarget.dataset.item.id + '&topic_class=' + e.currentTarget.dataset.item.topic_class
    })
  },

  // 触底函数
  onScrollBottom: function () {
    if (this.data.totalCount > this.data.journalismList.length) {
      this.data.page += 1
      this.getTopicClass()
    }
  }
})