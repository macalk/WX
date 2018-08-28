// pages/product/product.js
import {Product} from 'product-model.js'
var product = new Product();
import { Cart } from '../cart/cart-model.js'
var cart = new Cart();

Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    countsArray:[1,2,3,4,5,6,7,8,9,10],
    productCount:1,
    currentTabsIndex:0
  },

  

  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;

    this._loadData();
  },

  _loadData: function () {
    product.getDetailInfo(this.data.id, (data) => {
      this.setData({
        product: data,
        cartTotalCounts: cart.getCartTotalCounts()
      })
    });
  },

//picker点击事件
  bindPickerChange:function(e){
    var index = e.detail.value;
    var selectedCount = this.data.countsArray[index];
    this.setData({
      productCount: selectedCount
    })
  },

//商品详情、参数、售后
  onTabsItemTap:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentTabsIndex:index
    })
  },

//加入购物车
  onAddingToCartTap:function(event) {
    this.addToCart();
    var counts = this.data.cartTotalCounts + this.data.productCount;
    this.setData({
      cartTotalCounts: counts
    })
  },
  addToCart:function(){
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }
    cart.add(tempObj, this.data.productCount);
  },

//跳转页面
  onCartTap:function(){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }
})