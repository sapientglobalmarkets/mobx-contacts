import React from 'react';
import { inject, observer } from 'mobx-react';
import { Master, MasterDetail } from 'core';
import Contact from '../models/contact';
import ContactForm from './contact-form';

@inject('contactStore')
@observer
export default class ContactsPage extends React.Component {

    componentDidMount() {
        const { contactStore } = this.props;
        contactStore.startListening();
    }

    componentWillUnmount() {
        const { contactStore } = this.props;
        contactStore.stopListening();
    }

    render() {
        const columnDefs = [
            { id: 'name', header: 'Name', cellRenderer: contact => contact.name },
            { id: 'city', header: 'City', cellRenderer: contact => contact.address ? contact.address.city : null }
        ];

        return (
            <MasterDetail
                columnDefs={ columnDefs }
                entityMap={ this.props.contactStore.contactMap }
                createEntity={ () => new Contact() }
                masterComponent={ Master }
                detailComponent={ ContactForm }
            />
        );
    }

}
