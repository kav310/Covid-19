window.addEventListener("load", function () {
  // Map
  mapboxgl.accessToken =
    "pk.eyJ1IjoiMHByb2RpZ3kiLCJhIjoiY2tiMzUzbnh3MDE0MDJ4bnYweWhiMmt2byJ9.KSMdGJTta-W3tR5Gv0Lf9w";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/0prodigy/ckb3c98ei0fmn1ip9s1vl7t1i", // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 0, // starting zoom
    layers: [
      {
        id: "water",
        source: "mapbox-streets",
        "source-layer": "water",
        type: "fill",
        paint: {
          "fill-color": "#00ffff",
        },
      },
    ],
  });

  //chart
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Confirmed",
          data: [5294041, 4333463, 5399508, 6358757, 4420028, 3660341, 3340989],
          backgroundColor: ["transparent"],
          borderColor: ["rgba(253, 78, 113,1)", "rgba(255, 24, 70,0.3)"],
          borderWidth: 2,
        },
        {
          label: "Recoverd",
          data: [12, 19, 23, 75, 82, 23],
          backgroundColor: ["transparent"],
          borderColor: [
            "rgba(23,210,38,1)",
            "rgba(0,255,29,0.6502976190476191)",
          ],
          borderWidth: 2,
        },
        {
          label: "Deaths",
          data: [12, 19, 23, 75, 82, 23],
          backgroundColor: ["transparent"],
          borderColor: [
            "rgba(208,52,32,1)",
            "rgba(255,0,0,0.7819502801120448)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          },
        ],
      },
    },
  });

  function getDataByMonth() {
    var req = new XMLHttpRequest();
    var url =
      "https://api.covid19api.com/world?from=2020-01-04T00:00:00Z&to=2020-06-04T00:00:00Z";
    req.open("GET", url);
    req.send();
    req.onload = function () {
      var res = JSON.parse(this.response);
      chart.data.datasets[0].data = [];
      chart.data.datasets[1].data = [];
      chart.data.datasets[2].data = [];
      for (var i = 0; i < res.length; i += 8) {
        chart.data.datasets[0].data.push(res[i].TotalConfirmed);
        chart.data.datasets[1].data.push(res[i].TotalRecovered);
        chart.data.datasets[2].data.push(res[i].TotalDeaths);
      }
    };
  }
  getDataByMonth();
  getSummary();

  var timer;
  var searchBtn = document.getElementById("searchByCountry");
  searchBtn.addEventListener("input", function () {
    clearTimeout(timer);
    if (searchBtn.value) {
      timer = setTimeout(function () {
        filterCountry(searchBtn.value);
      }, 2000);
    }
  });
});

var countries = [];

function filterCountry(q) {
  q = q.toLowerCase();
  let result = countries.filter(function (country) {
    if (country.Country.toLowerCase().indexOf(q) != -1) {
      return country;
    }
  });
  displayCountryStats(result);
}

function getSummary() {
  var req = new XMLHttpRequest();
  var url = "https://api.covid19api.com/summary";
  req.open("GET", url);
  req.send();
  req.onload = function () {
    let res = JSON.parse(this.response);
    countries = res.Countries;
    displaySummary(res.Global);
    displayCountryStats(res.Countries);
  };
}

function displaySummary(res) {
  var total = document.querySelector(".total");
  var active = document.querySelector(".active");
  var recoverd = document.querySelector(".recoverd");
  var death = document.querySelector(".death");
  total.textContent = res.TotalConfirmed;
  active.textContent = res.NewConfirmed;
  recoverd.textContent = res.TotalRecovered;
  death.textContent = res.TotalDeaths;
}

function displayCountryStats(res) {
  var countrylist = document.querySelector(".country-list ul");
  countrylist.textContent = "";
  if (res.length == 0) {
    countrylist.innerHTML = "<li><h2>No data of this country</h2></li>";
  } else {
    for (var i = 0; i < res.length; i++) {
      var li = document.createElement("li");
      li.setAttribute("class", "country-data");
      var span = document.createElement("span");
      let name = res[i].Country;
      span.textContent = res[i].TotalConfirmed;
      li.append(span, name);
      countrylist.append(li);
    }
  }
}

var toggle = document.getElementById("toggler");

toggle.addEventListener("click", toggleNav);

function toggleNav() {
  var nav = document.querySelector(".nav");
  nav.classList.toggle("show");
}
