import {Base} from '../../utils/base.js'

class Order extends Base {
  constructor(){
    super();
    this._storageKeyName = 'newOrder';
  }

  //下单
  doOrder(param,callback){
    var that = this;
    var allParams = {
      url:'order',
      type:'post',
      data:{products:param},
      sCallback:function(data){
        that.execSetSorageSync(true);
        callback && callback(data);
      },
      eCallback:function(){

      }
    };
    this.request(allParams);
  }

  //支付
  execPay(orderNumber,callback){
    var allParams = {
      url:'pay/pre_order',
      type:'post',
      data: { id: orderNumber},
      sCallback:function(data){
        var timeStamp = data.timeStamp;
        console.log(data);
        if (timeStamp) {//可以支付
          wx.requestPayment({
            timeStamp: timeStamp.toString(),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.sign,
            success: function (res){
              callback && callback(2);
            },
            fail: function (res){
              callback && callback(1);
            }
          })
        }else {
          callback && callback(0);
        }
      },
      eCallback:function(data){
        console.log(data);
      }
    };
    this.request(allParams);
  }

  //本地缓存 保存 更新
  execSetSorageSync(data){
    wx.setStorageSync(this._storageKeyName, data);
  }

  //获得订单的具体内容
  getOrderInfoById(id, callback){
    var that = this;
    var allParams = {
      url: 'order/' + id,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {

      }
    };
    this.request(allParams);
  }

  //获取订单列表 pageIndex 从1开始
  getOrders(pageIndex, callback){
    var allParams = {
      url:'order/by_user',
      data: { page: pageIndex},
      type:'post',
      sCallback:function(data){
        callback && callback(data)
      }
    }
    this.request(allParams);
  }

  //是否有新的订单
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;
  }
}

export{Order}