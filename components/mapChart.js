var ElementView = require("comjs:element-ui-view");
var echarts = require('comjs:echarts');
var axios = require("../resources/axios.min.js")


class Page extends ElementView {
  constructor(xAxis = [], YData = []) {
    super();
    !Array.isArray(xAxis) && (xAxis = []);
    !Array.isArray(YData) && (YData = []);
    this.xAxis = xAxis;
    this.YData = YData;
  }
  onCreate() {
    this.setDefine(require, exports, module);
    var me = this;
    me.vars = {
      mapOption: null
    };
    var template = `<div id="map-chart"></div>`;
    var vueConfig = {
      template: template,
      data() {
        return {
          loading: false,
          height: "200px",
          chart: null
        }
      },
      methods: {
        loadMap() {
          var mapData = []
          var thisVue = this;
          this.chart = echarts.init(document.getElementById('map-chart'))

          me.vars.mapOption = null;
          axios.get('./resources/json/jiangsu.json')
            .then(function (res) {
              var json = res.data
              echarts.registerMap('js', json);
              me.vars.mapOption = {
                visualMap: {
                  show: false,
                  max: 5,
                  seriesIndex: [1],
                  inRange: {
                    color: ['#092d6e', '#3161b8']
                  }
                },
                geo: [{
                  map: 'js',
                  roam: false, //是否允许缩放
                  zoom: 1.1, //默认显示级别
                  scaleLimit: {
                    min: 0,
                    max: 3
                  }, //缩放级别
                  itemStyle: {
                    normal: {
                      areaColor: '#013C62',
                      shadowColor: '#013C62',
                      shadowBlur: 10,
                      shadowOffsetX: -15,
                      shadowOffsetY: 15,
                    }
                  },
                  tooltip: {
                    show: false
                  }
                }],
                series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    z: 5,
                    data: [],
                    symbolSize: 14,
                    label: {
                      normal: {
                        show: true,
                        formatter: function (params) {
                          return '{fline|企业：' + params.data.city + '}\n{fline|时间：' + params.data.HappenTime + '}\n{fline|' + (params.data.info || '发生了疑似治理设施未同步开启事件') + '}';
                        },
                        position: 'top',
                        backgroundColor: 'rgba(254,174,33,.8)',
                        padding: [0, 0],
                        borderRadius: 3,
                        lineHeight: 25,
                        color: '#f7fafb',
                        rich: {
                          fline: {
                            padding: [0, 10, 0, 10],
                            color: '#ffffff'
                          },
                          tline: {
                            padding: [0, 10, 0, 10],
                            color: '#ffffff'
                          }
                        }
                      },
                      emphasis: {
                        show: true
                      }
                    },
                    itemStyle: {
                      color: '#24d7db',
                    }
                  },
                  //地图
                  {
                    type: 'map',
                    mapType: 'js',
                    geoIndex: -1,
                    zoom: 1.1, //默认显示级别
                    label: {
                      show: true,
                      color: '#ffffff',
                      emphasis: {
                        color: 'white',
                        show: false
                      }
                    },
                    itemStyle: {
                      normal: {
                        borderColor: '#2980b9',
                        borderWidth: 1,
                        areaColor: '#12235c'
                      },
                      emphasis: {
                        areaColor: '#FA8C16',
                        borderWidth: 0,
                        color: 'green'
                      }
                    },
                    data: mapData.map(item => {
                      return {
                        name: item.ComName,
                        value: item.HappenTime
                      }
                    })
                  }
                ]
              };
              thisVue.chart.setOption(me.vars.mapOption);
            }).catch(function (error) {
              console.log(error);
            });
        },
        chartResize() {
          var thisVue = this;
          var height = me.fitHeight() + 'px';
          thisVue.height = height
          thisVue.chart.resize({
            height: thisVue.height
          })

        }
      },
      created: function () {},
      mounted() {
        var thisVue = this;
        thisVue.loadMap()
      }
    };
    me.createVue(vueConfig);
    var myParams = me.getParams();
  }
  onInit() {
    var me = this;
    me.getVue().chartResize()
  }
  onResize() {
    var me = this;
    me.getVue().chartResize()
  };
}

module.exports = Page;
