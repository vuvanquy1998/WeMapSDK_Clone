import API from "./api";
import WeGeocoder from "./geocoder";
/**
 * @class PlaceDetail
 * handle event show place info detail
 */
export default class PlaceDetail {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.key = this.options.key;
    }

    setAttribute(options) {
        this.options = options;
    }

    /**
     * show info of place
     */
    showDetailFeature() {
        const featureDetail = document.getElementById("wemap-detail-feature");
        featureDetail.style.display = "block";
        let type = this.options.type;
        let lat = this.options.lat;
        let lon = this.options.lon;
        let name = this.options.name;
        let address = this.options.address;
        let address_result = WeGeocoder.getAddress(address);
        let osmid = this.options.osm_id;
        let featureName = document.getElementById("wemap-feature-name");
        let featureLocation = document.getElementById("feature-location");
        let featureCoordinates = document.getElementById("feature-coordinates");

        featureName.innerHTML = name;
        featureCoordinates.innerHTML =
            '<i class="fa fa-compass"></i>  ' + lon + ", " + lat;
        featureLocation.innerHTML =
            '<i class="fa fa-map"></i>  ' + address_result;

        this.showAdvanceDetailFeature(osmid);

        wemapgl.urlController.updateParams("place", {
            name,
            type,
            lat,
            lon,
            address,
            osmid
        });
        document.getElementById("wemap-feature-directions").onclick = function(){
            WeGeocoder.initEventDirection(lat, lon)
        }
    }
    /**
     * show Information extended of place
     * @param osmid 
     */
    showAdvanceDetailFeature(osmid) {
        if (!osmid) {
            return;
		}
        const key = this.key;
        API.lookup({ osmId: osmid, key: key }, result => {
            if (result && result[0] && result[0].extratags) {
				let featureWebsite = document.getElementById("feature-website");
				let featureOpening_hours = document.getElementById("feature-opening-hours");
				let featureDescription = document.getElementById("feature-description");
				let featurePhone = document.getElementById("feature-phone");
				let featureInternetAccess = document.getElementById("feature-internt-access");
				let featureFax = document.getElementById("feature-fax");
				let featureEmail = document.getElementById("feature-email");
				let featureLevel = document.getElementById("feature-level");
				let featureSmoking = document.getElementById("feature-smoking");
				let featureStars = document.getElementById("feature-stars");
                let data = result[0].extratags;
                let website = data.website;
                let description = data.description;
                let phone = data.phone;
                let fax = data.fax;
                let email = data.email;
                let level = data.level;
                let smoking = data.smoking;
                let stars = data.stars;
                let opening_hours = data.opening_hours;
                let inrternet_access = data.inrternet_access;
                if (website) {
                    featureWebsite.innerHTML =
                        '<i class="fas fa-home"></i>' +
                        '<a href="{' +website +'}">' + website + " </a>";
                    featureWebsite.className = "wemap-detail-feature-element";
                } else {
                    featureWebsite.innerHTML = "";
                    featureWebsite.classList.remove(
                        "wemap-detail-feature-element"
                    );
                    featureWebsite.classList.remove("wemap-border-top");
                }
                if (phone) {
                    featurePhone.innerHTML =
                        '<i class="fas fa-phone"></i>' + phone;
                    featurePhone.className = "wemap-detail-feature-element";
                } else {
                    featurePhone.innerHTML = "";
                    featurePhone.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
                if (inrternet_access) {
                    featureInternetAccess.innerHTML =
                        '<i class="fas fa-wifi"></i>' + inrternet_access;
                    featureInternetAccess.className =
                        "wemap-detail-feature-element";
                } else {
                    featureInternetAccess.innerHTML = "";
                    featureInternetAccess.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
                if (fax) {
                    featureFax.innerHTML = '<i class="fas fa-fax"></i>' + fax;
                    featureFax.className = "wemap-detail-feature-element";
                } else {
                    featureFax.innerHTML = "";
                    featureFax.classList.remove("wemap-detail-feature-element");
                }
                if (email) {
                    featureEmail.innerHTML =
                        '<i class="fas fa-envelope"></i>' + email;
                    featureEmail.className = "wemap-detail-feature-element";
                } else {
                    featureEmail.innerHTML = "";
                    featureEmail.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
                if (level) {
                    featureLevel.innerHTML =
                        '<i class="fas fa-layer-group"></i>' + level;
                    featureLevel.className = "wemap-detail-feature-element";
                } else {
                    featureLevel.innerHTML = "";
                    featureLevel.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
                if (smoking) {
                    featureSmoking.innerHTML =
                        '<i class="fas fa-smoking-ban"></i>' + smoking;
                    featureSmoking.className = "wemap-detail-feature-element";
                } else {
                    featureSmoking.innerHTML = "";
                    featureSmoking.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
                if (stars) {
                    featureStars.innerHTML =
                        '<i class="fas fa-star"></i>' + stars;
                    featureStars.className = "wemap-detail-feature-element";
                } else {
                    featureStars.innerHTML = "";
                    featureStars.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
                if (description) {
                    featureDescription.innerHTML = description;
                    featureDescription.style.borderBottom =
                        "1px solid lightgray";
                    featureDescription.className =
                        "wemap-detail-feature-element";
                    featureDescription.style.marginTop = "0px";
                } else {
                    featureDescription.innerHTML = "";
                    featureDescription.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
                if (opening_hours) {
                    let opening_hour = opening_hours
                        .replace(/Th/gi, "Thứ 5")
                        .replace(/Mo/gi, "Thứ 2")
                        .replace(/Tu/gi, "Thứ 3")
                        .replace(/We/gi, "Thứ 4")
                        .replace(/Fr/gi, "Thứ 6")
                        .replace(/Sa/gi, "Thứ 7")
                        .replace(/Su/gi, "Chủ nhật")
                        .replace(/;/gi, "<br>");

                    featureOpening_hours.innerHTML =
                        '<i class="fas fa fa-clock-o"></i> <span>' +
                        opening_hour +
                        "</span>";
                    featureOpening_hours.className =
                        "wemap-detail-feature-element";
                } else {
                    featureOpening_hours.innerHTML = "";
                    featureOpening_hours.classList.remove(
                        "wemap-detail-feature-element"
                    );
                }
            }
        });
    }
}
