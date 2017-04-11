import { Component, OnInit, Input, Output, Optional, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";

let txtVal = require('./txtVal.json');
declare let $: any;

@Component({
    selector: 'rlst-filterbar',
    templateUrl: './filterbar.component.html'
})

export class FilterbarComponent implements OnInit {

    @Output() onFormValueChange = new EventEmitter();
    filterbarForm: FormGroup;
    showLowPrice: boolean = true;
    showHighPrice: boolean = false;
    ptypeTxtVal = txtVal.ptypeTxtVal;
    nobedTxtVal = txtVal.nobedTxtVal;
    nobathTxtVal = txtVal.nobathTxtVal;
    lpriceTxtVal = txtVal.lpriceTxtVal;
    upriceTxtVal = txtVal.upriceTxtVal;
    labelMaker = {
        ptype: 'Property Type (3)',
        nobed: '1+',
        nobath: '1+',
        lprice: '$500K',
        uprice: '1 Million',
        format(n) {
            n = Number(n);
            if (n >= 10000 && n < 1000000 && n % 1000 === 0) {
                return '$' + n / 1000 + 'K';
            }
            if (n >= 1000000 && n % 10000 === 0) {
                return '$' + n / 1000000 + ' million';
            }
            return '$' + n;
        }
    }

    constructor(private formBuilder: FormBuilder) {
        this.filterbarForm = formBuilder.group({
            ptype: 'ptype=1&ptype=2&ptype=3',
            lprice: '500000',
            uprice: '1000000',
            nobed: '1p',
            nobath: '1p'
        });

        this.filterbarForm.valueChanges.subscribe(
            () => this.onFormValueChange.emit()
        );
    }

    getFilterbarFormValue() {
        return this.filterbarForm.value;
    }

    /* Property Type */
    onSelectPtype() {
        let values = [].filter.call(document.getElementsByName('ptype'), (c) => c.checked).map(c => 'ptype=' + c.value);
        if(values.length==0) {
            (<any>document.getElementsByName('ptype')).forEach( (c) => { c.checked=true; } );
            values = [].filter.call(document.getElementsByName('ptype'), (c) => c.checked).map(c => 'ptype=' + c.value);
            alert("The Property Type can't be empty!")
        }
        (this.filterbarForm.controls['ptype']).setValue(values.join('&'));
        this.labelMaker.ptype = 'Property Type (' + values.length + ')';
    };

    /* BEDROOMS and BATHROMS */
    onSelectBdBa(listValue: any, formKey: string) {
        (this.filterbarForm.controls[formKey]).setValue(listValue['value']);
        this.labelMaker[formKey] = listValue['value'][0] + '+';
    };

    /* CUSTOM TOGGLE FOR PRICE MENU: AFTER CHOOSING MIN VALUE, DO NOT CLOSE THE MENU ,
    CHANGE FOCUS TO MAX VALUE INPUT, CLOSE AFTER CHOOSING MAX VALUE 
    REMOVED data-toggle="dropdown" FROM <button> */
    customToggle() {
        document.getElementById("customToggle").classList.toggle("open");
        document.getElementById("lprice").focus();
        this.showLowPrice = true;
        this.showHighPrice = false;
    }

    /* PRICE IS CHOSEN FROM ul>li */
    onSelectPrice(luprice: Object, formKey: string) {
        (this.filterbarForm.controls[formKey]).setValue(luprice['value']);
        this.labelMaker[formKey] = this.labelMaker.format(luprice['value']);
        this.changeFocusOrClose(formKey);
    }

    /* PRICE IS CHOSEN BY TYPING A VALUE IN INPUT AND <enter>*/
    // MERGE WITH onSelectPrice?
    onEnterPrice(formKey) {
        let otherPriceList = (formKey === 'lprice') ? 'uprice' : 'lprice';
        this.showPriceList(otherPriceList);
        this.labelMaker[formKey] = this.labelMaker.format((this.filterbarForm.controls[formKey]).value);
        this.changeFocusOrClose(formKey);
    }

    changeFocusOrClose(formKey: string) {
        if (formKey === 'lprice') {
            document.getElementById("lprice").blur();
            document.getElementById("uprice").focus();
            this.showLowPrice = false;
            this.showHighPrice = true;
        }
        else {
            document.getElementById("customToggle").classList.remove("open");
        }
    }

    showPriceList(luprice: string) {
        (luprice === 'lprice') ? (this.showLowPrice = true, this.showHighPrice = false) : (this.showLowPrice = false, this.showHighPrice = true)
    }

    ngOnInit() { }

}