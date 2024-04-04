// to get current year
function getYear() {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  document.querySelector("#displayYear").innerHTML = currentYear;
}

// function get_cart_item_number(cart) {
//   // let count=0;
//   // for(let i=0;i<cart.length;i++){
//   //     count+=cart[0].quantity
//   // }
//   //   $('#cartitemnumber').text("count");
// }

// // isotope js
$(window).on("load", function () {
  var $grid = $(".grid").isotope({
    itemSelector: ".all",
    percentPosition: false,
    masonry: {
      columnWidth: ".all",
    },
  });
  $(".filters_menu li").click(function () {
    $(".filters_menu li").removeClass("active");
    $(this).addClass("active");

    var data = $(this).attr("data-filter");
    $grid.isotope({
      filter: data,
    });
  });
});

$("#clickq").click(function (e) {
  e.preventDefault();
  //})
  //   $("#myinput")
  //     // .append('<input type="text" placeholder="Enter item to search"/> ')
  //     .show();
  // });
  $("#asd").toggleClass("showElement");
  // $("#asd").css("transition", "width 5s ease-in-out !important");
  // $(window).on("load", function () {

  var value = document.getElementById("asd").value.toLowerCase();
  if (
    value == "burger" ||
    value == "pizza" ||
    value == "pasta" ||
    value == "fries"
  ) {
    $(".filters_menu li").removeClass("active");
    // $(".filters_menu li:nth-child(1)").addClass("active");

    $(".filters_menu li").each(function () {
      //attr("data-filter")) {
      // $(".filters_menu li:nth-child(i)").addClass("active");
      var product = $(this);

      // var item = $(".filters_menu li:nth-child(i)").attr("data-filter");
      var data = $(this).attr("data-filter");
      if (data == "." + value) {
        $(this).addClass("active");
        $grid.isotope({
          filter: data,
        });

        document.getElementById("scrollhere").scrollIntoView();
        document.getElementById("asd").value = "";
      }
    });
  }
});

// nice select
$(document).ready(function () {
  $("select").niceSelect();
});

