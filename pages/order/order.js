// pages/order/order.js
import {Cart} from '../cart/cart-model.js';
// import {Order} from '../order/order-model.js';
import {Address} from '../../utils/address.js';

// var order = new Order();
var cart = new Cart();
var address = new Address();


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productsArr = [];
    this.data.account = options.account;

    productsArr = cart.getCartDataFromLocal(true);
    this.setData({
      productsArr:productsArr,
      account: options.account,
      orderStatus:0
    })
  },

  //编辑地址
  editAddress:function(){
    var that = this;
    wx.chooseAddress({
      success:function(res){
        
        var addressInfo = {
          name:res.userName,
          mobile:res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        that._bindAddressInfo(addressInfo);

        //保存地址
        address.submitAddress(res,(flag)=>{
          if(!flag) {
            that.showTips('操作提示','地址信息更新失败！');
          }
        })
      }
    })
  },

  
  //提示窗口
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },

  //绑定地址信息
  _bindAddressInfo:function (addressInfo){
    this.setData({
      addressInfo: addressInfo
    })
  }

  
})