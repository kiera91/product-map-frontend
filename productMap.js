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

    addProductToMap(lat, longitude, productName, productImage);
}

function customMarker(latlng, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

function addProductToMap(lat, long, name, image_url) {
    var newLatlng = new google.maps.LatLng( lat, long );
    
    var overlay = new customMarker(
    newLatlng, 
    {
        img: image_url,
        name: name,
        marker_id: '123',
        colour: 'Red'
    });
}

function initialize() {
    var myLatlng = new google.maps.LatLng(51.6711, -1.2828);
    var mapOptions = {
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 13,
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    customMarker.prototype = new google.maps.OverlayView();
    
    customMarker.prototype.draw = function() 
    {
        var self = this;
        var div = this.div;
        
        if (!div) {
            div = this.div = document.createElement('div');
            div.id = 'marker';
            div.style.width = '100px';
            div.style.height = '100px';
            div.style.cursor = 'pointer';
    
            var div_pointer = document.createElement('div');
            div_pointer.className = 'triangle';
    
            var image_container = document.createElement('div');
            image_container.className = 'image_container';
    
            var img = document.createElement('img');
            img.className = "marker_image";
            img.src = self.args.img;
    
            var name_container = document.createElement('div');
            name_container.className = 'name_container';
    
            var text = document.createElement('p');
            text.innerText = self.args.name;
            text.className = 'text';
    
            div.appendChild(image_container);
            image_container.appendChild(img);
            div.appendChild(div_pointer);
            div.appendChild(name_container);
            name_container.appendChild(text);

            if(typeof(self.args.marker_id) !== 'undefined') {
                div.dataset.marker_id = self.args.marker_id; 
            }

            google.maps.event.addDomListener(div, "click", function(event) { 
                google.maps.event.trigger(self, "click");

                alert(self.latlng);
            });
                
            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
        }
        
        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    
        if (point) {
            div.style.left = (point.x - 50) + 'px';
            div.style.top = (point.y - 125) + 'px';
        }
    }
    
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
