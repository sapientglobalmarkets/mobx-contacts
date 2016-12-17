import { observable } from 'mobx';
import { StringUtils } from 'core';

export default class Address {

    @observable street;
    @observable city;
    @observable state;
    @observable zip;

    /**
     * @param {string} street
     * @param {string} city
     * @param {string} state
     * @param {string} zip
     */
    constructor(street='', city='', state='', zip='') {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    clone() {
        return new Address(
            this.street,
            this.city,
            this.state,
            this.zip
        );
    }

    toDomainModel() {
        let street = StringUtils.sanitizedString(this.street);
        let city = StringUtils.sanitizedString(this.city);
        let state = StringUtils.sanitizedString(this.state);
        let zip = StringUtils.sanitizedString(this.zip);

        if (street || city || state || zip) {
            return {
                street: StringUtils.sanitizedString(this.street),
                city: StringUtils.sanitizedString(this.city),
                state: StringUtils.sanitizedString(this.state),
                zip: StringUtils.sanitizedString(this.zip)
            };
        }
        else {
            return null;
        }
    }

    static toViewModel(domainModel) {
        let { street, city, state, zip } = domainModel;
        return new Address(street, city, state, zip);
    }
}
