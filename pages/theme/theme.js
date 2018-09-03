// pages/theme/theme.js

import {Theme} from 'theme-model.js';
var theme = new Theme();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad: function (options) {
    var id = options.id;
    var name = options.name;
    this.data.id = id;
    this.data.name = name;

    this._loadData();
  },

  _loadData:function(){
    theme.getProductsData(this.data.id,(data)=>{
      console.log(data);
      this.setData({
        themeInfo:data
      })
    })
  },

  onReady:function (){
    wx.setNavigationBarTitle({
      title: this.data.name
    });
  },


  onProductsItemTap:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }

  
})