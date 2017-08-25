import { action, observable, runInAction } from 'mobx';
import { StringUtils } from 'shared/utils';
import { Address } from './address';

export class Contact {
    @observable id;
    @observable name;
    @observable company;
    @observable email;
    @observable phone;
    @observable address;
    @observable lastContacted;
    @observable industry;
    @observable yearsOfExperience;
    @observable notes;

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} company
     * @param {string} email
     * @param {string} phone
     * @param {Address} [address]
     * @param {Date} [lastContacted]
     * @param {IndustryType} [industry]
     * @param {number} [yearsOfExperience]
     * @param {string} notes
     */
    constructor(
        id = '',
        name = '',
        company = '',
        email = '',
        phone = '',
        address = null,
        lastContacted = null,
        industry = null,
        yearsOfExperience = null,
        notes = ''
    ) {
        // runInAction because constructor cannot be decorated with @action
        runInAction(() => {
            this.id = id;
            this.name = name;
            this.company = company;
            this.email = email;
            this.phone = phone;
            this.address = address ? address : new Address();
            this.lastContacted = lastContacted;
            this.industry = industry;
            this.yearsOfExperience = yearsOfExperience;
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
            this.lastContacted,
            this.industry,
            this.yearsOfExperience,
            this.notes
        );
    }

    @action
    onNameChange = event => {
        this.name = event.target.value;
    };

    toDomainModel() {
        return {
            name: StringUtils.sanitizeString(this.name),
            company: StringUtils.sanitizeString(this.company),
            email: StringUtils.sanitizeString(this.email),
            phone: StringUtils.sanitizeString(this.phone),
            address: this.address.toDomainModel(),
            lastContacted: this.lastContacted
                ? this.lastContacted.toISOString()
                : null,
            industry: this.industry,
            yearsOfExperience: this.yearsOfExperience,
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
            lastContacted,
            industry,
            yearsOfExperience,
            notes
        } = domainModel;
        return new Contact(
            id,
            name,
            company,
            email,
            phone,
            Contact.cloneAddress(address),
            lastContacted ? new Date(lastContacted) : null,
            industry,
            yearsOfExperience,
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
}
