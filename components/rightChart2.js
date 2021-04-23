var ElementView = require("comjs:element-ui-view");
var echarts = require('comjs:echarts');
const DefaultXAxis = ["南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局"],
  DefaultYData1 = [200, 211, 130, 104, 90, 110, 105, 190, 170, 105],
  DefaultYData2 = [20, 21, 13, 14, 9, 11, 15, 19, 17, 15];

class Page extends ElementView {
  constructor(xAxis = DefaultXAxis, YData1 = DefaultYData1, YData2 = DefaultYData2) {
    super();
    !Array.isArray(xAxis) && (xAxis = DefaultXAxis);
    !Array.isArray(YData1) && (YData1 = DefaultYData1);
    !Array.isArray(YData2) && (YData2 = DefaultYData2)
    this.xAxis = xAxis;
    this.YData1 = YData1;
    this.YData2 = YData2
  }
  onCreate() {
    this.setDefine(require, exports, module);

    var me = this;

    var template = `<div>
  <div id="right-chart2" class="chart-show"></div>
  <div class="show-no-data" v-if="!showRightChartData2">暂无数据</div>
</div>`;

    var vueConfig = {
      template: template,
      data() {
        return {
          loading: false,
          showRightChartData2: (me.xAxis.length !== 0),
          rightChartData2: {
            XAxis: me.xAxis,
            YData1: me.YData1,
            YData2: me.YData2
          },
          height: "200px",
          chart: null

        }
      },
      methods: {
        initRightEchart2(data1, data2, xAxis) { // top10
          data1 === null && (data1 = [])
          data2 === null && (data2 = [])
          xAxis === null && (xAxis = [])
          data1.reverse()
          data2.reverse()
          var totalData = data1.map((item, index) => {

            return Number(item) + Number(data2[index])
          })

          this.chart = echarts.init(document.getElementById('right-chart2'))
          var colorList = ['#24d7db', '#f19960']
          this.chart.setOption({

            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['污处设施异常', '大气污染管控异常'],
              right: 10,
              top: 10,
              textStyle: {
                color: '#a6aebd' // 字体颜色
              }
            },
            color: colorList,
            grid: {
              top: '15%',
              left: '3%',
              right: '4%',
              bottom: '-10px',
              containLabel: true
            },
            xAxis: {
              show: false
            },
            yAxis: [{
              type: 'category',
              data: xAxis,
              name: '单位(份)',
              nameTextStyle: {
                color: "#a6aebd",
                // padding: [3, 4, 5, 0]
                align: "right"
              },
              axisLabel: {
                textStyle: {
                  color: '#a6aebd'
                }
              },
              axisLine: { // y轴
                show: false

              },
              axisTick: { // y轴刻度线
                show: false
              },
              splitLine: { // 网格线
                show: false
              }
            }, {
              type: 'category',
              inverse: false,
              axisTick: 'none',
              axisLine: 'none',
              show: true,
              axisLabel: {
                textStyle: {
                  color: '#ffffff',
                  fontSize: '12'
                },
                formatter: function (value) {
                  return value.toLocaleString() + '家';

                },
              },
              data: totalData
            }],
            series: [{
              name: '污处设施异常',
              stack: '总量',
              type: 'bar',
              barWidth: '60%',
              data: data1,
              itemStyle: {
                normal: {
                  borderColor: '#0a103f',
                  borderWidth: 2
                }
              }
            }, {
              name: '大气污染管控异常',
              type: 'bar',
              stack: '总量',
              barWidth: '60%',
              data: data2,
              itemStyle: {
                normal: {
                  borderColor: '#0a103f',
                  borderWidth: 2
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
        thisVue.initRightEchart2(thisVue.rightChartData2.YData1, thisVue.rightChartData2.YData2, thisVue.rightChartData2.XAxis)
      }
    };
    me.createVue(vueConfig);
    var myParams = me.getParams();
  }
  onInit() {
    var me = this;
    // me.getParent().getVue().title = 'ssss'
    me.getVue().chartResize()
  }
  onResize() {
    var me = this;
    me.getVue().chartResize()
  };
}

module.exports = Page;
