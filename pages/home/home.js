// pages/home/home.js

import {Home} from 'home-model.js';
var home = new Home();

Page({

  /**
   * 页面的初 始数据
   */
  data: {
  
  },


  onLoad:function(){
    this._loadData();
  },

  _loadData:function(){
    var id = 1;
    home.getBannerData(id,(res)=>{
      this.setData({
        bannerArr:res
      })
    });


    home.getThemeData((data)=>{
      this.setData({
        themeArr: data
      })
    })


    home.getProductsData((data)=>{
      this.setData({
        productsArr: data
      })
    })

  },

  onProductsItemTap:function(event){
    
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },

  onThemeItemTap: function (event){
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../theme/theme?id='+id+'&name='+name
    })

  }
  
})