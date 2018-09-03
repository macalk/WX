// pages/order/order.js
import { Cart } from '../cart/cart-model.js';
import { Order } from '../order/order-model.js';
import { Address } from '../../utils/address.js';

var order = new Order();
var cart = new Cart();
var address = new Address();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var from = options.from;
    if (from == 'cart') {
      this._fromCart(options.account);
    }else{
      
      var id = options.id;
      this._fromOrder(id);
    }
  },

  onShow: function () {

    if (this.data.id) {
      this._fromOrder(this.data.id);
    }
  },

  //从订单列表跳转来
  _fromOrder:function(id){
    if (id) {
      var that = this;
      //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
      order.getOrderInfoById(id, (data) => {
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          },
        });

        // 快照地址
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      });
    }
  },

  //从购物车跳转来
  _fromCart: function (account){
    var productsArr = [];
    this.data.account = account;

    productsArr = cart.getCartDataFromLocal(true);
    this.setData({
      productsArr: productsArr,
      account: account,
      orderStatus: 0
    })

    //显示收货地址
    address.getAddress((res) => {
      this._bindAddressInfo(res);
    })
  },

  //编辑地址
  editAddress: function () {
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
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    })
  },

  //下单和支付
  pay: function () {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的后货地址');
      return;
    }
    if (this.data.orderStatus == 0) {

      this._firstTimePay();
    } else {

      this._oneMoresTimePay();
    }
  },

  /* 再次次支付*/
  _oneMoresTimePay: function () {
    this._execPay(this.data.id);
  },

  //第一次支付
  _firstTimePay: function () {
    var orderInfo = [],
      productInfo = this.data.productsArr;
    for (let i = 0; i < productInfo.length; i++) {
      orderInfo.push({
        product_id: productInfo[i].id,
        count: productInfo[i].counts
      })
    }

    var that = this;
    //支付分为两步，第一步生成订单，然后根据订单号支付
    order.doOrder(orderInfo, (data) => {
      //订单生成成功
      if (data.pass) {
        var id = data.order_id;
        that.data.id = id;
        // that.data.fromCartFlag = false;

        //开始支付
        that._execPay(id);
      } else {
        //下单失败
        that._orderFail(data);
      }
    })
  },

  //开始支付
  _execPay: function (id) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode != 0) {
        //将已经下单的商品从购物车中删除
        that.deleteProducts();
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order',
        })
      }
    })
  },

  //下单失败
  _orderFail: function (data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  //将已经下单的商品从购物车中删除
  deleteProducts: function () {
    var ids = [],
      arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  }


})