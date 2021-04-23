var ElementView = require("comjs:element-ui-view");
var axios = require("./resources/axios.min.js")

var BarChart = require("./components/leftChart2.js");
var BarChart2 = require("./components/leftChart3.js");
var RightEchart1 = require("./components/rightChart1.js");
var RightEchart2 = require("./components/rightChart2.js");
var RightEchart3 = require("./components/rightChart3.js");
var MapChart = require("./components/mapChart.js")


class Page extends ElementView {
  onCreate() {
    //使用以下代码，对项目后期开发调试帮助很大
    this.setDefine(require, exports, module);
    var me = this;
    me.vars = {
      barChart: null,
      barChart2: null,
      rightEchart1: null,
      rightEchart2: null,
      rightEchart3: null,
      mapChart: null,

    }
    var template = require("./bigscreenMain.html");
    require("./bigscreen.css");

    var vueConfig = {
      template: template,
      data: function data() {
        return {
          title: "固定污染源在线监控",
          subTitle: "用电监控专题",
          clock1: moment().format('HH:mm:ss'),
          clock2: moment().format('YYYY年MM月DD日'),
          clockTimer: null,
          mapTimer: null,
          "CompanyNum": 0,
          "PFNum": 0,
          "EPNum": 0,
          "DeviceNum": 0,
          "ElecEventNum": 0,
          "ElecEventProNum": 0,
          loading: true,
          token: '',
          todayTime: moment().format('YYYY-MM-DD')

        };
      },
      mounted: function mounted() {
        this.loadClock()
      },
      beforeDestroy: function beforeDestroy() {
        clearInterval(mapTimer);
        clearInterval(clockTimer);
      },
      methods: {
        loadClock() {
          this.clockTimer = setInterval(() => {
            this.clock1 = moment().format('HH:mm:ss')
            this.clock2 = moment().format('YYYY年MM月DD日')
          }, 1000)
        },
        getToken() {
          var thisVue = this;
          axios.get('http://172.172.1.20:8200/xlcloud-st-sso/getToken?userName=jsshb')
            // axios.get('http://10.32.200.230:8085/Main/control/CtrlGetTokenByCode.ashx?loginCode=K/iG7RVl/wi9g4LQcF4E4atpHOHQaVbqSKd43ApqqlUKJOMN5kLtEg==')
            .then(function (response) {
              var token = response.data.token;
              thisVue.token = token
              thisVue.getChartData(token)
              thisVue.getMapData(token)
            }).catch(function (error) {
              console.log(error);
            });
        },
        getChartData(token) { //6594838519562240
          var thisVue = this;
          axios.get('http://172.172.3.51:8081/Control/ScreenData.ashx', {
              // axios.get('http://10.32.200.230:8085/Control/ScreenData.ashx', {
              params: {
                token: token
              }
            })
            .then(function (response) {
              const {
                data
              } = response
              thisVue.CompanyNum = data.CompanyNum
              thisVue.PFNum = data.PFNum
              thisVue.EPNum = data.EPNum
              thisVue.DeviceNum = data.DeviceNum
              thisVue.ElecEventNum = data.ElecEventNum
              thisVue.ElecEventProNum = data.ElecEventProNum
              if (data.AbnormalComTop5.XAxis == null) {
                data.AbnormalComTop5.XAxis = []
                data.AbnormalComTop5.YData = []
              }
              if (data.TopEvent.XAxis == null) {
                data.TopEvent.XAxis = []
                data.TopEvent.YData1 = []
                data.TopEvent.YData2 = []
              }
              if (data.AbnormalComIndustrys.XAxis == null) {
                data.AbnormalComIndustrys.XAxis = []
                data.AbnormalComIndustrys.pieData = []
                data.AbnormalComIndustrys.total = 0
              }
              if (data.CompanyDistribution.XAxis == null) {
                data.CompanyDistribution.XAxis = []
                data.CompanyDistribution.YData = []
              } else if (data.CompanyDistribution.XAxis.length > 0 && data.CompanyDistribution.XAxis[0].length > 7) {
                data.CompanyDistribution.XAxis = data.CompanyDistribution.XAxis.map(item => {
                  return item.substring(0, item.length - 6)
                })
              }
              if (data.ElecData.XAxis == null) {
                data.ElecData.XAxis = []
                data.ElecData.YData = []
              }
              // 实例化组件
              me.vars.barChart = new BarChart(data.CompanyDistribution.YData, data.CompanyDistribution.XAxis)
              me.vars.barChart2 = new BarChart2(data.ElecData.YData, data.ElecData.XAxis)
              me.vars.rightEchart1 = new RightEchart1(data.AbnormalComIndustrys.XAxis, data.AbnormalComIndustrys.pieData, data.AbnormalComIndustrys.total)
              me.vars.rightEchart2 = new RightEchart2(data.TopEvent.XAxis, data.TopEvent.YData1, data.TopEvent.YData2)
              me.vars.rightEchart3 = new RightEchart3(data.AbnormalComTop5.XAxis, data.AbnormalComTop5.YData)

              me.vars.barChart.appendTo(thisVue.$refs.barChart)
              me.vars.barChart2.appendTo(thisVue.$refs.barChart2)
              me.vars.rightEchart1.appendTo(thisVue.$refs.rightChart1)
              me.vars.rightEchart2.appendTo(thisVue.$refs.rightChart2)
              me.vars.rightEchart3.appendTo(thisVue.$refs.rightChart3)
              thisVue.loading = false
            })
            .catch(function (error) {
              console.log(error);
            });

        },
        getMapData(token) {
          var thisVue = this;
          axios.get('http://172.172.3.51:8081/Control/CompanyError.ashx', {
              // axios.get('http://10.32.200.230:8085/Control/CompanyError.ashx', {
              params: {
                token: token
              }
            })
            .then(function (response) {
              var mapData = response.data.map((item) => {
                return {
                  name: item.DistrictName,
                  ComName: item.ComName,
                  HappenTime: moment(item.HappenTime, 'YYYYMMDDHHmmss').format('YYYY年MM月DD日 HH:mm:ss'),
                  LongitudeLatitude: item.LongitudeLatitude
                }
              });
              thisVue.loadMapData(mapData)
            }).catch(function (error) {
              console.log(error);
            });
        },
        loadMapData(mapData) {
          var cityIndex = 0
          me.vars.mapChart.vars.mapOption.series[1].data = mapData.map(item => {
            return {
              name: item.name,
              value: 1
            }
          });
          me.vars.mapChart.getVue().chart.setOption(me.vars.mapChart.vars.mapOption, true);
          if (mapData.length !== 0) {
            this.mapTimer = setInterval(() => {
              me.vars.mapChart.vars.mapOption.series[0].data = [];
              var length = mapData.length
              if (cityIndex === length) {
                cityIndex = 0
              }
              var ComName = mapData[cityIndex].ComName;
              var HappenTime = mapData[cityIndex].HappenTime;
              var LongitudeLatitude = mapData[cityIndex].LongitudeLatitude
              me.vars.mapChart.vars.mapOption.series[0].data = [{
                city: ComName,
                value: LongitudeLatitude,
                HappenTime: HappenTime
              }];
              me.vars.mapChart.getVue().chart.setOption(me.vars.mapChart.vars.mapOption, true);
              cityIndex++;
            }, 5000);
          }

        },
        jumpPage(type) {
          var thisVue = this;
          if (type === 1) {
            window.open(`http://172.172.3.51:8085/Main.aspx?token=${thisVue.token}&cUrl=http://172.172.3.51:8085/WebLess/Views/EPMonitor/EPAbnormalTrackingCompanyList.aspx?token=${thisVue.token}&sdt=${thisVue.todayTime}&edt=${thisVue.todayTime}&otherType=0&g`)
          } else if (type === 2) {
            window.open(`http://172.172.3.51:8085/Main.aspx?token=${thisVue.token}&cUrl=http://172.172.3.51:8085/WebLess/Views/AirMonitor/AirMonitorCompany.aspx?token=${thisVue.token}&sdt=${thisVue.todayTime}&edt=${thisVue.todayTime}&eventType=0&isFilter=0&g`)
          } else if (type === 0) {
            window.open(`http://172.172.3.51:8085/Main.aspx?token=${thisVue.token}&cUrl=http://172.172.3.51:8085/Main/EP_CompanyDeviceStatistics_Org.aspx?turn=1&token=${thisVue.token}&g`)
          } else if (type === 3) {
            // 跳转gis一张图
            window.open(`http://10.32.203.130:8181/shencai-qd-web//web/psp/mapRunner/5c711e08a2d74460bf0d841f76fe6538?ticket=testTicket&prodId=cb51555a6d60549a9cca8c39397a7f5a&pageTypeCode=map&menuParams={%22list%22:[{%22menuId%22:%2280004234cac44f67a53b62f698e8f9d5%22}]}`)
          }

          // 省厅地址
          // if (type === 1) {
          //   window.open(`http://10.32.200.230:8085/Main.aspx?token=${thisVue.token}&cUrl=http://10.32.200.230:8085/WebLess/Views/EPMonitor/EPAbnormalTrackingCompanyList.aspx?token=${thisVue.token}&sdt=${thisVue.todayTime}&edt=${thisVue.todayTime}&otherType=0&g`)
          // } else if (type === 2) {
          //   window.open(`http://10.32.200.230:8085/Main.aspx?token=${thisVue.token}&cUrl=http://10.32.200.230:8085/WebLess/Views/AirMonitor/AirMonitorCompany.aspx?token=${thisVue.token}&sdt=${thisVue.todayTime}&edt=${thisVue.todayTime}&eventType=0&isFilter=0&g`)
          // } else if (type === 0) {
          //   window.open(`http://10.32.200.230:8085/Main.aspx?token=${thisVue.token}&cUrl=http://10.32.200.230:8085/Main/EP_CompanyDeviceStatistics_Org.aspx?turn=1&token=${thisVue.token}&g`)
          // } else if (type === 3) {
          //   // 跳转gis一张图
          //   window.open(`http://10.32.200.230:8085/Main.aspx?token=${thisVue.token}&cUrl=http://10.32.200.230:8085/Main/EP_CompanyDeviceStatistics_Org.aspx?turn=1&token=${thisVue.token}&g`)
          // }


        }
      },
      computed: {}
    };
    me.createVue(vueConfig);
  }
  onInit() {
    var me = this;
    // 先加载地图
    me.vars.mapChart = new MapChart()
    me.vars.mapChart.appendTo(me.getVue().$refs.mapChart)
    // 拿数据加载chart
    me.getVue().getToken()
  };

  onLoad() {
    var me = this;
  };

  onResize() {
    var me = this;
    me.vars.barChart && me.vars.barChart.onResize()
    me.vars.barChart2 && me.vars.barChart2.onResize()
    me.vars.rightEchart1 && me.vars.rightEchart1.onResize()
    me.vars.rightEchart2 && me.vars.rightEchart2.onResize()
    me.vars.rightEchart3 && me.vars.rightEchart3.onResize()
    me.vars.mapChart && me.vars.mapChart.onResize()
  };
  onDestroy() {
    //该方法必输继承实现，避免内存溢出
    //组件销毁，最后调用父累销毁
    //销毁顺序，建议先定义的后销毁
    this.vars = null;
  };
}

module.exports = Page;
