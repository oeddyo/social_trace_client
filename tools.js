/**
 * Created by eddiexie on 14-3-7.
 */

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

function my_guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


addLocationChart = function (scale) {
    $(function () {
        $('#geo_cell').highcharts({
            chart: {
                type: 'bar',
                height: 150
            },
            title: {
                text: 'Popularity of This Video In Your Area',
                style: {
                    color: '#000000',
                    fontSize: '20px'
                }

            },
            xAxis: {
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    style: {
                        fontSize: 15
                    },
                    formatter: function () {
                        c = ['Extreamly Low', 'Low', 'Medium', 'High', 'Extreamly High']
                        return "<b>" + c[this.value] + "</b>"

                    }
                },
                allowDecimals: false,
                max: 4
            },

            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    }
                }

            },
            legend: {
                enabled: false
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    name: 'Popularity',
                    data: [scale + 0.02]
                }
            ]
        });
    });
}

addGenderChart = function (scale, gender) {
    $(function () {
        console.log("gender is "+ gender.user_gender)
        gender_nick = "";
        if(gender.user_gender == "Male"){
            gender_nick = "Men";
        }else{
            gender_nick = "Women";
        }


        $('#gender_cell').highcharts({
            chart: {
                type: 'bar',
                height: 150
            },
            title: {
                text: 'Popularity of This Video Among ' + gender_nick,
                style: {
                    color: '#000000',
                    fontSize: '20px'
                }
            },
            xAxis: {
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    style: {
                        fontSize: 15
                    },

                    formatter: function () {
                        c = ['Extreamly Low', 'Low', 'Medium', 'High', 'Extreamly High']
                        return '<b>' + c[this.value] + "</b>"
                    }
                },
                allowDecimals: false,
                max: 4
            },

            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    }
                }

            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: 'Popularity',
                    data: [scale + 0.02]
                }
            ]
        });
    });
}
