/* eslint-disable no-undef */
var marker_p = [
    {
        "Latitude": 40.685756
        , "Longitude": -73.924138
        , "Idn": 336
        , "Idf": 1233
    },
    {
        "Latitude": 40.685756
        , "Longitude": -73.924138
        , "Idn": 336
        , "Idf": 604
    },
    {
        "Latitude": 40.706316
        , "Longitude": -73.750920
        , "Idn": 331
        , "Idf": 1114
    },
];
var poly1 = [
    {
    "Latitude": 40.685756
    ,"Longitude": -73.924138
    ,"Idf": 1233
    },
    {
    "Latitude": 40.639723
    ,"Longitude": -73.943811
    ,"Idf": 1233
    },
    {
    "Latitude": 40.685756
    ,"Longitude": -73.924138
    ,"Idf": 604
    },
    {
    "Latitude": 40.635539
    ,"Longitude": -73.922452
    ,"Idf": 604
    },
    {
    "Latitude": 40.706316
    ,"Longitude": -73.750920
    ,"Idf": 1114
    },
    {
    "Latitude": 40.704941
    ,"Longitude": -73.756038
    ,"Idf": 1114
    }
    ];

for (var j = 0; j < marker_p.length; j++) {
    var objs = marker_p[j];
    var p_f = objs[3];

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(objs.Latitude, objs.Longitude),
        map: map,
        icon: 'icon.png'
    });

    marker.setVisible(true);

    markern.push(marker);

}

var markerf = [];

for (var w = 0; w < poly1.length - 1; w += 2) {

    var objw = poly1[w];
    var p_f2 = objw[2];
    var fluxup = new google.maps.LatLng(objw.Latitude, objw.Longitude);

    var objw2 = poly1[w + 1];
    var fluxuq = new google.maps.LatLng(objw2.Latitude, objw2.Longitude);

    var mypath5 = [fluxup, fluxuq];

    var test5 = new google.maps.Polyline({
        path: mypath5,
        geodesic: true,
        strokeColor: 'red',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    test5.setMap(map);

    markerf.push(test5);
}

function addClicker(marker, contentn) {
    var infowindow = new google.maps.InfoWindow({ content: contentn });
    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
        marker.setIcon('icon.png');
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open();
        marker.setIcon('icon_active.png');
        if (p_f == p_f2) {
            test5.setMap(map);
        }
    });
}