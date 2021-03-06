/* tslint:disable:whitespace */
import { toDate } from '@angular/common/src/i18n/format_date';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { percent } from 'tns-core-modules/ui/core/view';
import { KeyboardType } from 'tns-core-modules/ui/enums';
import { IBasicSettings } from '~/app/model/med-link.model';
import number = KeyboardType.number;

@Injectable({
    providedIn: 'root'
})
export class RawDataService {
    constructor() {
    }
    parseData(rawData: string): IBasicSettings {
        const parsedData = {} as IBasicSettings;
        const bloodGlucoseMatch = rawData.match(this.bloodGlucoseRegex);
        const lastBolusMatch = rawData.match(this.lastBolusRegex);
        const insulinInPompLeftMatch = rawData.match(this.insulinInPompLeftRegex);
        const batteryVoltageMatch = rawData.match(this.batteryVoltageRegex);
        const pumpDataMatch = rawData.match(this.pumpDataRegex);
        const statusPumpMatch = rawData.match(this.stanPumpRegex);
        const temporaryBasalMethodPercentageM = rawData.match(this.temporaryBasalMethodPercentage);
        const wwMatch = rawData.match(this.ww);
        const bgrangeMatch = rawData.match(this.bgRange);
        const isfMatch = rawData.match(this.isf);
        const incrementStepMatch = rawData.match(this.incrementStepSettingRegex);
        const maximumBasalMatch = rawData.match(this.maximumBolusSettingRegex);
        if (incrementStepMatch && maximumBasalMatch) {
            console.log('BBBBBB aaaaa  ' + +maximumBasalMatch[1].trim() + incrementStepMatch[1]);
            parsedData.incrementStepSetting = incrementStepMatch[1];
            parsedData.maximumBolusSetting = maximumBasalMatch[1];
        }
        if (!insulinInPompLeftMatch || !batteryVoltageMatch || !pumpDataMatch || !statusPumpMatch) {
            console.log(rawData.toString());
            parsedData.batteryVoltage = 1.99;
            parsedData.insulinInPompLeft = 199;
            parsedData.data = {
                data: new Date(),
                percent: 99,
            };
            parsedData.statusPump = 'BLAD ODCZYTU BT';
        } else {
            console.log(rawData.toString());
            console.log('CC' + Number(batteryVoltageMatch[1]) + 'X' + Number(insulinInPompLeftMatch[1]) + ' Y ' + this.dateHax(pumpDataMatch[1]) + ' Z ' + Number(pumpDataMatch[2]));
            parsedData.batteryVoltage = Number(batteryVoltageMatch[1]);
            parsedData.insulinInPompLeft = Number(insulinInPompLeftMatch[1]);
            parsedData.data = {
                data: this.dateHax(pumpDataMatch[1]),
                percent: Number(pumpDataMatch[2]),
            };
            parsedData.statusPump = statusPumpMatch[1].toLowerCase().trim();
        }
        if (!bloodGlucoseMatch) {

            parsedData.bloodGlucose = {
                value: 0,
                date: new Date(),
            };
        } else {
            console.log('BBBBBB   ' + +bloodGlucoseMatch[1].trim() + this.dateHax(bloodGlucoseMatch[2]));
            parsedData.bloodGlucose = {
                value: +bloodGlucoseMatch[1].trim(),
                date: this.dateHax(bloodGlucoseMatch[2]),
            };
        }

        if (bgrangeMatch) {
            console.log('BBBBBBa   ' + +bgrangeMatch[1].trim() + bgrangeMatch[2] + bgrangeMatch[3]);
            parsedData.calc = {
                idVal: Number(bgrangeMatch[1]),
                value: bgrangeMatch[2],
                hours: bgrangeMatch[3],
                category: 'bgrange'
            };
        }
        if (wwMatch) {
          console.log('BBBBBB 1  ' + +wwMatch + wwMatch[2] + wwMatch[3]);
          parsedData.calc = {
            idVal: Number(wwMatch[1]),
            value: wwMatch[2],
            hours: wwMatch[3],
            category: 'jnaww'
          };
        }
        if (isfMatch) {
            console.log('BBBBBB c  ' + +isfMatch[1].trim() + isfMatch[2] + isfMatch[3]);
            parsedData.calc = {
                idVal: Number(isfMatch[1]),
                value: isfMatch[2],
                hours: isfMatch[3],
                category: 'isf'
            };
        }

        if (!lastBolusMatch) {
            parsedData.lastBolus = {
                value: 0,
                date: new Date(),
            };
        } else {
            console.log('AAAAAA' + +lastBolusMatch[1].trim() + this.dateHax(lastBolusMatch[2]));
            parsedData.lastBolus = {
                value: +lastBolusMatch[1].trim(),
                date: this.dateHax(lastBolusMatch[2]),
            };
            if(!temporaryBasalMethodPercentageM) {
                parsedData.temporaryBasalMethodPercentage = {
                    percentsOfBaseBasal: 100,
                    timeLeftInMinutes: 0,
                    timestamp: new Date(),
                };
            }
            else {
                parsedData.temporaryBasalMethodPercentage = {
                    percentsOfBaseBasal: +temporaryBasalMethodPercentageM[1] - 100,
                    timeLeftInMinutes: +temporaryBasalMethodPercentageM[3] + 60 * +temporaryBasalMethodPercentageM[2],
                    timestamp: new Date(),
                };
            }
        }
        return parsedData;
    }
    private dateHax(date: string) {
        const lintedDate = (date.trim() + ':0').split(' ');
        const dateDay = lintedDate[0].split('-').reverse();
        if (Number(dateDay[0]) <= 99) {
            dateDay[0] = '20' + dateDay[0];}
        if (dateDay[1].substring(0,1) === '0') {
            dateDay[1] = dateDay[1].substring(1,2);
        }
        const dateHour = lintedDate[1].split(':');
        if (dateHour[0].substring(0,1) === '0') {
            dateHour[0] = dateHour[0].substring(1,2);
        }
        return new Date(dateDay.join('-') + ' ' + dateHour.join(':'));
    }
    pumpDataRegex = /(\d{2}-\d{2}-\d{4}\s\d{2}:\d{2})\s+?(\d{1,3})%/;
    bloodGlucoseRegex = /BG:(\s?\d+?)\s(\d{2}-\d{2}-\d{2}\s\d{2}:\d{2})/;
    lastBolusRegex = /Last\sbolus:([\d\.]+?)\s(\d{2}-\d{2}-\d{2}\s+?\d{1,2}:\d{2})/;//BL -> Last bolus
    temporaryBasalMethodUnitsPerHourRegex = /Temp:([\d\.]+?)\sPodano:\s([\d\.]+?)\nCzas\sPD:\s(\d+?)m\s\/\s(\d+?)m/; // PD:Podano: Czas PD -> Temp basal units Temp basal time
    nextCalibrationRegex = /Next\scalibration\stime:\s(\d+?):(\d+?)\n/;
    uptimeSensorInMinutesRegex = /Sensor\scycle\stime:\s(\d+?)min/; //sensor uptime
    expectedBloodGlucoseRegex = /BG\starget:\s(\d+)-(\d+)\n/; //
    batteryVoltageRegex = /Pump\sbattery:\s(\d.+?)V/; // Battery voltage
    insulinInPompLeftRegex = /Reservoir:\s+?(\d{1,3}).\d{2}u/; //Remaining Insulinn
    baseBasalRegex = /Basal:\s([\d\.]+).u\/h\n/;
    temporaryBasalMethodPercentage = /TBR:\s+?(\d+)%\s+?(\d+).+?(\d+)m/;
    totalInsulinGivenTodayRegex = /Insulin\stoday:([\d\.]+)u\n/;//Today total dosage
    totalInsulinGivenYesterdayRegex = /Insulin\syesterday:\s([\d\.]+)u\n/;//Yestertday total dosage 
    maximumBolusSettingRegex = /Max\.\sbolus:\s+?([\d\.]+)/;
    incrementStepSettingRegex = /Easy\sbolus\sstep:\s([\d\.]+)/;
    maximumBasalSettingsRegex = /Max\.\sbasal\srate:\s([\d\.]+)u\/h\n/;
    insulinWorkTimeSettingsRegex = /Insulin\sduration\stime:\s(\d+)h\n/;
    insulinSensitiveFactorSettingsRegex = /Insulin\ssensivity\sfactor:\s(\d+?)(\w+\/\w+)\n/;
    insulinToCabRatioRegex = /Carb\sratio:\s(\d+?)(\w+\/\w+)/; // Wsp\.weglowod -> Carb ratio
    stanPumpRegex = /Pump\state: (\S+)/; //pump status
    ww = /Interval\s(\d{1}):\s(.\W\d{3})\su\/WW\sstart\stime\s(\d{2}:\d{2})/; // Interval start time
    isf = /Interval\s(\d{1}):\s\s?(\d{2,3})mg.dl\sstart\stime\s(\d{2}:\d{2})/; // Interval start time
    bgRange = /Interval\s(\d{1}):\s?(\d{2,3}-.\d{2,3})\sstart\stime\s(\d{2}:\d{2})/; // Interval start time

}
