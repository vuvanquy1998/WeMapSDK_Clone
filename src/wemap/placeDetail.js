import API from "./api";
import WeGeocoder from "./geocoder";

export default class PlaceDetail{
  // name, type, lat, lon, address, osm_id, osm_type
  constructor(options){
    options = options ||{}
    this.options = options
    // self=this
  }

  setAttribute(options){
    this.options = options
  }
  



  /**
   * show detail Feature
  */
  showDetailFeature(){
    // // addMarker(this.options.lat, this.options.long);
    // document.getElementById('no-result').style.display = 'none';
    // // document.getElementById('place').style.display = 'none'
    document.getElementById("wemap-detail-feature").style.display = "block";
    let featureName = document.getElementById("wemap-feature-name");
    let type = this.options.type
    let lat = this.options.lat
    let lon = this.options.lon
    let name = this.options.name
    if(this.options.type != 'null'){
        featureName.innerHTML = name+ "<br>" + "<div class='wemap-feature-type'>" + type + "</div>";
    }else{
        featureName.innerHTML = name;
    }
    let address = this.options.address
    var address_result = WeGeocoder.getAddress(address)
    let featureCoordinates = document.getElementById("feature-coordinates");
    featureCoordinates.innerHTML =
        '<i class="fa fa-compass"></i>  ' + lat + ", " + lon;
    let featureLocation = document.getElementById("feature-location");
    featureLocation.innerHTML = '<i class="fa fa-map"></i>  ' + address_result;
    
    // document.getElementById("feature-website").innerHTML = '';
    // document.getElementById("feature-opening-hours").innerHTML = ''
    // document.getElementById("feature-description").innerHTML = ''
    // document.getElementById("feature-phone").innerHTML = ''

    let featureWebsite = document.getElementById("feature-website");
    let featureOpening_hours = document.getElementById("feature-opening-hours");
    let featureDescription = document.getElementById("feature-description");
    let featurePhone = document.getElementById("feature-phone");

    let osmid = this.options.osm_id
    let osmtype = this.options.osm_type
    
    if(osmid){
      var key = 'vpstPRxkBBTLaZkOaCfAHlqXtCR'
      API.lookup({osmId: osmid, osmType: osmtype, key: key}, (data) => {

        let detail = data
        // let website = detail.extratags.website;
        // let description = detail.extratags.description;
        // let phone = detail.extratags.phone;
        // let fax = detail.extratags.fax;
        // let email = detail.extratags.email
        // let level = detail.extratags.level
        // let smoking = detail.extratags.smoking
        // let stars = detail.extratags.stars
        // let opening_hours = detail.extratags.opening_hours;
        // let inrternet_access = detail.extratags.inrternet_access;
        // if (website) {
        //   featureWebsite.innerHTML =
        //     '<i class="fas fa-home"></i>' +
        //     '<a href="{' +
        //     website +
        //     '}">' +
        //     website +
        //     " </a>";
        //   featureWebsite.className = "wemap-detail-feature-element";
        // }else{
        //   featureWebsite.innerHTML = "";
        //   featureWebsite.classList.remove("wemap-detail-feature-element wemap-border-top");
        // }
        // if (phone) {
        //   featurePhone.innerHTML = '<i class="fas fa-phone"></i>' + phone;
        //   featurePhone.className = "wemap-detail-feature-element";
        // }else{
        //   featurePhone.innerHTML = "";
        //   featurePhone.classList.remove("wemap-detail-feature-element");
        // }
        // // if (inrternet_access) {
        // //   featureInternet_access.innerHTML = '<i class="fas fa-wifi"></i>' + inrternet_access;
        // //   featureInternet_access.className = "wemap-detail-feature-element";
        // // }else{
        // //   featureInternet_access.innerHTML = "";
        // //   featureInternet_access.classList.remove("wemap-detail-feature-element");
        // // }
        // // if (fax) {
        // //   featureFax.innerHTML = '<i class="fas fa-fax"></i>' + fax;
        // //   featureFax.className = "wemap-detail-feature-element";
        // // }else{
        // //   featureFax.innerHTML = "";
        // //   featureFax.classList.remove("wemap-detail-feature-element");
        // // }
        // // if (email) {
        // //   featureEmail.innerHTML = '<i class="fas fa-envelope"></i>' + email;
        // //   featureEmail.className = "wemap-detail-feature-element";
        // // }else{
        // //   featureEmail.innerHTML = "";
        // //   featureEmail.classList.remove("wemap-detail-feature-element");
        // // }
        // // if (level) {
        // //   featureLevel.innerHTML = '<i class="fas fa-layer-group"></i>' + level;
        // //   featureLevel.className = "wemap-detail-feature-element";
        // // }else{
        // //   featureLevel.innerHTML = "";
        // //   featureLevel.classList.remove("wemap-detail-feature-element");
        // // }
        // // if (smoking) {
        // //   featureSmoking.innerHTML = '<i class="fas fa-smoking-ban"></i>' + smoking;
        // //   featureSmoking.className = "wemap-detail-feature-element";
        // // }else{
        // //   featureSmoking.innerHTML = "";
        // //   featureSmoking.classList.remove("wemap-detail-feature-element");
        // // }
        // // if (stars) {
        // //   featureStars.innerHTML = '<i class="fas fa-star"></i>' + stars;
        // //   featureStars.className = "wemap-detail-feature-element";
        // // }else{
        // //   featureStars.innerHTML = "";
        // //   featureStars.classList.remove("wemap-detail-feature-element");
        // // }
        // if (description) {
        //   featureDescription.innerHTML = description;
        //   featureDescription.style.borderBottom = "1px solid lightgray";
        //   featureDescription.className = "wemap-detail-feature-element";
        //   featureDescription.style.marginTop = "0px";
        // }else{
        //   featureDescription.innerHTML = "";
        //   featureDescription.classList.remove("wemap-detail-feature-element");
        // }
        // if (opening_hours) {
        //   let opening_hour = opening_hours
        //     .replace(/Th/gi, "Thứ 5")
        //     .replace(/Mo/gi, "Thứ 2")
        //     .replace(/Tu/gi, "Thứ 3")
        //     .replace(/We/gi, "Thứ 4")
        //     .replace(/Fr/gi, "Thứ 6")
        //     .replace(/Sa/gi, "Thứ 7")
        //     .replace(/Su/gi, "Chủ nhật")
        //     .replace(/;/gi, "<br>");
        //   featureOpening_hours.innerHTML =
        //     '<i class="fas fa-hourglass-start"></i> <span>' +opening_hour +'</span>';
        //   featureOpening_hours.className = "wemap-detail-feature-element";
        // }else{
        //   featureOpening_hours.innerHTML = "";
        //   featureOpening_hours.classList.remove("wemap-detail-feature-element");
        // }
      });
    }
    document.getElementById('wemap-feature-directions').onclick =  function(e){
      WeGeocoder.hideDetailFeatureFrame()
      wemapgl.urlController.updateParams("route", {ox: null, oy: null, dx: lat, dy: lon})
    }
    
    wemapgl.urlController.updateParams("place", {name, type, lat, lon, address, osmid, osmtype})
  }

    // _showDetailFeature() {
    //   // TODO: Need fix
    //     // document.getElementById("wemap-detail-feature").style.display = "block";
    //     // wemapgl.urlController.updateParams("route", {ox: null, oy: null, dx: lat, dy: long})

    // }
}
