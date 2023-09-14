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
