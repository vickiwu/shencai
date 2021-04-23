var ElementView = require("comjs:element-ui-view");
var echarts = require('comjs:echarts');
const DefaultYData = [1000, 1200, 1300, 900, 1400, 1800, 1350];
const DefaultXAxis = ["2020-12-13", "2020-12-14", "2020-12-15", "2020-12-16", "2020-12-17", "2020-12-18", "2020-12-19"]
// var me = this;
class Page extends ElementView {
  constructor(YData = DefaultYData, XAxis = DefaultXAxis) {
    super();
    !Array.isArray(YData) && (YData = DefaultYData);
    !Array.isArray(XAxis) && (XAxis = DefaultXAxis)
    this.XAxis = XAxis;
    this.YData = YData;
  }
  onCreate() {

    this.setDefine(require, exports, module);
    var me = this;
    // var template = require("./leftChart3.html");
    var template = `<div>
  <div id="left-chart3" class="chart-show"></div>
  <div class="show-no-data" v-if="!showLeftChartData3">暂无数据</div>
</div>`;
    var vueConfig = {
      template: template,
      data() {
        return {
          loading: false,
          showLeftChartData3: (me.XAxis.length != 0),
          leftChartData3: {
            YData: me.YData,
            XAxis: me.XAxis
          },
          height: "300px",
          chart: null

        }
      },
      methods: {
        initLeftEchart3(data, xAxis) {
          data === null && (data = [])
          xAxis === null && (xAxis = [])
          xAxis = xAxis.map(item => {
            return item.slice(5)
          })
          this.chart = echarts.init(document.getElementById('left-chart3'))
          this.chart.setOption({
            // title: {
            //   text: "行政区车企分布",
            //   left: "center",
            //   align: "center",
            // },
            tooltip: {
              trigger: 'axis',
              // axisPointer: {
              //   type: 'cross',
              //   animation: true,
              //   label: {
              //     backgroundColor: '#505765'
              //   }
              // },
              axisPointer: {
                type: 'shadow',
              },
              formatter: '{b}:  {c}万kWh'
            },
            // legend: {
            //     data: ['2011年', '2012年']
            // },
            grid: {
              top: '20%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            yAxis: {
              type: 'value',
              name: '单位(万kWh)',
              nameTextStyle: {
                color: "#a6aebd",
                // align: "right",
                padding: [3, 4, 5, 6]
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: "#a6aebd",
                },
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: ['#535f85'],
                  opacity: 0.8
                }
              },
            },
            xAxis: {
              type: 'category',
              data: xAxis,
              axisLabel: {
                textStyle: {
                  color: "#a6aebd",
                },


              },
              axisLine: {
                lineStyle: {
                  color: '#535f85'
                }
              },

            },
            series: [{
              // name: '2012年',
              type: 'bar',
              barWidth: '40%',
              data,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 1,
                  color: '#0078d5'
                },
                {
                  offset: 0,
                  color: '#00c2cd'
                }
              ]),
              itemStyle: {
                // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                normal: {
                  // 柱形图圆角，初始化效果
                  barBorderRadius: [5, 5, 0, 0]
                }
              }
            }]
          })
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
        thisVue.initLeftEchart3(thisVue.leftChartData3.YData, thisVue.leftChartData3.XAxis)
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
