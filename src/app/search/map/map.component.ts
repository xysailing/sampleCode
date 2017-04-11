import { Component, OnInit, Input, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import { MarkerService } from './marker.service';
import { PropDetailsComponent } from '../prop-details/prop-details.component';

declare let google: any;
declare let MarkerClusterer: any;
declare let $: any;

@Component({
  selector: 'rlst-map',
  templateUrl: './map.component.html',
  providers: [MarkerService]
})
export class MapComponent implements OnInit {

  @Input() myGMap: any;

  // Inject child component
  @ViewChild(PropDetailsComponent)
  private propDetailsComponent: PropDetailsComponent;

  markerObj: any = { markers: [] };
  markerCluster: any;
  activeMarker: any = null;
  markerActiveInfoWin = new google.maps.InfoWindow({ disableAutoPan: true });

  /* TODO: DRY? find out why clusterStyles needs this redundant syntax? */
  clusterStyles = [
    {
      url: "./assets/images/h.png",
      textColor: "white",
      fontFamily: "monospace",
      textSize: 14
    },
    {
      url: "./assets/images/cluster.png",
      textColor: "white",
      fontFamily: "monospace",
      textSize: 14
    },
    {
      url: "./assets/images/cluster.png",
      textColor: "white",
      fontFamily: "monospace",
      textSize: 14
    }
  ];

  mcOptions = {
    styles: this.clusterStyles,
    minimumClusterSize: 5,
    calculator: this.calculator,
    doNeighborhoodCluster: false
  };

  constructor(private zone: NgZone, private markerService: MarkerService) { }

  calculator(markers: any) {

    let count = markers.length;
    if (count === 1 && !!markers[0].isCondo) {
      count = markers[0].units.length;
    }

    let formatPrice = function (value: number, decimals: number) {
      if (value > 1000 && value <= 999999) {
        return '$' + (value / 1000).toFixed(0) + 'K';
      } else if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(2) + 'M';
      } else {
        return '$' + value.toFixed(0);
      }
    }

    let median = function (markers: any) {
      markers.sort(function (a: any, b: any) {
        return a['price'] - b['price'];
      });

      let half = Math.floor(markers.length / 2);

      if (markers.length % 2) {
        return markers[half]['mContent']['price'];
      } else {
        return (markers[half - 1]['mContent']['price'] + markers[half]['mContent']['price']) / 2.0;
      }
    }

    return {
      title: formatPrice(median(markers), 0),
      text: count
    };
  };

  getMarkers(bounds: any, listingURL: string, filterVal: any) {

    this.markerService.getMarkers(bounds, listingURL, filterVal)
      .subscribe(markers => {
        this.zone.run(() => {
          if (this.markerCluster) {
            this.markerCluster.clearMarkers();
            this.markerObj.markers = [];
          }
          this.markerObj.markers = markers;
          this.setMarkers(this.myGMap, this.markerObj.markers, this.propDetailsComponent)
        });
      }, (err: any) => console.error(err)); //TODO: log error 
  }

  closeInfoWin() {
    this.markerActiveInfoWin.close();
    if (this.activeMarker) {
      this.activeMarker.setMap(null);
      this.activeMarker = null;
    }
  }

  setMarkers(myGMap: any, markers: any, propDetailsComponent: any) {

    let iwContent: string = '';

    let mrkrs: Array<any> = markers.map((m_) => {
      let mrk = new google.maps.Marker({
        position: { lat: m_["latitude"], lng: m_["longitude"] },
        mContent: m_
      });

      google.maps.event.addListener(mrk, 'click', () => {
        let propId = (mrk.mContent.units) ? mrk.mContent.units[0].id : mrk.mContent.id;
        propDetailsComponent.getPropDetails(propId);
      });

      google.maps.event.addListener(mrk, 'mouseover', () => {
        this.closeInfoWin();
        this.activeMarker = new google.maps.Marker({
          position: mrk.position,
          map: this.myGMap,
          icon: "./assets/images/dot.png"
        });

        if (mrk.mContent.units) {
          iwContent = '<div class="iw-outer" ><div class ="iw-inner">'
          for (let i in mrk.mContent.units) {
            iwContent +=
              '<img src="' + mrk.mContent.units[i].image + '"> <br> ' +
              '$' + mrk.mContent.units[i].price + '<br>' +
              mrk.mContent.units[i].beds + 'bds, ' + mrk.mContent.units[i].baths + 'ba<br>' +
              mrk.mContent.units[i].barea + 'sqft<br>' + '<hr>';
          }
          iwContent += '</div></div>'
        }
        else {
          iwContent =
            '<img src="' + mrk.mContent.image + '"> <br> ' +
            '$' + mrk.mContent.price + '<br>' +
            mrk.mContent.beds + 'bds, ' + mrk.mContent.baths + 'ba <br>' +
            mrk.mContent.barea + ' sqft';
        }

        this.markerActiveInfoWin.setContent(iwContent);
        setTimeout(() => { this.markerActiveInfoWin.open(myGMap, this.activeMarker); }, 300);

      });

      return mrk;

    });

    this.markerCluster = new MarkerClusterer(myGMap, mrkrs, this.mcOptions);

  }

  ngOnInit(): void {
    $('body').on('click', () => { this.closeInfoWin(); });
    $('#re-listing, .filterbarContainer, nav').on('mouseover', () => { this.closeInfoWin(); });
  }
}
