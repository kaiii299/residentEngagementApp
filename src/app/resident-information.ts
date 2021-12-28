import { Resident } from './resident';
export class ResidentInformation {

    residents: Resident[] = [];

    public addResident(info: Resident) {
        console.log("info -" + info);
        var tempResident = new Resident();
        tempResident.id = this.residents.length + 1;
        tempResident.residentName = info.residentName;
        tempResident.committee = info.committee;
        tempResident.blkNum = info.blkNum;
        tempResident.unitNum = info.unitNum;
        tempResident.gender = info.gender;
        tempResident.race = info.race;
        tempResident.ageGp = info.ageGp;
        tempResident.expertise = info.expertise;
        tempResident.activities = info.activities;
        this.residents.push(tempResident);
        console.log("resident added");
        console.log(this.residents);
    }

    getAllResidents() {
        return this.residents;
    }

    getResidentById(id: number) {
        console.log("all residents " + this.residents.length);
        console.log("id " + id);
        this.residents.forEach(r => {
            console.log("r " + r);
            if (r.id == id) {
                return r;
            }
        }
        );
    }

    updateResidentById(resident: Resident) {
        let residentToUpdate: any = this.residents.forEach(r => {
            if (r.id = resident.id) {
                return r;
            }
        });
        residentToUpdate.residentName = resident.residentName;
        residentToUpdate.committee = resident.committee;
        residentToUpdate.blkNum = resident.blkNum;
        residentToUpdate.unitNum = resident.unitNum;
        residentToUpdate.gender = resident.gender;
        residentToUpdate.race = resident.race;
        residentToUpdate.ageGp = resident.ageGp;
        residentToUpdate.expertise = resident.expertise;
        residentToUpdate.activity = resident.activities;
    }

    clearResidentList() {
        this.residents = [];
        return this.residents;
    }
}