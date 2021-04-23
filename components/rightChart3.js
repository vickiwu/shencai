var ElementView = require("comjs:element-ui-view");
var echarts = require('comjs:echarts');
const DefaultXAxis = ["南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局", "南京生态环保局"],
  DefaultYData = [200, 211, 110, 105, 105];

class Page extends ElementView {
  constructor(xAxis = DefaultXAxis, YData = DefaultYData) {
    super();
    !Array.isArray(xAxis) && (xAxis = DefaultXAxis);
    !Array.isArray(YData) && (YData = DefaultYData);
    this.xAxis = xAxis;
    this.YData = YData;
  }
  onCreate() {
    this.setDefine(require, exports, module);

    var me = this;

    var template = `<div>
  <div id="right-chart3" class="chart-show"></div>
  <div class="show-no-data" v-if="!showRightChartData3">暂无数据</div>
</div>`;

    var vueConfig = {
      template: template,
      data() {
        return {
          loading: false,
          showRightChartData3: (me.xAxis.length !== 0),
          rightChartData3: {
            XAxis: me.xAxis,
            YData: me.YData
          },
          height: "200px",
          chart: null

        }
      },
      methods: {
        initRightEchart3(data, xAxis) {
          data === null && (data = [])
          xAxis === null && (xAxis = [])
          this.chart = echarts.init(document.getElementById('right-chart3'))
          var colorList = ['#24d7db']
          data.reverse()

          this.chart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            color: colorList,
            grid: {
              top: '8%',
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
              // name: '单位(份)',
              // nameTextStyle: {
              //   color: "#a6aebd",
              //   align: "right"
              // },
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
                  return value.toLocaleString() + '小时';

                },
              },
              data: data
            }],
            series: [{
              type: 'bar',
              barWidth: '60%',
              data: data
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
        thisVue.initRightEchart3(thisVue.rightChartData3.YData, thisVue.rightChartData3.XAxis)
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
