
import {Base} from '../../utils/base.js';

class Home extends Base{
  constructor(){
    super();
  }


//获取banner
  getBannerData(id, callback){
    var params = {
      url : 'banner/'+id,
      sCallback:function(res) {
        callback && callback(res.items);
      }
    }
    this.request(params);
    
  }

//获取主题theme
  getThemeData(callback){
    var params = {
      url: 'theme?ids=1,2,3',
      sCallback:function(res){
        callback && callback(res);
      }
    }
    this.request(params);

  }

//获取products
  getProductsData(callback){
    var params = {
      url: 'product/recent',
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }

}


export {Home};