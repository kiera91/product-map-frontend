var map;

$( document ).ready(function() {
    // drawMap()

    var socket = new WebSocket("ws://localhost:4567");

    socket.onmessage = function(e) {
        sortThroughData(e.data);
    };

    socket.onopen = function(e) {
        console.log("Connection established!");
        socket.send('Hello Me!');
    };
});
 

var openUrl = function(url) {
    window.location.assign(url);
};

function getRecentProducts() {
    // socket.send("{\"action\": \"products\"}");
}

function sortThroughData(data) {
            console.log(data);

    var parsedData = JSON.parse(data);
    console.log("2");
    var firstElement = parsedData["productData"][0];
    console.log(firstElement);
    firstElement = JSON.parse(firstElement);
console.log("4");
    for(var i = 0; i < parsedData["productData"]; i++) {
        console.log("asdasdsad");
        setTimeout(function() { extractProductData(parsedData["productData"][i]); }, 5000);
    }
}

function extractProductData(product) {
    var lat = product.lat;
    var longitude = product.long;
    var productImage = product.image_url;
    var productName = product.product_name;
    var productUrl = product.http_referer;

    addProductToMap(lat, longitude, productName, productImage, productUrl);
}

function customMarker(latlng, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

function addProductToMap(lat, long, name, imageUrl, productUrl) {
    var newLatlng = new google.maps.LatLng( lat, long );
    var overlay = new customMarker(
    newLatlng,
    {
        img: imageUrl,
        name: name,
        product_url: productUrl,
        marker_id: '123',
        navigateToProduct: openUrl
    });
}

function initialize() {
    var myLatlng = new google.maps.LatLng(51.6711, -1.2828);
    var mapOptions = {
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 6,
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    customMarker.prototype = new google.maps.OverlayView();

    customMarker.prototype.draw = function() {
        var self = this;
        var div = this.div;
        
        if (!div) {
            div = this.div = document.createElement('div');
            div.id = 'marker';
            div.style.cursor = 'pointer';

            var aTag = document.createElement('a');
            aTag.setAttribute('href', self.args.product_link);
            aTag.altText = self.args.name;
            div.appendChild(aTag);

            var img = document.createElement('img');
            img.className = "marker_image";
            img.src = self.args.img;
            div.appendChild(img);

            if(typeof(self.args.marker_id) !== 'undefined') {
                div.dataset.marker_id = self.args.marker_id;
            }

            google.maps.event.addDomListener(div, "click", function(event) {
                google.maps.event.trigger(self, "click");

                self.args.navigateToProduct(self.args.product_link);
            });
                
            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);

        }
        
        setTimeout(function() { self.remove(); }, 10000);
        
        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    
        if (point) {
            div.style.left = (point.x - 50) + 'px';
            div.style.top = (point.y - 145) + 'px';
        }
    };


    customMarker.prototype.remove = function() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    };
    
    customMarker.prototype.getPosition = function() {
        return this.latlng;
    };
}
