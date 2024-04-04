const menuBtn = document.querySelector(".btn-primary");
const repeatInput = document.querySelector(".new_pss");
const repeatInput_1 = document.querySelector(".user");
const repeatInput_2 = document.querySelector(".new_pss_rpt");
// const sendEmail = require("./utils/send_mail");

let menuOpen = false;
$("#reset").click(() => {
  // $("#loginAlert").hide();

  menuBtn.innerHTML = "Reset password";
  repeatInput.classList.add("open");
  repeatInput_1.classList.add("open");
  repeatInput_2.classList.add("sh");
  // repeatInput_1.classList.add("sh");
  // repeatInput_2.classList.add("sh");
  // document.getElementsByClassName("new_pss_rpt")[0].placeholder =
  //   "Repeat Password";
  $(".new_pss_rpt").removeAttr("required");

  menuOpen = true;
});

document.querySelector("#login").addEventListener("click", () => {
  // if ($("input[type=checkbox]").is(":checked")) {
  //$("#myform").trigger("reset");

  $("#myform").get(0).reset();

  if (!menuOpen) {
    menuBtn.innerHTML = "Login";

    repeatInput.classList.add("open");
    repeatInput_1.classList.add("open");
    repeatInput_2.classList.add("open");
    repeatInput_2.classList.remove("sh");

    document.getElementsByClassName("new_pss_rpt")[0].placeholder = "Password";
    $(".new_pss_rpt").attr("name", "passwordlogin");
    $(".new_pss_rpt").attr("required", "");

    menuOpen = true;
  } else {
    menuBtn.innerHTML = "Sign Up";
    repeatInput.classList.remove("open");
    repeatInput_1.classList.remove("open");
    repeatInput_2.classList.remove("open");
    repeatInput_2.classList.remove("sh");

    document.getElementsByClassName("new_pss_rpt")[0].placeholder =
      "Repeat Password";
    $(".new_pss_rpt").attr("name", "passwordconfirm");
    $(".new_pss_rpt").attr("required", "");

    menuOpen = false;
  }

  // document.getElementByName("userlogin").value = undefined;
  // document.getElementByName("passwordlogin").value = undefined;
});
//Modal Popup Controller
function toggle_visibility(id, href) {
  //window.location = "contact-popup";
  window.open(href, "", "width=400,height=200,scrollbars=yes");
  var e = document.getElementById(id);

  if (e.style.display == "block") e.style.display = "none";
  else e.style.display = "block";
}

function submitaction() {
  if (menuBtn.innerText == "Login") {
    document.querySelector(".form-signin").action = "/login";
  } else if (menuBtn.innerText == "Sign Up") {
    document.querySelector(".form-signin").action = "/register";
  } else {
    document.querySelector(".form-signin").action = "/reset";
  }
}
// $("#loginreset").click(() => {

//   // document.querySelector(".form-signin").action = "/login";
// });

//   const urlParams = new URLSearchParams(window.location.search);
//   const myParam = urlParams.get("error")
//     ? urlParams.get("error")
//     : urlParams.get("success");
//   // console.log(
//   //   menuOpen + " 234244 " + document.querySelector(".form-signin").action
//   // );
//   if (myParam) {
//     $("#loginAlert").text(myParam);

//     $("#loginAlert").show();
//   }
// }

$("#loginAlert").hide();
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("error")
  ? urlParams.get("error")
  : urlParams.get("success");
// console.log(
//   menuOpen + " 234244 " + document.querySelector(".form-signin").action
// );
console.log(myParam);
if (myParam) {
  if (window.location.pathname == "/login") {
    // if (menuBtn.innerText == "Login")
    menuBtn.innerHTML = "Login";

    repeatInput.classList.add("open");
    repeatInput_1.classList.add("open");
    repeatInput_2.classList.add("open");
    document.getElementsByClassName("new_pss_rpt")[0].placeholder = "Password";
    $(".new_pss_rpt").attr("name", "passwordlogin");
    menuOpen = true;
  }
  if (window.location.pathname == "/") {
    // if (menuBtn.innerText == "Login")
    menuBtn.innerHTML = "Reset password";

    repeatInput.classList.add("open");
    repeatInput_1.classList.add("open");
    repeatInput_2.classList.add("sh");
    // repeatInput_1.classList.add("sh");
    // repeatInput_2.classList.add("sh");
    // document.getElementsByClassName("new_pss_rpt")[0].placeholder =
    //   "Repeat Password";
    $(".new_pss_rpt").removeAttr("required");

    menuOpen = false;
  }
  $("#loginAlert").text(myParam);
  $("#loginAlert").show();
}
// $("myform").on("load", function () {});
