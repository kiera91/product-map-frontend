var map;

$( document ).ready(function() {
    // drawMap()

    var socket = new WebSocket("ws://localhost:4567");

    socket.onmessage = function(e) {
        // sortThroughData(e.data);
    };

    socket.onopen = function(e) {
        console.log("Connection established!");
        socket.send('Hello Me!');
    };
});
 

var openUrl = function(url) {
    window.location.assign(url);
}

function getRecentProducts() {
    // socket.send("{\"action\": \"products\"}");
}

function sortThroughData(data) {
    var parsedData = JSON.parse(data);
    var firstElement = parsedData["productData"][0];
    firstElement = JSON.parse(firstElement);
    var lat = firstElement.lat;
    var longitude = firstElement.long;
    var productImage = firstElement.image_url;
    var productName = firstElement.product_name;
    var productUrl = firstElement.http_referer;

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
        colour: 'Red',
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

    var overlay = new customMarker(
     new google.maps.LatLng( 51.6711, -1.2828 ),
    {
        img: "http://asset2.marksandspencer.com/is/image/mands/F14A_00962339_IS",
        name: "White Rose & Freesia Wedding Flowers - Collection 1",
        product_link: "https://www.marksandspencer.com",
        marker_id: '123',
        colour: 'Red',
        navigateToProduct: openUrl
    });
    
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

                alert(self.latlng);
                self.args.navigateToProduct(self.args.product_link);
            });
                
            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
        }
        
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
