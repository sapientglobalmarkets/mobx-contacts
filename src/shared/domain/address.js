import { observable } from 'mobx';
import { StringUtils } from 'shared/utils';

export class Address {

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
        const street = StringUtils.sanitizeString(this.street);
        const city = StringUtils.sanitizeString(this.city);
        const state = StringUtils.sanitizeString(this.state);
        const zip = StringUtils.sanitizeString(this.zip);

        if (street || city || state || zip) {
            return {
                street: StringUtils.sanitizeString(this.street),
                city: StringUtils.sanitizeString(this.city),
                state: StringUtils.sanitizeString(this.state),
                zip: StringUtils.sanitizeString(this.zip)
            };
        }
        else {
            return null;
        }
    }

    static toViewModel(domainModel) {
        const { street, city, state, zip } = domainModel;
        return new Address(street, city, state, zip);
    }
}
