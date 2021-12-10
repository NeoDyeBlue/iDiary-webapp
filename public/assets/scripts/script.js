function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
}

// gapi.load("auth2", function () {
//   gapi.auth2.init();
// });

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".c-entries__on-date",
  start: "top top",
  end: "bottom 150px",
  pin: ".c-entries__date-indicator",
});
