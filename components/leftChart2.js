var ElementView = require("comjs:element-ui-view");
var echarts = require('comjs:echarts');
const DefaultYData = [1000, 1200, 1300, 900, 1400, 1800, 1350];
const DefaultXAxis = ['南京', '无锡', '南京', '无锡', '南京', '无锡', '连云港'];


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
    var template = `<div>
  <div id="left-chart2" :style="{height: height}"></div>
  <div class="show-no-data" v-if="!showLeftChartData2">暂无数据</div>
</div>`;
    var vueConfig = {
      template: template,
      data() {
        return {
          loading: false,
          showLeftChartData2: (me.XAxis.length !== 0),
          leftChartData2: {
            YData: me.YData,
            XAxis: me.XAxis
          },
          height: "300px",
          chart: null
        }
      },
      methods: {
        initLeftEchart2(data, xAxis) {
          data === null && (data = [])
          xAxis === null && (xAxis = [])
          this.chart = echarts.init(document.getElementById('left-chart2'))
          this.chart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: '{b}:  {c}家'
            },
            grid: {
              top: '20%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            yAxis: {
              type: 'value',
              name: '单位(家)',
              nameTextStyle: {
                color: "#a6aebd",
                padding: [3, 4, 5, -1]
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
                interval: 0,
                rotate: 30,
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
                normal: {
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
        thisVue.initLeftEchart2(thisVue.leftChartData2.YData, thisVue.leftChartData2.XAxis)
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
