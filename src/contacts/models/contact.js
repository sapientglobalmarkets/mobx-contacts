import { observable, runInAction } from 'mobx';
import { DateTimeUtils } from 'core';
import { StringUtils } from 'core';
import Address from './address';

export default class Contact {

    @observable id;
    @observable name;
    @observable company;
    @observable email;
    @observable phone;
    @observable address;
    @observable birthdate;
    @observable notes;

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} company
     * @param {string} email
     * @param {string} phone
     * @param {Address} [address]
     * @param {Date} [birthdate]
     * @param {string} notes
     */
    constructor(id='', name='', company='', email='', phone='', address=null, birthdate=null, notes='') {
        // runInAction because constructor cannot be decorated with @action
        runInAction('Construct new Contact', () => {
            this.id = id;
            this.name = name;
            this.company = company;
            this.email = email;
            this.phone = phone;
            this.address = address ? address : new Address();
            this.birthdate = birthdate;
            this.notes = notes;
        });
    }

    clone() {
        return new Contact(
            this.id,
            this.name,
            this.company,
            this.email,
            this.phone,
            this.address.clone(),
            this.birthdate,
            this.notes
        );
    }

    toDomainModel() {
        return {
            name: StringUtils.sanitizedString(this.name),
            company: StringUtils.sanitizedString(this.company),
            email: StringUtils.sanitizedString(this.email),
            phone: StringUtils.sanitizedString(this.phone),
            address: this.address.toDomainModel(),
            birthdate: this.birthdate ? DateTimeUtils.dateToISOString(this.birthdate) : null,
            notes: StringUtils.sanitizedString(this.notes)
        };
    }

    static toViewModel(id, domainModel) {
        let { name, company, email, phone, address, birthdate, notes } = domainModel;

        if (address) {
            let {street, city, state, zip} = address;
            address = new Address(street, city, state, zip);
        }

        if (birthdate) {
            birthdate = DateTimeUtils.ISOStringToDate(birthdate);
        }

        return new Contact(id, name, company, email, phone, address, birthdate, notes);
    }
}
