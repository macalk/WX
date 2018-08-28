import {Base} from 'base.js';
import {Config} from 'config.js';

class Address extends Base{
  constructor (){
    super();
  }

  //设置地址信息
  setAddressInfo(res) {
    var province = res.provinceName || res.province,
      city = res.cityName || res.city,
      country = res.countyName || res.country,
      detail = res.detailInfo || res.detail;

    var totalDetail = city + country + detail;

    if (!this.isCenterCity(province)) {
      totalDetail = province + totalDetail;
    }

    return totalDetail;
  }

  //是否是直辖市
  isCenterCity(name) {
    var centerCitys = ['北京市', '天津市', '上海市', '重庆市'],
      flag = centerCitys.indexOf(name) >=0 ;
    return flag;
  }

  //更新保存地址
  submitAddress(data,callback) {
    
    data = this._setUpAddress(data);
    var param = {
      url:'address',
      type:'post',
      data:data,
      sCallback:function(res){
        callback && callback(true,res);
      },
      eCallback:function(res){
        callback && callback(false, res);
      }
    }
    this.request(param);
  }

  //保存地址
  _setUpAddress(res) {
    var formData = {
      name:res.userName,
      province:res.provinceName,
      city:res.cityName,
      country:res.countyName,
      mobile:'17681808382',
      detail:res.detailInfo
    }
    return formData;
  }


}

export {Address}