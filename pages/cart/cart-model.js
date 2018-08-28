
import {Base} from '../../utils/base.js'

class Cart extends Base {
  constructor(){
    super();
    this._storageKeyName = 'cart';
  }
  
  //加入到购物车
  add(item,counts) {
    var cartData = this.getCartDataFromLocal();
    var isHasInfo = this._isHasThatOne(item.id, cartData);
    if (isHasInfo.index==-1) {
      item.counts = counts;
      item.selectStatus = true;//设置选中状态
      cartData.push(item);
    }else {
      cartData[isHasInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName, cartData)
  }

  //获取缓存数据
  getCartDataFromLocal(flag) {
    var res = wx.getStorageSync(this._storageKeyName);
    if(!res){
      res = [];
    }
    //在下单的时候过滤掉不下单的商品
    if(flag) {
      var newRes = [];
      for(let i = 0;i<res.length;i++) {
        if(res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }
    return res;
  }

  //判断缓存是否已经包含该id
  _isHasThatOne(id,arr){
    var item;
    var result = {index:-1};
    for (var i = 0; i < arr.length; i++){
      item = arr[i];
      if(item.id == id) {
        result = {
          index:i,
          data:item
        };
        break;
      }
    }
    return result;
  }

  //读取购物车商品数量  flag为true：考虑商品选中状态
  getCartTotalCounts(flag){
    var data = this.getCartDataFromLocal();
    var counts = 0;
    for (var i = 0; i < data.length;i++){
      if(flag) {
        if(data[i].selectStatus) {
          counts += data[i].counts;
        }
      }else {
        counts += data[i].counts;
      }
      
    }
    return counts;
  }

  //修改商品数目
  _changeCounts(id, counts) {
    var cartdata = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartdata);
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts > 1) {
        cartdata[hasInfo.index].counts += counts;
      }
    }
    //更新本地缓存
    wx.setStorageSync(this._storageKeyName, cartdata)
  }

  //增加商品数目
  addCounts(id){
    this._changeCounts(id,1);
  }
  //减少商品数目
  cutCounts(id) {
    this._changeCounts(id, -1);
  }


  //删除商品
  delete(ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);  //删除数组某一项
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }


  /*本地缓存 保存／更新*/
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  };

}

export {Cart}