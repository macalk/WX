// pages/category/category.js

import { Category } from 'category-model.js'
var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryData:null,
    currentMenuIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData: function () {

    //获取所有分类
    category.getCategoryType((categoryData) => {
      this.data.categoryData = categoryData;
      this.setData({
        categoryTypeArr: categoryData
      });

      //获取某个分类下的详情（异步回调需要先获取id）
      category.getProductsByCategory(categoryData[0].id, (data)=> {
        var dataObj = {
          products:data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }
        this.setData({
          categoryProducts: dataObj
        })

      })
    })

  },

  //选择分类
  changeCategory:function(e){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    category.getProductsByCategory(id,(data)=>{
      var dataObj = {
        products: data,
        topImgUrl: this.data.categoryData[index].img.url,
        title: this.data.categoryData[index].name
      }
      this.setData({
        categoryProducts: dataObj,
        currentMenuIndex: index
      })
    })
  },

  /*跳转到商品详情*/
  onProductsItemTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  //分享效果
  onShareAppMessage: function () {
    return {
      title: '零食商贩 Pretty Vendor',
      path: 'pages/category/category'
    }
  }

})