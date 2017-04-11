import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppConfig } from '../config/app.config';
import { FilterbarComponent } from './filterbar/filterbar.component';
import { MapComponent } from './map/map.component';
import { ReListingComponent } from './re-listing/re-listing.component';
import { GmapPacComponent } from "../gmap-pac/gmap-pac.component"

declare let google: any;
declare let Geocoder: any;

@Component({
    selector: 'rlst-search',
    templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    myGMap: any
    urlParams: any = { "choice": "", "coordinates": "", "location": "" }
   
    // Inject child components 
    @ViewChild( FilterbarComponent)
    private  filterbarComponent:  FilterbarComponent;

    @ViewChild(MapComponent)
    private mapComponent: MapComponent;

    @ViewChild(ReListingComponent)
    private reListingComponent: ReListingComponent;

    constructor(private activatedRoute: ActivatedRoute, private config: AppConfig) {
        this.subscription = activatedRoute.queryParams.subscribe(
            (queryParam: any) => {
                this.urlParams["choice"] = queryParam["choice"];
                this.urlParams["location"] = queryParam["location"];
                this.urlParams["coordinates"] = queryParam["coordinates"];
            }
        );
    };

    /* GET THE URLS FROM CONFIG FILE */
    getListingURL() {
        return this.config.get('protocol') + "://"
            + this.config.get('front-end-host') + ':' + this.config.get('front-end-port') + '/'
            + this.config.get("list-uri");
    }

    getMarkerURL() {
        return this.config.get('protocol') + "://"
            + this.config.get('front-end-host') + ':' + this.config.get('front-end-port') + '/'
            + this.config.get("marker-uri");
    }

    /* LOAD GOOGLE MAP */
    loadMap(): void {
        let coordinates = JSON.parse(window.atob(this.urlParams.coordinates));
        let center = new google.maps.LatLng(coordinates.center[0], coordinates.center[1]);
        let bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(coordinates.bounds[0][0], coordinates.bounds[0][1]),
            new google.maps.LatLng(coordinates.bounds[1][0], coordinates.bounds[1][1])
        );
        let coords = { "center": center, "bounds": bounds };

        this.myGMap = new google.maps.Map(document.getElementById('map'),
            {
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                center: coords.center,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        );

        this.myGMap.fitBounds(bounds);
    }

    /* LOAD MARKERS AND LISTING ONCE MAP IS IDLE */
    mapIdleLoadML() {
        google.maps.event.addListener(this.myGMap, 'idle', () => {
            this.LoadMarkersAndListings();
        });
    }

    /* CALL CHILD COMPONENETS' METHODS LO LOAD MARKERS AND LISTINGS */
    LoadMarkersAndListings() {
        let filterbarFormValue = this.filterbarComponent.getFilterbarFormValue();
        this.mapComponent.getMarkers(this.myGMap.getBounds(), this.getMarkerURL(), filterbarFormValue);
        this.reListingComponent.getrelistings(this.myGMap.getBounds(), this.getListingURL(), filterbarFormValue);
        this.reListingComponent.setMaxRebate(this.myGMap.getBounds(), this.getListingURL(), filterbarFormValue);
    }

    /* LISTEN TO EVENT EMITTER FROM CHILD COMPONENTS  */
    reSort(sortBy: number) {
        this.reListingComponent.getrelistings(this.myGMap.getBounds(), this.getListingURL(), this.filterbarComponent.getFilterbarFormValue());
    }

    /* RELOAD MARKERS AND LISTINGS IF THE VALUE OF THE FILTERBAR CHANGES */
    FormValChanged() {
        this.LoadMarkersAndListings();
    }

    ngOnInit(): void {
        this.loadMap();
        this.mapIdleLoadML();
    }

    ngOnDestroy() {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
    }
}