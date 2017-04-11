import { Component, OnInit, Input, Output, NgZone, Optional, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { REListingService } from './re-listing.service';
import { PropDetailsService } from '../prop-details/prop-details.service';

declare let google: any;
declare var $: any;
declare let _: any;

@Component({
    selector: 'rlst-re-listing',
    templateUrl: './re-listing.component.html',
    providers: [REListingService, PropDetailsService]
})
export class ReListingComponent implements OnInit {

    @Input() myGMap: any;
    @Output() onSortBy = new EventEmitter();

    relistings = [];
    maxRebate: Number;
    propDetail: any = {};
    sortBy = 1;
    activeMarker: any = null;
    activeInfoWin = new google.maps.InfoWindow({ disableAutoPan: true });     

    constructor(
        private zone: NgZone,
        private relistingService: REListingService,
        private propDetailsService: PropDetailsService) { }

    getrelistings(bounds: any, listingURL: string, filterVal: any) {
        this.relistingService.getREListing(bounds, listingURL, filterVal, this.sortBy)
            .subscribe(listings => {
                this.zone.run(() => {
                    this.relistings = listings;
                });
            }, err => console.error(err) ); //, TODO: log the error in the backend            
    }

    setMaxRebate(bounds: any, listingURL: string, filterVal: any) {
        this.relistingService.getMaxPrice(bounds, listingURL, filterVal)
            .subscribe(max => {
                this.zone.run(() => {
                    this.maxRebate = Number(max["maxPrice"]) * 0.006;
                });
            },
            err => console.error(err) ); //, TODO: log the error in the backend
    }

    /*  experimenting with using a secondry service
        TODO: Use prop-details.component for milestone 1 */
    onListingClicked(relisting) {
        this.propDetailsService.getPropDetails(relisting.id)
            .subscribe(pD => {
                this.zone.run(() => {
                    this.propDetail = pD;
                    $('#myModalListing').modal('show');     
                });
            }, (err: any) => console.error(err)); //TODO: log error 
    }

    closeInfoWin() {
        this.activeInfoWin.close();
        if (this.activeMarker) {
            this.activeMarker.setMap(null);
            this.activeMarker = null;
        }
    }

    onListingMouseenter(relisting) {

        this.closeInfoWin();
        let thisListng = _.find(this.relistings, (o: any) => { return o.id == relisting.id; });
        this.activeMarker = new google.maps.Marker({
            position: { lat: thisListng.latitude, lng: thisListng.longitude },
            map: this.myGMap,
            icon: "./assets/images/dot.png"
        });

        let iwContent = '$' + thisListng.price + '<br>' + thisListng.beds + 'bd, '
                            + thisListng.baths + 'ba <br>' + thisListng.barea;
        this.activeInfoWin.setContent(iwContent); 
        setTimeout(() => { this.activeInfoWin.open(this.myGMap, this.activeMarker); }, 300);

    }

    onListingMouseleave() {
        this.closeInfoWin();
    }

    onChangeSort(event) {
        this.sortBy = event.target.value;
        this.onSortBy.emit();
    }

    ngOnInit() {
        $('[data-toggle="tooltip"]').tooltip();
        /* built-in redundancy =~ onListingMouseleave() */
        $('#map, .filterbarContainer, nav').on ('mouseover', ()=> { this.closeInfoWin(); });        
    }
}