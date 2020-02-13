export default class PlaceDetail{
  constructor(options){
    options = options ||{}
    this.options = options
    
  }
  /**
   * format address
  */
  getAddess(address) {
    address_result = "";
    var separator = "";
    for (i = 0; i < address.length; i++) {
      address[i] = address[i] ? address[i] : "";
      if (address[i]) {
        address_result = address_result + separator + address[i];
        separator = ", ";
      }
    }
    return address_result;
  }
  /**
   * show detail Feature
  */
  showDetailFeature(){
    // addMarker(this.options.lat, this.options.long);
    document.getElementById('no-result').style.display = 'none';
    document.getElementById('place').style.display = 'none'
    document.getElementById("detail-feature").style.display = "block";
    let featureName = document.getElementById("feature-name");

    if(this.options.type != 'null'){
        featureName.innerHTML =this.options.name+ "<br>" + "<div class='feature-type'>" + this.options.type + "</div>";
    }else{
        featureName.innerHTML =this.options.name;
    }
    
    let address_result = getAddess(this.options.address);
    let featureCoordinates = document.getElementById("feature-coordinates");
    featureCoordinates.innerHTML =
        '<i class="fas fa-compass"></i>  ' + this.options.lat + ", " + this.options.long;
    let featureLocation = document.getElementById("feature-location");
    featureLocation.innerHTML = '<i class="fas fa-map"></i>  ' + address_result;

    document.getElementById("feature-website").innerHTML = '';
    document.getElementById("feature-opening-hours").innerHTML = ''
    document.getElementById("feature-description").innerHTML = ''
    document.getElementById("feature-phone").innerHTML = ''

    let featureWebsite = document.getElementById("feature-website");
    let featureOpening_hours = document.getElementById("feature-opening-hours");
    let featureDescription = document.getElementById("feature-description");
    let featurePhone = document.getElementById("feature-phone");


    // if (this.options.osm_id) {
    //     point_detail(this.options.osm_id, this.options.osm_type).then(detail => {
    //     detail = detail[0]

    //     let website = detail.extratags.website;
    //     let description = detail.extratags.description;
    //     let phone = detail.extratags.phone;
    //     let fax = detail.extratags.fax;
    //     let email = detail.extratags.email
    //     let level = detail.extratags.level
    //     let smoking = detail.extratags.smoking
    //     let stars = detail.extratags.stars
    //     let opening_hours = detail.extratags.opening_hours;
    //     let inrternet_access = detail.extratags.inrternet_access;
    //     if (website) {
    //         featureWebsite.innerHTML =
    //         '<i class="fas fa-home"></i>' +
    //         '<a href="{' +
    //         website +
    //         '}">' +
    //         website +
    //         " </a>";
    //         featureWebsite.className = "detail-feature-element";
    //     }
    //     if (phone) {
    //         featurePhone.innerHTML = '<i class="fas fa-phone"></i>' + phone;
    //         featurePhone.className = "detail-feature-element";
    //     }
    //     if (inrternet_access) {
    //         featureInternet_access.innerHTML = '<i class="fas fa-wifi"></i>' + inrternet_access;
    //         featureInternet_access.className = "detail-feature-element";
    //     }
    //     if (fax) {
    //         featureFax.innerHTML = '<i class="fas fa-fax"></i>' + fax;
    //         featureFax.className = "detail-feature-element";
    //     }
    //     if (email) {
    //         featureEmail.innerHTML = '<i class="fas fa-envelope"></i>' + email;
    //         featureEmail.className = "detail-feature-element";
    //     }
    //     if (level) {
    //         featureLevel.innerHTML = '<i class="fas fa-layer-group"></i>' + level;
    //         featureLevel.className = "detail-feature-element";
    //     }
    //     if (smoking) {
    //         featureSmoking.innerHTML = '<i class="fas fa-smoking-ban"></i>' + smoking;
    //         featureSmoking.className = "detail-feature-element";
    //     }
    //     if (stars) {
    //         featureStars.innerHTML = '<i class="fas fa-star"></i>' + stars;
    //         featureStars.className = "detail-feature-element";
    //     }
    //     if (description) {
    //         featureDescription.innerHTML = description;
    //         featureDescription.style.borderBottom = "1px solid lightgray";
    //         featureDescription.className = "detail-feature-element";
    //         featureDescription.style.marginTop = "0px";
    //     }
    //     if (opening_hours) {
    //         let opening_hour = opening_hours
    //         .replace(/Th/gi, "Thứ 5")
    //         .replace(/Mo/gi, "Thứ 2")
    //         .replace(/Tu/gi, "Thứ 3")
    //         .replace(/We/gi, "Thứ 4")
    //         .replace(/Fr/gi, "Thứ 6")
    //         .replace(/Sa/gi, "Thứ 7")
    //         .replace(/Su/gi, "Chủ nhật")
    //         .replace(/;/gi, "<br>");
    //         featureOpening_hours.innerHTML =
    //         '<i class="fas fa-hourglass-start"></i> <span>' +opening_hour +'</span>';
    //         featureOpening_hours.className = "detail-feature-element";
    //     }

    //     });
    // } else {
    //     featureDescription.innerHTML = "";
    //     featureDescription.classList.remove("detail-feature-element");
    //     featureOpening_hours.innerHTML = "";
    //     featureOpening_hours.classList.remove("detail-feature-element");
    //     featurePhone.innerHTML = "";
    //     featurePhone.classList.remove("detail-feature-element");
    //     featureFax.innerHTML = "";
    //     featureFax.classList.remove("detail-feature-element");
    //     featureEmail.innerHTML = "";
    //     featureEmail.classList.remove("detail-feature-element");
    //     featureLevel.innerHTML = "";
    //     featureLevel.classList.remove("detail-feature-element");
    //     featureSmoking.innerHTML = "";
    //     featureSmoking.classList.remove("detail-feature-element");
    //     featureStars.innerHTML = "";
    //     featureStars.classList.remove("detail-feature-element");
    //     featureInternet_access.innerHTML = "";
    //     featureInternet_access.classList.remove("detail-feature-element");
    //     featureWebsite.innerHTML = "";
    //     featureWebsite.classList.remove("detail-feature-element border-top");
    // }
    // updateDetailFeatureUrlParams(this.options.name, this.options.type, this.options.lat, this.options.long, this.options.address, this.options.osm_id, this.options.osm_type);
  }

}