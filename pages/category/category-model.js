import {Base} from '../../utils/base.js'

class Category extends Base {
  constructor(){
    super();
  }

  //获取所有分类
  getCategoryType(callback){
    var param = {
      url:'category/all',
      sCallback:function(data){
        callback && callback(data);
      }
    }
    this.request(param);
  }

  //获得某个分类下的商品
  getProductsByCategory(id,callback){
    var param = {
      url:'product/by_category?id='+id,
      sCallback:function(data) {
        callback && callback(data);
      }
    }
    this.request(param);
  }
}

export {Category};