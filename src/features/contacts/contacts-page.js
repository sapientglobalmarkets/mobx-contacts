import React from 'react';
import { withStyles } from 'material-ui/styles';
import { inject } from 'mobx-react';
import { Master, MasterDetail, Titlebar } from 'shared/components';
import { Contact } from 'shared/domain';
import { ContactForm } from './contact-form';

const styles = {
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
};

@inject('contactStore')
class ContactsPageBase extends React.Component {
    componentDidMount() {
        const { contactStore } = this.props;
        contactStore.startListening();
    }

    componentWillUnmount() {
        const { contactStore } = this.props;
        contactStore.stopListening();
    }

    render() {
        const { contactStore, classes } = this.props;
        const columnDefs = [
            {
                id: 'name',
                header: 'Name',
                cellRenderer: contact => contact.name
            },
            {
                id: 'city',
                header: 'City',
                cellRenderer: contact =>
                    contact.address ? contact.address.city : null
            }
        ];

        return (
            <div className={classes.root}>
                <Titlebar>MobX Contacts</Titlebar>
                <MasterDetail
                    columnDefs={columnDefs}
                    entityMap={contactStore.contactMap}
                    createEntity={() => new Contact()}
                    masterComponent={Master}
                    detailComponent={ContactForm}
                />
            </div>
        );
    }
}

export const ContactsPage = withStyles(styles)(ContactsPageBase);
