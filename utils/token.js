import {Config} from 'config.js';

class Token{
  constructor(){
    this.verifyUrl = Config.restUrl+'token/verify';
    this.tokenUrl = Config.restUrl+'token/user';
  }

  //检测令牌
  verify(){
    var token = wx.getStorageSync('token');
    if(!token) {
      this.getTokenFromServer(token);
    }else {
      this._veirfyFromServer(token);
    }
  }

  //从服务器获取token
  getTokenFromServer(callBack) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
            wx.setStorageSync('token', res.data.token);
            callBack && callBack(res.data.token);
          }
        })
      }
    })
  }

  //携带令牌去服务器效验令牌
  _veirfyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      data: {
        token: token
      },
      success: function (res) {
        var valid = res.data.isValid;
        if (!valid) {
          that.getTokenFromServer();
        }
      }
    })
  }
}

export {Token}