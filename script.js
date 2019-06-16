$(function(){

    // if (navigator.geolocation) {
    //   //Geolocation APIを利用できる環境向けの処理
    //   navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    // } else {
    //   //Geolocation APIを利用できない環境向けの処理
    //   alert("GPS情報が利用できません");
    // }    
  
    // function successCallback(position) {
      
    // }
    
    // function errorCallback(error) {
    //   alert("位置情報取得に失敗失敗しました。");
    // }
    
    // 中心
    var lat = 42.0009997;
    var lon = 140.5993356;
    
    var map = L.map('mapid',{zoomControl:false}).setView([lat, lon], 14);
    map.on('click', function(e) {
      console.log(e.latlng);
    });

    L.control.scale({maxWidth:200,position:'bottomright',imperial:false}).addTo(map);
    L.control.zoom({position:'bottomleft'}).addTo(map);
    
    //OSMレイヤー追加
    // L.tileLayer(
    // 	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // 	{
    // 		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    // 		maxZoom: 18
    // 	}
    // ).addTo(map);
  
    //地理院地図の標準地図タイル
    var gsi =L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', 
      {attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"});
    //地理院地図の淡色地図タイル
    var gsipale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
      {attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>地理院タイル</a>"});
    //オープンストリートマップのタイル
    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {  attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors" });

    //MIERUNE
    var key="eRZijptsy7cnMXHaK646D5SZ-J9MnAhj7wXkTort5GJyptbx0eNXWpOjILRgeGgF";
    var m_normal = L.tileLayer('https://tile.cdn.mierune.co.jp/styles/normal/{z}/{x}/{y}.png' + '?key=' + key , 
      { attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL." });
    var m_bright = L.tileLayer('https://tile.cdn.mierune.co.jp/styles/bright/{z}/{x}/{y}.png' + '?key=' + key , 
      { attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL." });
    var m_gray = L.tileLayer('https://tile.cdn.mierune.co.jp/styles/gray/{z}/{x}/{y}.png' + '?key=' + key , 
      { attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL." });
    var m_blue = L.tileLayer('https://tile.cdn.mierune.co.jp/styles/blue/{z}/{x}/{y}.png' + '?key=' + key , 
      { attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL." });
    var m_plus = L.tileLayer('https://tile.cdn.mierune.co.jp/styles/MIERUNE/{z}/{x}/{y}.png' + '?key=' + key , 
      { attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL." });

    //baseMapsオブジェクトのプロパティに3つのタイルを設定
    var baseMaps = {
      "地理院地図" : gsi,
      "淡色地図" : gsipale,
      "オープンストリートマップ"  : osm,
      "MIERUNE NORMAL": m_normal,
      "MIERUNE BRIGHT": m_bright,
      "MIERUNE GRAY": m_gray,
      "MIERUNE BLUE": m_blue,
      "MIERUNE Color+": m_plus,
    };
    //layersコントロールにbaseMapsオブジェクトを設定して地図に追加
    //コントロール内にプロパティ名が表示される
    L.control.layers(baseMaps).addTo(map);
    m_normal.addTo(map);
    
    
    // TODO load json
    var jsonData = getJsonData([
      {name: "熊太郎", color: "#FF0000", image: 'https://cinema.ne.jp/wp-content/uploads/2018/01/5434957842_ca9d85fe20_b-760x406.jpg'}, 
      {name: "熊次郎", color: "#C400CC", image: 'http://www.worldfolksong.com/closeup/bear/img/bears02.jpg'}, 
      {name: "リラックマ", color: "#FFB74C", image: "https://free-webdesigner.com/fw/wp-content/uploads/2015/03/rilakkuma4.gif"}
    ], 60);
    var names = jsonData.map(function(json) {
      return json.name;
    });
    names = $.unique(names);
    $.each(names, function(i, n) {
      $(".dropdown-menu").append('<li><button class="dropdown-item" value="' + n + '">' + n + '</button></li>');
    });
    
    // var marker = L.marker([lat, lon]).addTo(map);
    // marker.bindPopup("<b>Here!</b>").openPopup();
    
    // Marker（ピン）を追加する
    var markers = [];
    
    function showMarker(jsonData) {
      $.each(jsonData, function(i, json) {
        // var marker = L.marker([json.latitude, json.longitude], {title: json.name}).addTo(map);
        var marker = L.circleMarker([json.latitude, json.longitude], {
                        title: json.name,
                        radius: 7,
                        color: 'blue',
                        fillColor: json.color,
                        fillOpacity: 0.5
                    }).addTo(map);
  
        //ポップアップする文字（HTML可、ここでは画像を表示）
        var sucontents = json.name + "です<br><img src='" + json.image + "' width='500' height='375'>"
        //ポップアップオブジェクトを作成
        var popup = L.popup({ maxWidth: 550 }).setContent(sucontents);      
        marker.bindPopup(popup);
  
        markers.push(marker);
      });
    }
    
    function removeMarkers() {
      $.each(markers, function(index, marker) {
        map.removeLayer(marker);
      });
      markers = [];
    }
    
    showMarker(jsonData);
    
    $('.dropdown-menu .dropdown-item').click(function(){
      var visibleItem = $('.dropdown-toggle', $(this).closest('.dropdown'));
      var selected = $(this).attr('value');
      var data = [];
      if (selected) {
        data = jsonData.filter(function(element, index, array) {
          return (element.name == selected);
        });
      } else {
        selected = "すべての熊";
        data = jsonData;
      }
      visibleItem.text(selected);
      
      removeMarkers();
      showMarker(data);
    });
    
    
  
    function getJsonData(names, numberOfData) {
      var jsonData = [];
      
      $.each(names, function(index, name) {
        var iconColor = randColor();
        for (var i = 0; i < numberOfData; i++) {
          var lat = randRange(41.9760000, 42.0260887);
          var lon = randRange(140.5401134, 140.6586456);
          // alert(lat);
          var json = {
            name: name.name,
            latitude: lat,
            longitude: lon,
            color: name.color,
            image: name.image,
          }
          jsonData.push(json);
        }
      });
      return jsonData;
      // return [
      //   {
      //     name: "",
      //     latitude: 41.9760000,
      //     longitude: 140.5653356,
      //   },
      //   {
      //     name: "",
      //     latitude: 42.0249997,
      //     longitude: 140.6323356,
      //   },
      // ];
    }
    
    function randRange(min, max) {
      var keta = 1000000;
      var cmin = min * keta;
      var cmax = max * keta;
      return Math.floor(Math.random() * (cmax - cmin + 1) + cmin) / keta;
    }
    
    function randColor() {
      var color = Math.floor(Math.random() * 0xFFFFFF).toString(16);
      for(count = color.length; count < 6; count++) {
        color = "0" + color;                     
      }
      return "#" + color;
    }
    
  });
  