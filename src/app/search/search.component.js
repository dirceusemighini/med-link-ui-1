"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_email_1 = require("nativescript-email");
var Permissions = require("nativescript-permissions");
var operators_1 = require("rxjs/operators");
var data_facade_service_1 = require("~/app/shared/data-facade.service");
var database_service_1 = require("~/app/shared/database.service");
var trace_writer_service_1 = require("~/app/shared/trace-writer.service");
var Runtime = java.lang.Runtime;
var fs = require("tns-core-modules/file-system");
var appSettings = require("tns-core-modules/application-settings");
var dialogs = require("tns-core-modules/ui/dialogs");
var SearchComponent = /** @class */ (function () {
    function SearchComponent(changeDetectorRef, databaseService, dataFacadeService, traceWriterService) {
        this.changeDetectorRef = changeDetectorRef;
        this.databaseService = databaseService;
        this.dataFacadeService = dataFacadeService;
        this.traceWriterService = traceWriterService;
        this.pending = false;
        this.rangeText = "AUTO STOP PRZY WARTOŚCI: " + appSettings.getNumber('range', 75);
        // Use the constructor to inject services.
    }
    SearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.phoneN = 'Tel: ' + appSettings.getString('phoneN', 'Podaj nr tel. opiekuna');
        this.auto = appSettings.getBoolean('auto', false);
        this.bgSource = appSettings.getBoolean('bgsource', false);
        this.rangeText = "AUTO STOP PRZY WARTOŚCI: " + appSettings.getNumber('range', 75) + "MG/DL";
        this.traceWriterService.subscribe(function (_a) {
            var message = _a.message, date = _a.date, category = _a.category, messageType = _a.messageType;
            _this.databaseService.insertLogs(date, message, messageType, category);
        });
        this.sendDatatoNightscout7().then(function () {
            return console.log(_this.nsUrl2 + "fffffffff3333333f");
        });
    };
    SearchComponent.prototype.getBGRange = function () {
        var _this = this;
        dialogs.prompt({
            title: "Podaj wartość przy jakiej ma zostać wyłączona pompa",
            message: "Wartość graniczna to:",
            okButtonText: "OK",
            cancelButtonText: "Anuluj",
            inputType: dialogs.inputType.number
        }).then(function (r) {
            console.log("Dialog closed!" + r.result + ", A TO TEKST:" + r.text);
            _this.range = Number(r.text);
            if (_this.range < 75 || _this.range > 110) {
                dialogs.alert({ message: "UWAGA WARTOŚĆ SPOZA ZAKRESU: 75 - 110 MG/DL", okButtonText: "OK" });
            }
            else {
                appSettings.setNumber('range', _this.range);
                _this.rangeText = "AUTO STOP PRZY WARTOŚCI: " + _this.range + "MG/DL";
            }
        });
    };
    SearchComponent.prototype.setPhoneNumber = function () {
        var _this = this;
        dialogs.prompt({
            title: "Podaj nr tel. opiekuna",
            message: "Podaj numer telefonu z którego będą przyjmowane komendy tj.: START, STOP, BOL X.X",
            okButtonText: "OK",
            cancelButtonText: "Anuluj",
            inputType: dialogs.inputType.number
        }).then(function (r) {
            console.log("Dialog closed!" + r.result + ", A TO TEKST:" + r.text);
            if (r.text === '') {
                appSettings.setString('phoneN', 'Podaj nr tel. opiekuna');
                _this.phoneN = 'Podaj nr tel. opiekuna';
            }
            else {
                Permissions.requestPermission(android.Manifest.permission.SEND_SMS, "zezwolic na czytanie SMS?").then(function () { return Permissions.requestPermission(android.Manifest.permission.READ_SMS); });
                appSettings.setString('phoneN', r.text);
                _this.phoneN = 'Tel: ' + r.text;
            }
        });
    };
    SearchComponent.prototype.sendLogs = function () {
        var documents = fs.path.join(android.os.Environment.getExternalStorageDirectory().getAbsolutePath().toString());
        var myFolder = fs.Folder.fromPath(documents);
        var myFile = myFolder.getFile("my.txt");
        var a = Runtime.getRuntime().exec('logcat -v time -f /sdcard/my.txt -d');
        console.log("to ta wielkosc pliku: " + myFile.size);
        if (myFile.size > 5000000) {
            myFile.remove();
        }
        var u = setInterval(function () {
            if (a.isAlive() === false) {
                clearInterval(u);
                console.log("CIOSs");
                Permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE).then(function () {
                    return nativescript_email_1.compose({
                        subject: "Debug med-link-ui",
                        body: "aReduced2",
                        to: ["jrkf@o2.pl"],
                        attachments: [{
                                mimeType: 'text',
                                path: myFile.path,
                                fileName: 'my.txt'
                            }]
                    });
                });
            }
            else {
                console.log("BAM BAM");
            }
        }, 500);
    };
    SearchComponent.prototype.Zapisz = function () {
        var _this = this;
        console.log("aaaaaa" + this.nsUrl);
        var sha1 = require("sha1");
        this.databaseService.insertNS(this.nsUrl, sha1(this.nsKey), this.nsKey);
        console.log("NS URL: " + this.nsUrl + " ddddddddddd " + this.nsKey);
        this.sendDatatoNightscout6().then(function () {
            return console.log(_this.slowo + "aRRRRRRRRRR");
        });
        if (this.nsUrl.substring(0, 8).toUpperCase() !== "HTTPS://" ||
            this.nsUrl.substring(this.nsUrl.length - 1, this.nsUrl.length) === "/") {
            this.slowo2 = "ZŁY ADRES URL !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
        }
        else {
            this.slowo2 = "OK! ";
        }
    };
    SearchComponent.prototype.onCheckedChangeAuto = function (args) {
        var mySwitch = args.object;
        var isChecked = mySwitch.checked; // boolean
        if (isChecked === true) {
            appSettings.setBoolean("auto", true);
            this.auto = appSettings.getBoolean('auto');
        }
        else {
            appSettings.setBoolean("auto", false);
            this.auto = appSettings.getBoolean('auto');
        }
    };
    SearchComponent.prototype.onCheckedChangeSource = function (args) {
        var mySwitch = args.object;
        var isChecked = mySwitch.checked; // boolean
        if (isChecked === true) {
            appSettings.setBoolean("bgsource", true);
            this.bgSource = appSettings.getBoolean('bgsource');
        }
        else {
            appSettings.setBoolean("bgsource", false);
            this.bgSource = appSettings.getBoolean('bgsource');
        }
    };
    SearchComponent.prototype.sendDatatoNightscout6 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getNSData().subscribe(function (g) {
                g.map(function (bol) {
                    console.log(bol.http.toString() + "JJJJJJJ" + bol.secret.toString());
                    _this.slowo =
                        _this.slowo2 +
                            "  " +
                            bol.http.toString() +
                            " " +
                            bol.secret.toString();
                });
                console.log("as" + _this.slowo);
                resolve(), reject();
            });
        });
    };
    SearchComponent.prototype.sendDatatoNightscout7 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getNSData().subscribe(function (g) {
                g.map(function (bol) {
                    console.log(bol.http.toString() + "66666666666" + bol.secret.toString());
                    _this.nsUrl2 = bol.http.toString();
                    _this.nsKey2 = bol.hash.toString();
                });
                console.log("as" + _this.nsUrl2);
                resolve(), reject();
            });
        });
    };
    SearchComponent.prototype.setNS = function (arg) {
        console.log("setttNS");
        console.log(arg.text);
        this.nsUrl = arg.text;
    };
    SearchComponent.prototype.setNSurl = function (arg) {
        console.log("setttNSUURRL");
        console.log(arg.text);
        this.nsKey = arg.text;
    };
    SearchComponent.prototype.getNSData = function () {
        return this.databaseService.NSconf().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                http: a[0],
                secret: a[1],
                hash: a[2]
            }); });
        }));
    };
    SearchComponent = __decorate([
        core_1.Component({
            selector: "Search",
            moduleId: module.id,
            templateUrl: "./search.component.html",
            styleUrls: ["./search.component.scss"]
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef,
            database_service_1.DatabaseService,
            data_facade_service_1.DataFacadeService,
            trace_writer_service_1.TraceWriterService])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBcUU7QUFDckUseURBQTZDO0FBQzdDLHNEQUF3RDtBQUV4RCw0Q0FBcUM7QUFDckMsd0VBQXFFO0FBQ3JFLGtFQUFnRTtBQUNoRSwwRUFBdUU7QUFDdkUsSUFBTyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDbkMsaURBQW1EO0FBR25ELG1FQUFxRTtBQUNyRSxxREFBdUQ7QUFTdkQ7SUFpQkUseUJBQ1UsaUJBQW9DLEVBQ3BDLGVBQWdDLEVBQ2hDLGlCQUFvQyxFQUNwQyxrQkFBc0M7UUFIdEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBWGhELFlBQU8sR0FBRyxLQUFLLENBQUM7UUFLaEIsY0FBUyxHQUFXLDJCQUEyQixHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBUW5GLDBDQUEwQztJQUM1QyxDQUFDO0lBQ0Qsa0NBQVEsR0FBUjtRQUFBLGlCQWFDO1FBWkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRywyQkFBMkIsR0FBRyxXQUFX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Q0FBQyxFQUptQixDQUluQixDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQXROVSxlQUFlO1FBTjNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN2QyxDQUFDO3lDQW1CNkIsd0JBQWlCO1lBQ25CLGtDQUFlO1lBQ2IsdUNBQWlCO1lBQ2hCLHlDQUFrQjtPQXJCckMsZUFBZSxDQXVOM0I7SUFBRCxzQkFBQztDQUFBLEFBdk5ELElBdU5DO0FBdk5ZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGNvbXBvc2UgfSBmcm9tICduYXRpdmVzY3JpcHQtZW1haWwnO1xyXG5pbXBvcnQgKiBhcyBQZXJtaXNzaW9ucyBmcm9tICduYXRpdmVzY3JpcHQtcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgRGF0YUZhY2FkZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zaGFyZWQvZGF0YS1mYWNhZGUuc2VydmljZSc7XHJcbmltcG9ydCB7IERhdGFiYXNlU2VydmljZSB9IGZyb20gJ34vYXBwL3NoYXJlZC9kYXRhYmFzZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVHJhY2VXcml0ZXJTZXJ2aWNlIH0gZnJvbSAnfi9hcHAvc2hhcmVkL3RyYWNlLXdyaXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IFJ1bnRpbWUgPSBqYXZhLmxhbmcuUnVudGltZTtcclxuaW1wb3J0ICogYXMgZnMgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZmlsZS1zeXN0ZW1cIjtcclxuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7IFN3aXRjaCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3N3aXRjaFwiO1xyXG5pbXBvcnQgKiBhcyBhcHBTZXR0aW5ncyBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2RpYWxvZ3NcIjtcclxuaW1wb3J0IHsgdG9OdW1iZXJzIH0gZnJvbSBcIkBhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvZGlhZ25vc3RpY3MvdHlwZXNjcmlwdF92ZXJzaW9uXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJTZWFyY2hcIixcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vc2VhcmNoLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCIuL3NlYXJjaC5jb21wb25lbnQuc2Nzc1wiXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBzbG93bzogc3RyaW5nO1xyXG4gIHNsb3dvMjogc3RyaW5nO1xyXG4gIG5zVXJsOiBzdHJpbmc7XHJcbiAgbnNVcmwyOiBzdHJpbmc7XHJcbiAgbnNLZXk6IHN0cmluZztcclxuICBwaG9uZU46IHN0cmluZztcclxuICAvL3Bob25lOiBzdHJpbmcgPSAnJztcclxuICBuc0tleTI6IHN0cmluZztcclxuICBjYXJiczogc3RyaW5nO1xyXG4gIHBlbmRpbmcgPSBmYWxzZTtcclxuICBhUmVkdWNlZDI6IHN0cmluZztcclxuICBhdXRvOiBib29sZWFuO1xyXG4gIGJnU291cmNlOiBib29sZWFuO1xyXG4gIHJhbmdlOiBudW1iZXI7XHJcbiAgcmFuZ2VUZXh0OiBzdHJpbmcgPSBcIkFVVE8gU1RPUCBQUlpZIFdBUlRPxZpDSTogXCIgKyBhcHBTZXR0aW5ncy5nZXROdW1iZXIoJ3JhbmdlJywgNzUpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgcHJpdmF0ZSBkYXRhYmFzZVNlcnZpY2U6IERhdGFiYXNlU2VydmljZSxcclxuICAgIHByaXZhdGUgZGF0YUZhY2FkZVNlcnZpY2U6IERhdGFGYWNhZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSB0cmFjZVdyaXRlclNlcnZpY2U6IFRyYWNlV3JpdGVyU2VydmljZVxyXG4gICkge1xyXG4gICAgLy8gVXNlIHRoZSBjb25zdHJ1Y3RvciB0byBpbmplY3Qgc2VydmljZXMuXHJcbiAgfVxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5waG9uZU4gPSAnVGVsOiAnICsgYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKCdwaG9uZU4nLCAnUG9kYWogbnIgdGVsLiBvcGlla3VuYScpO1xyXG4gICAgdGhpcy5hdXRvID0gYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYXV0bycsIGZhbHNlKTtcclxuICAgIHRoaXMuYmdTb3VyY2UgPSBhcHBTZXR0aW5ncy5nZXRCb29sZWFuKCdiZ3NvdXJjZScsIGZhbHNlKTtcclxuICAgIHRoaXMucmFuZ2VUZXh0ID0gXCJBVVRPIFNUT1AgUFJaWSBXQVJUT8WaQ0k6IFwiICsgYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKCdyYW5nZScsIDc1KSArIFwiTUcvRExcIjtcclxuICAgIHRoaXMudHJhY2VXcml0ZXJTZXJ2aWNlLnN1YnNjcmliZShcclxuICAgICAgKHsgbWVzc2FnZSwgZGF0ZSwgY2F0ZWdvcnksIG1lc3NhZ2VUeXBlIH0pID0+IHtcclxuICAgICAgICB0aGlzLmRhdGFiYXNlU2VydmljZS5pbnNlcnRMb2dzKGRhdGUsIG1lc3NhZ2UsIG1lc3NhZ2VUeXBlLCBjYXRlZ29yeSk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzLnNlbmREYXRhdG9OaWdodHNjb3V0NygpLnRoZW4oKCkgPT5cclxuICAgICAgY29uc29sZS5sb2codGhpcy5uc1VybDIgKyBcImZmZmZmZmZmZjMzMzMzMzNmXCIpXHJcbiAgICApO1xyXG4gIH1cclxuICBnZXRCR1JhbmdlKCl7XHJcbiAgICBkaWFsb2dzLnByb21wdCh7XHJcbiAgICAgIHRpdGxlOiBcIlBvZGFqIHdhcnRvxZvEhyBwcnp5IGpha2llaiBtYSB6b3N0YcSHIHd5xYLEhWN6b25hIHBvbXBhXCIsXHJcbiAgICAgIG1lc3NhZ2U6IFwiV2FydG/Fm8SHIGdyYW5pY3puYSB0bzpcIixcclxuICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCIsXHJcbiAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQW51bHVqXCIsXHJcbiAgICAgIGlucHV0VHlwZTogZGlhbG9ncy5pbnB1dFR5cGUubnVtYmVyXHJcbiAgICB9KS50aGVuKHIgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkRpYWxvZyBjbG9zZWQhXCIgKyByLnJlc3VsdCArIFwiLCBBIFRPIFRFS1NUOlwiICsgci50ZXh0KTtcclxuICAgICAgdGhpcy5yYW5nZSA9IE51bWJlcihyLnRleHQpO1xyXG4gICAgICBpZih0aGlzLnJhbmdlIDwgNzUgfHwgdGhpcy5yYW5nZSA+IDExMCl7XHJcbiBkaWFsb2dzLmFsZXJ0KHttZXNzYWdlOiBcIlVXQUdBIFdBUlRPxZrEhiBTUE9aQSBaQUtSRVNVOiA3NSAtIDExMCBNRy9ETFwiLCBva0J1dHRvblRleHQ6IFwiT0tcIn0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGFwcFNldHRpbmdzLnNldE51bWJlcigncmFuZ2UnLCB0aGlzLnJhbmdlKTtcclxuICAgICAgICB0aGlzLnJhbmdlVGV4dCA9IFwiQVVUTyBTVE9QIFBSWlkgV0FSVE/FmkNJOiBcIiArIHRoaXMucmFuZ2UgKyBcIk1HL0RMXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxufVxyXG4gIHNldFBob25lTnVtYmVyKCl7XHJcbiAgICBkaWFsb2dzLnByb21wdCh7XHJcbiAgICAgIHRpdGxlOiBcIlBvZGFqIG5yIHRlbC4gb3BpZWt1bmFcIixcclxuICAgICAgbWVzc2FnZTogXCJQb2RhaiBudW1lciB0ZWxlZm9udSB6IGt0w7NyZWdvIGLEmWTEhSBwcnp5am1vd2FuZSBrb21lbmR5IHRqLjogU1RBUlQsIFNUT1AsIEJPTCBYLlhcIixcclxuICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCIsXHJcbiAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQW51bHVqXCIsXHJcbiAgICAgIGlucHV0VHlwZTogZGlhbG9ncy5pbnB1dFR5cGUubnVtYmVyXHJcbiAgICB9KS50aGVuKHIgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkRpYWxvZyBjbG9zZWQhXCIgKyByLnJlc3VsdCArIFwiLCBBIFRPIFRFS1NUOlwiICsgci50ZXh0KTtcclxuICAgICAgaWYgKHIudGV4dCA9PT0gJycpIHtcclxuICAgICAgICBhcHBTZXR0aW5ncy5zZXRTdHJpbmcoJ3Bob25lTicsICdQb2RhaiBuciB0ZWwuIG9waWVrdW5hJyk7XHJcbiAgICAgICAgdGhpcy5waG9uZU4gPSAnUG9kYWogbnIgdGVsLiBvcGlla3VuYSc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgUGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oXHJcbiAgICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uU0VORF9TTVMsIFwiemV6d29saWMgbmEgY3p5dGFuaWUgU01TP1wiXHJcbiAgICAgICAgKS50aGVuKCgpID0+IFBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9uKGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5SRUFEX1NNUykpO1xyXG4gICAgICAgIGFwcFNldHRpbmdzLnNldFN0cmluZygncGhvbmVOJywgci50ZXh0KTtcclxuICAgICAgICB0aGlzLnBob25lTiA9ICdUZWw6ICcgKyByLnRleHQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZExvZ3MoKSB7XHJcbiAgICBjb25zdCBkb2N1bWVudHMgPSBmcy5wYXRoLmpvaW4oYW5kcm9pZC5vcy5FbnZpcm9ubWVudC5nZXRFeHRlcm5hbFN0b3JhZ2VEaXJlY3RvcnkoKS5nZXRBYnNvbHV0ZVBhdGgoKS50b1N0cmluZygpKTtcclxuICAgIGNvbnN0IG15Rm9sZGVyID0gZnMuRm9sZGVyLmZyb21QYXRoKGRvY3VtZW50cyk7XHJcbiAgICBjb25zdCBteUZpbGUgPSBteUZvbGRlci5nZXRGaWxlKFwibXkudHh0XCIpO1xyXG4gICAgY29uc3QgYSA9IFJ1bnRpbWUuZ2V0UnVudGltZSgpLmV4ZWMoJ2xvZ2NhdCAtdiB0aW1lIC1mIC9zZGNhcmQvbXkudHh0IC1kJyk7XHJcbiAgICBjb25zb2xlLmxvZyhcInRvIHRhIHdpZWxrb3NjIHBsaWt1OiBcIiArIG15RmlsZS5zaXplKTtcclxuICAgIGlmIChteUZpbGUuc2l6ZSA+IDUwMDAwMDAgKVxyXG4gICAge1xyXG4gICAgICBteUZpbGUucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdSA9IHNldEludGVydmFsKCAoKSA9PiB7XHJcbiAgICBpZiAoYS5pc0FsaXZlKCkgPT09IGZhbHNlKXtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh1KTtcclxuICAgICAgY29uc29sZS5sb2coXCJDSU9Tc1wiKTtcclxuICAgICAgUGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oXHJcbiAgICAgICAgYW5kcm9pZC5NYW5pZmVzdC5wZXJtaXNzaW9uLldSSVRFX0VYVEVSTkFMX1NUT1JBR0UsXHJcbiAgICAgICkudGhlbigoKSA9PlxyXG4gICAgICAgIGNvbXBvc2Uoe1xyXG4gICAgICAgICAgc3ViamVjdDogXCJEZWJ1ZyBtZWQtbGluay11aVwiLFxyXG4gICAgICAgICAgYm9keTogXCJhUmVkdWNlZDJcIixcclxuICAgICAgICAgIHRvOiBbXCJqcmtmQG8yLnBsXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogbXlGaWxlLnBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiAnbXkudHh0J1xyXG4gICAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICB9KVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coXCJCQU0gQkFNXCIpO1xyXG4gICAgfVxyXG4gICAgfSwgNTAwKTtcclxuICB9XHJcblxyXG4gIFphcGlzeigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiYWFhYWFhXCIgKyB0aGlzLm5zVXJsKTtcclxuICAgIGNvbnN0IHNoYTEgPSByZXF1aXJlKFwic2hhMVwiKTtcclxuICAgIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLmluc2VydE5TKHRoaXMubnNVcmwsIHNoYTEodGhpcy5uc0tleSksIHRoaXMubnNLZXkpO1xyXG4gICAgY29uc29sZS5sb2coXCJOUyBVUkw6IFwiICsgdGhpcy5uc1VybCArIFwiIGRkZGRkZGRkZGRkIFwiICsgdGhpcy5uc0tleSk7XHJcbiAgICB0aGlzLnNlbmREYXRhdG9OaWdodHNjb3V0NigpLnRoZW4oKCkgPT5cclxuICAgICAgY29uc29sZS5sb2codGhpcy5zbG93byArIFwiYVJSUlJSUlJSUlJcIilcclxuICAgICk7XHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMubnNVcmwuc3Vic3RyaW5nKDAsIDgpLnRvVXBwZXJDYXNlKCkgIT09IFwiSFRUUFM6Ly9cIiB8fFxyXG4gICAgICB0aGlzLm5zVXJsLnN1YnN0cmluZyh0aGlzLm5zVXJsLmxlbmd0aCAtIDEsIHRoaXMubnNVcmwubGVuZ3RoKSA9PT0gXCIvXCJcclxuICAgICkge1xyXG4gICAgICB0aGlzLnNsb3dvMiA9IFwiWsWBWSBBRFJFUyBVUkwgISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNsb3dvMiA9IFwiT0shIFwiO1xyXG4gICAgfVxyXG4gIH1cclxuICBvbkNoZWNrZWRDaGFuZ2VBdXRvKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gICAgY29uc3QgbXlTd2l0Y2ggPSBhcmdzLm9iamVjdCBhcyBTd2l0Y2g7XHJcbiAgICBjb25zdCBpc0NoZWNrZWQgPSBteVN3aXRjaC5jaGVja2VkOyAvLyBib29sZWFuXHJcbiAgICBpZiAoaXNDaGVja2VkID09PSB0cnVlKSB7XHJcbiAgICAgICBhcHBTZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0b1wiLCB0cnVlKTtcclxuICAgICAgdGhpcy5hdXRvID0gYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYXV0bycpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGFwcFNldHRpbmdzLnNldEJvb2xlYW4oXCJhdXRvXCIsIGZhbHNlKTtcclxuICAgICAgdGhpcy5hdXRvID0gYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYXV0bycpO1xyXG4gICAgfVxyXG4gICAgfVxyXG4gIG9uQ2hlY2tlZENoYW5nZVNvdXJjZShhcmdzOiBFdmVudERhdGEpIHtcclxuICAgIGNvbnN0IG15U3dpdGNoID0gYXJncy5vYmplY3QgYXMgU3dpdGNoO1xyXG4gICAgY29uc3QgaXNDaGVja2VkID0gbXlTd2l0Y2guY2hlY2tlZDsgLy8gYm9vbGVhblxyXG4gICAgaWYgKGlzQ2hlY2tlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICBhcHBTZXR0aW5ncy5zZXRCb29sZWFuKFwiYmdzb3VyY2VcIiwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuYmdTb3VyY2UgPSBhcHBTZXR0aW5ncy5nZXRCb29sZWFuKCdiZ3NvdXJjZScpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGFwcFNldHRpbmdzLnNldEJvb2xlYW4oXCJiZ3NvdXJjZVwiLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuYmdTb3VyY2UgPSBhcHBTZXR0aW5ncy5nZXRCb29sZWFuKCdiZ3NvdXJjZScpO1xyXG4gICAgfVxyXG4gIH1cclxuICBzZW5kRGF0YXRvTmlnaHRzY291dDYoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLmdldE5TRGF0YSgpLnN1YnNjcmliZShnID0+IHtcclxuICAgICAgICBnLm1hcChib2wgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coYm9sLmh0dHAudG9TdHJpbmcoKSArIFwiSkpKSkpKSlwiICsgYm9sLnNlY3JldC50b1N0cmluZygpKTtcclxuICAgICAgICAgIHRoaXMuc2xvd28gPVxyXG4gICAgICAgICAgICB0aGlzLnNsb3dvMiArXHJcbiAgICAgICAgICAgIFwiICBcIiArXHJcbiAgICAgICAgICAgIGJvbC5odHRwLnRvU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICBcIiBcIiArXHJcbiAgICAgICAgICAgIGJvbC5zZWNyZXQudG9TdHJpbmcoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImFzXCIgKyB0aGlzLnNsb3dvKTtcclxuICAgICAgICByZXNvbHZlKCksIHJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBzZW5kRGF0YXRvTmlnaHRzY291dDcoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLmdldE5TRGF0YSgpLnN1YnNjcmliZShnID0+IHtcclxuICAgICAgICBnLm1hcChib2wgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgIGJvbC5odHRwLnRvU3RyaW5nKCkgKyBcIjY2NjY2NjY2NjY2XCIgKyBib2wuc2VjcmV0LnRvU3RyaW5nKClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICB0aGlzLm5zVXJsMiA9IGJvbC5odHRwLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICB0aGlzLm5zS2V5MiA9IGJvbC5oYXNoLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJhc1wiICsgdGhpcy5uc1VybDIpO1xyXG4gICAgICAgIHJlc29sdmUoKSwgcmVqZWN0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHNldE5TKGFyZykge1xyXG4gICAgY29uc29sZS5sb2coXCJzZXR0dE5TXCIpO1xyXG4gICAgY29uc29sZS5sb2coYXJnLnRleHQpO1xyXG4gICAgdGhpcy5uc1VybCA9IGFyZy50ZXh0O1xyXG4gIH1cclxuICBzZXROU3VybChhcmcpIHtcclxuICAgIGNvbnNvbGUubG9nKFwic2V0dHROU1VVUlJMXCIpO1xyXG4gICAgY29uc29sZS5sb2coYXJnLnRleHQpO1xyXG4gICAgdGhpcy5uc0tleSA9IGFyZy50ZXh0O1xyXG4gIH1cclxuICBnZXROU0RhdGEoKTogT2JzZXJ2YWJsZTxcclxuICAgIEFycmF5PHsgaHR0cDogc3RyaW5nOyBzZWNyZXQ6IHN0cmluZzsgaGFzaDogc3RyaW5nIH0+XHJcbiAgPiB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZVNlcnZpY2UuTlNjb25mKCkucGlwZShcclxuICAgICAgbWFwKHJvd3MgPT4ge1xyXG4gICAgICAgIHJldHVybiByb3dzLm1hcChhID0+ICh7XHJcbiAgICAgICAgICBodHRwOiBhWzBdLFxyXG4gICAgICAgICAgc2VjcmV0OiBhWzFdLFxyXG4gICAgICAgICAgaGFzaDogYVsyXVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==