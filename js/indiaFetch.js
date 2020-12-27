//Variable
var indiaData;
var indiaTotalData = [];
var indiaTotalData_Label = [];
var stateName = [];
var testedIndia = [];
var testedLabel = [];


//Update Line Chart
function updateConfigByMutating_Line(val) {
    lineChart.data.datasets[val].data = indiaTotalData;
    if(val == 0){
        lineChart.data.labels = indiaTotalData_Label;
    }
    lineChart.update();
}

//Updating Bar Chart
function updateConfigByMutating_Bar_State(active,recover,death) {
    barChartState.data.datasets[0].data = [active,recover,death];
    barChartState.update();
}

//Updating the pie chart
function updateConfigByMutating_Polar(active,recover,death){
    stateChart.data.datasets[0].data = [active,recover,death];
    stateChart.update();
}

//Updating Bar chart
function updateConfigByMutating_Bar_Test(label, data) {
    test.data.datasets[0].data = data;
    test.data.labels = label;
    test.update();
}


//Fetch India API DATA
async function getIndiaData(){
    try{
        //https://api.covid19india.org/data.json
        //https://api.covid19india.org/state_district_wise.json
        const json = await fetch('https://api.covid19india.org/data.json');
        indiaData = await json.json();
        //console.log(indiaData);

        //Confirm Case
        for(let i=0;i<indiaData.cases_time_series.length;i++){
            indiaTotalData[i] = indiaData.cases_time_series[i]["totalconfirmed"];
            indiaTotalData_Label[i] = indiaData.cases_time_series[i]["date"];
        }
        updateConfigByMutating_Line(0);

        //Recovered Case
        indiaTotalData = [];
        for(let i=0;i<indiaData.cases_time_series.length;i++){
            indiaTotalData[i] = indiaData.cases_time_series[i]["totalrecovered"];
        }
        updateConfigByMutating_Line(1);

        //Death Case
        indiaTotalData = [];
        for(let i=0;i<indiaData.cases_time_series.length;i++){
            indiaTotalData[i] = indiaData.cases_time_series[i]["totaldeceased"];
        }
        updateConfigByMutating_Line(2);

        //State Store
        for(let i=0;i<indiaData.statewise.length;i++){
            stateName[i] = indiaData.statewise[i]["state"];
        }

        //Testing
        for(let i=0;i<indiaData.tested.length-1;i++){
            if(indiaData.tested[i]["testedasof"] == ""){
                continue;
            }else{
                testedIndia[i] = indiaData.tested[i]["totalsamplestested"];
                testedLabel[i] = convertDate(indiaData.tested[i]["testedasof"]);
            }
        }

        //console.log(testedIndia);
        //console.log(testedLabel);
        updateConfigByMutating_Bar_Test(testedLabel, testedIndia);


        renderStateData(stateName[8].toUpperCase());
        //console.log(stateName);



}catch(error){
    console.log("Error : "+error);
} 
}
getIndiaData();


//Cases in India
var lineChart = new Chart($("#line-chart"), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{ 
          data: [0],
          label: "Confirmed",
          borderColor: "#3333ff",
          fill : false
        }, { 
          data: [0],
          label: "Recovery",
          borderColor: "#33ff33",
          fill : false
        }, { 
          data: [0],
          label: "Death",
          borderColor: "#ff3333",
          fill : false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Cases in India',
        position: "bottom"
      }
    }
});

//State Chart
var stateChart = new Chart(document.getElementById("polar-chart-state"), {
    type: 'pie',
    data: {
      labels: ["Active", "Recovered", "Death"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#3e95cd", "#3cba9f","#ff4444"],
          data: [2478,5267,734]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Statewise Cases',
        position: "bottom"
      }
    }
});

//state delta chart
var barChartState = new Chart($("#bar-chart-horizontal-state"), {
    type: 'horizontalBar',
    data: {
      labels: ["Confirmed", "Recovery", "Death"],
      datasets: [
        {
          label: "People",
          backgroundColor: ["#3333ff", "#33ff33","#ff3333"],
          data: [0,0,0]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: false,
      }
    }
  });

//INPUT Event
$("#StateDataList").on("input",function(){
    let x =  $("#StateDataList").val();
    //console.log(x);
    generateStateName(x);
});

//SEARCH Event
$("#button-render-state").on("click",function(){
    let name = $("#StateDataList").val().toUpperCase();
    renderStateData(name);
})
  

function generateStateName(input){
    //console.log(input);
    var count = 0;
    $("#datalistOptionsState").html(" ");
    for(let i=0; i<stateName.length; i++ ){
        //console.log(i)
      if((stateName[i].toUpperCase()).indexOf(input.toUpperCase()) > -1 && count < 10){
        $("#datalistOptionsState").append("<option value=\""+stateName[i]+"\"></option>");
        count++;
      }
    }
}

function renderStateData(name){
    let id;
    for(let i=0; i<stateName.length ;i++){
      //console.log(name+"===="+stateName[i].toUpperCase()+"<<<>>>>"+id+"<<<<>>>>"+i+"___")
      if(name == stateName[i].toUpperCase()){
        id = i;
        //console.log(id);
      }
    }
  
    if(id == undefined){
      window.alert("INVALID NAME");
    }else{
      //Render Data
      //console.log(indiaData);
      $("#searchState").text(stateName[id].toUpperCase());
      $("#searchState").text(indiaData.statewise[id]["Country"]);
      $(".state-case-box-recover").text(roundData(indiaData.statewise[id]["recovered"]));
      $(".state-case-box-death").text(roundData(indiaData.statewise[id]["deaths"]));
      $(".state-case-box-confirm").text("Total Confirmed Cases : "+indiaData.statewise[id]["confirmed"]);
      $(".state-case-box-active").text(roundData(indiaData.statewise[id]["active"]));
      $("#ctoday_state").text("Confirm : "+indiaData.statewise[id]["deltaconfirmed"]);
      $("#rtoday_state").text("Recover : "+indiaData.statewise[id]["deltarecovered"]);
      $("#dtoday_state").text("Death : "+indiaData.statewise[id]["deltadeaths"]);
  
      updateConfigByMutating_Polar(indiaData.statewise[id]["active"],indiaData.statewise[id]["recovered"],indiaData.statewise[id]["deaths"]);
      updateConfigByMutating_Bar_State(indiaData.statewise[id]["deltaconfirmed"],indiaData.statewise[id]["deltarecovered"],indiaData.statewise[id]["deltadeaths"]);
    }
  
}

//Testing Bar Chart
var test = new Chart($("#bar-chart-test"), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        { 
          data: [],
          label: "Population of People",
          backgroundColor: "#3e95cd"
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Total Testing in India',
        position: "bottom"
      }
    }
});

//Convert Date
function convertDate(date){
    if(date.length != 10){
        date = "0"+date;
    }
    let month = date.substring(3,5);
    month = (month==1)?"Jan":(month==2)?"Feb":(month==3)?"Mar":(month==4)?"Apr":(month==5)?"May":(month==6)?"Jun":(month==7)?"Jul":(month==8)?"Aug":(month==9)?"Sep":(month==10)?"Oct":(month==11)?"Nov":"Dec";
    //console.log(date+" "+date.substring(0,2)+" "+month+" "+date.substring(6,10));
    return (date.substring(0,2)+" "+month+" "+date.substring(6,10));


}
  
  