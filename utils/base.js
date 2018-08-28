
import {Config} from '../utils/config.js';
import {Token} from 'token.js';


class Base{
  constructor(){
    this.baseRequestUrl = Config.restUrl;
  }

  //noRefetch为true时，不做未授权重试机制
  request(params,noRefetch){
    var that = this;
    var url = this.baseRequestUrl + params.url;
    if (!params.type){
      params.type = 'GET'
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'token':wx.getStorageSync('token')
      },
      success:function(res){
        // if (params.sCallBack){
        //   params.sCallBack(res)
        // }
        
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {//调用成功
          params.sCallback && params.sCallback(res.data);
        }else{
          //AOP
          if(code == '401') {
            //获取新的令牌，再一次发送该请求
            if (!noRefetch) {
              that._refetch(params);
            }
          }
          params.eCallback && params.eCallback(res.data);
        }
        
      },
      fail:function(err){
        console.log(err);
        console.log('失败失败')
      }

    })
  };


  _refetch(params){
    var token = new Token();
    token.getTokenFromServer((token)=>{
      this.request(params,true);
    })
  }

} 

export {Base};