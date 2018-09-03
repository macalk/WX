// pages/my/my.js
import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';

var address = new Address();
var order = new Order();
var my = new My();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },

  onShow: function(){
    if (order.hasNewOrder()) {
      this.refresh();
    }
  },

  //重新加载数据
  refresh:function(){
    this.data.orderArr = [];
    this._getOrders();
    order.execSetSorageSync(false);
  },

  _loadData: function () {
    var that = this;
    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      })
    })

    this._getOrders();
  },

  //获取地址信息
  _getAddressInfo: function () {
    address.getAddress((addressInfo) => {
      this._bindAddressInfo((addressInfo));
    })
  },

  //绑定地址信息
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    })
  },
  //加载订单列表
  _getOrders: function () {
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.data.data
      if (data && data.length > 0) {
        this.data.orderArr.push.apply(this.data.orderArr, data);
        this.setData({
          orderArr: this.data.orderArr
        })
      } else {
        this.data.isLoadedAll = true
      }

    })
  },

  //上拉加载更多
  onReachBottom: function () {
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  //跳转订单详情
  showOrderDetailInfo: function (event) {
    var id = event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    })
  },

  //付款
  rePay: function (event) {
    var id = event.currentTarget.dataset.id,
      index = event.currentTarget.dataset.index;

    this._execpay(id, index);
  },


  //支付
  _execpay: function (id, index) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到 成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        });
      } else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }
    });
  },

  showTips:function(title,content){
    wx.showModal({
      title: title,
      content: content,
    })
  },

  //地址管理
  editAddress:function(){
    var that = this;
    wx.chooseAddress({
      success: function (res) {

        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        that._bindAddressInfo(addressInfo);

        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败！');
          }
        })
      }
    })
  }
})