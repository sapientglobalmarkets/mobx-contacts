import { observable, runInAction } from 'mobx';
import { DateTimeUtils, StringUtils } from 'shared/utils';
import { Address } from './address';

export class Contact {
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
    constructor(
        id = '',
        name = '',
        company = '',
        email = '',
        phone = '',
        address = null,
        birthdate = null,
        notes = ''
    ) {
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
            name: StringUtils.sanitizeString(this.name),
            company: StringUtils.sanitizeString(this.company),
            email: StringUtils.sanitizeString(this.email),
            phone: StringUtils.sanitizeString(this.phone),
            address: this.address.toDomainModel(),
            birthdate: this.birthdate
                ? DateTimeUtils.dateToISOString(this.birthdate)
                : null,
            notes: StringUtils.sanitizeString(this.notes)
        };
    }

    static toViewModel(id, domainModel) {
        const {
            name,
            company,
            email,
            phone,
            address,
            birthdate,
            notes
        } = domainModel;
        return new Contact(
            id,
            name,
            company,
            email,
            phone,
            Contact.cloneAddress(address),
            Contact.cloneDate(birthdate),
            notes
        );
    }

    static cloneAddress(address) {
        let addressCopy = null;

        if (address) {
            const { street, city, state, zip } = address;
            addressCopy = new Address(street, city, state, zip);
        }

        return addressCopy;
    }

    static cloneDate(date) {
        let dateCopy = null;

        if (date) {
            dateCopy = DateTimeUtils.ISOStringToDate(date);
        }

        return dateCopy;
    }
}