/** google_map js **/
function myMap() {
  var mapProp = {
    center: new google.maps.LatLng(40.712775, -74.005973),
    zoom: 4,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  var map2 = new google.maps.Map(
    document.getElementById("googleMap2"),
    mapProp
  );

  var marker = new google.maps.Marker({ position: mapProp.center });
  var marker2 = new google.maps.Marker({ position: mapProp.center });

  marker.setMap(map);

  marker2.setMap(map2);

  google.maps.event.addListener(marker, "click", function () {
    map.setZoom(6);
    map.setCenter(marker.getPosition());
  });
  google.maps.event.addListener(marker2, "click", function () {
    map2.setZoom(6);
    map2.setCenter(marker2.getPosition());
  });
}
// client section owl carousel
$(".client_owl-carousel").owlCarousel({
  loop: true,
  margin: 0,
  dots: false,
  nav: true,
  navText: [],
  autoplay: true,
  autoplayHoverPause: true,
  navText: [
    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
    '<i class="fa fa-angle-right" aria-hidden="true"></i>',
  ],
  responsive: {
    0: {
      items: 1,
    },
    768: {
      items: 2,
    },
    1000: {
      items: 2,
    },
  },
});

////Readmore function to show hidden book details
function myFunction(test) {
  var x = document.getElementById(test);
  x.classList.toggle("showElement");
}

$("#check").click(function () {
  if (document.getElementById("check").checked == false) {
    document.getElementById("checkout-name1").value = "";
    document.getElementById("checkout-email1").value = "";
    document.getElementById("checkout-phone1").value = "";

    document.getElementById("checkout-city1").value = "";

    document.getElementById("checkout-address1").value = "";
    var x = document.getElementById("checkout-form2");
    x.classList.toggle("showNotes");
  } else {
    document.getElementById("checkout-name1").value =
      document.getElementById("checkout-name").value;
    document.getElementById("checkout-email1").value =
      document.getElementById("checkout-email").value;

    document.getElementById("checkout-phone1").value =
      document.getElementById("checkout-phone").value;

    document.getElementById("checkout-city1").value =
      document.getElementById("checkout-city").value;

    document.getElementById("checkout-address1").value =
      document.getElementById("checkout-address").value;
  }
});
// window.history.pushState(null, null, "/dashboard");
// window.onpopstate = function () {
//   if (window.location.pathname == "/dashboard") {
//     window.history.pushState(null, null, "/dashboard");
//     window.history.go(1);
//   }
// // };
//  if (window.location.pathname == "/dashboard") {

// history.pushState(null, null, "dashboard");}
// if (window.location.pathname == "/dashboard") {
//   window.onpopstate = function (event) {
//     window.history.go();
//   };
// }
// window.onbeforeunload = function () {
//   if (window.location.pathname == "/dashboard") {
//     return "sorry, Your some work will be lost - really sorry.";
//   }
// };
// function disableBack() {
// window.history.
// if (window.location.pathname == "/dashboard") {
//   window.history.pushState(null, null, window.location.href);
//   window.history.go(0);
//   // }
// }
// setTimeout("disableBack()", 0);

// window.onpopstate = function () {
//   window.history.go(1);
// };
// function disableBack() {
//   if (window.location.pathname == "/dashboard") window.history.go();
// }
// setTimeout("disableBack()", 0);
// window.onunload = function () {
//   null;
// };

// $("#loginAlert").hide();
// const urlParams = new URLSearchParams(window.location.search);
// const myParam = urlParams.get("error");
// // console.log(
// //   menuOpen + " 234244 " + document.querySelector(".form-signin").action
// // );
// console.log(myParam);
// if (myParam) {
//   $("#loginAlert").text(myParam);
//   $("#loginAlert").show();
//   if (window.location.pathname == "/login") {
//     // if (menuBtn.innerText == "Login")
//     console.log(menuBtn.innerHTML + "sdss");

//     menuBtn.innerHTML = "Login";

//     repeatInput.classList.add("open");
//     repeatInput_1.classList.add("open");
//     repeatInput_2.classList.add("open");
//     document.getElementsByClassName("new_pss_rpt")[0].placeholder = "Password";
//     $(".new_pss_rpt").attr("name", "passwordlogin");
//     // menuOpen = true;
//   }
// }
// function preventBack() {
//   // window.history.go(1);
//   window.history.pushState(null, null, "/dashboard");
//   window.addEventListener("popstate", function (event) {
//     window.history.pushState(null, null, "/dashboard");
//   });
// }
// if (window.location.pathname == "/dashboard") {
//   setTimeout("preventBack()", 0);
// }
// function DisableBackButton() {
//   window.history.go(1);
// }
// // DisableBackButton();
// if (window.location.pathname == "/dashboard") {
//   window.onload = DisableBackButton;
//   window.onpageshow = function (evt) {
//     if (evt.persisted) DisableBackButton();
//   };
//   window.onload = function () {
//     void 0;
//   };
// }
// if (window.location.pathname == "/dashboard") {
// history.pushState(null, null, "/dashboard");
var CurrentPageURL;
var PreviousPageURL;
if (CurrentPageURL != null) {
  PreviousPageURL = CurrentPageURL;
}
CurrentPageURL = window.location;
console.log(CurrentPageURL + "hjh" + PreviousPageURL + "sdsdsd");

// Session["CurrentPageURL"] = Request.Url;
// window.history.pushState(null, null, "/dashboard");

// window.addEventListener("popstate", function (event) {
//   window.history.pushState(null, null, "/dashboard");
// function DisableBackButton() {
//   window.history.pushState(null, null, "/dashboard");
//   window.history.go(1);
// }
// if (PreviousPageURL == "http://localhost") {
//   DisableBackButton();
// }
// });
// window.addEventListener("popstate", function (event) {
//   console.log(document.referrer + "sdsdsd");

//   if (window.location.pathname == "/dashboard") {
//     if (document.referrer == PreviousPageURL) {
//       window.history.go(1);
//     }
//   }
//   // window.location = "/dashboard";
// });
