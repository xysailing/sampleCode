import { Component, OnInit, NgZone } from '@angular/core';
import { PropDetailsService } from './prop-details.service';

declare let $: any;

@Component({
  selector: 'rlst-prop-details',
  templateUrl: './prop-details.component.html',
  providers: [PropDetailsService]
})
export class PropDetailsComponent implements OnInit {

  propDetail: any = {};

  constructor(private zone: NgZone, private propDetailsService: PropDetailsService) { }

  getPropDetails(propId: number) {
    this.propDetailsService.getPropDetails(propId)
      .subscribe(pD => {
        this.zone.run(() => {
          this.propDetail = pD;
          $('#myModal').modal('show');
        });
      }, (err: any) => console.error(err)); //TODO: log error 
  }

  ngOnInit() { }

}