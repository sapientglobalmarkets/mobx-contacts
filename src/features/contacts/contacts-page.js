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

@inject('appStore')
class ContactsPageBase extends React.Component {
    componentDidMount() {
        const { appStore } = this.props;
        appStore.contactStore.startListening();
    }

    componentWillUnmount() {
        const { appStore } = this.props;
        appStore.contactStore.stopListening();
    }

    render() {
        const { appStore, classes } = this.props;
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
                    entityMap={appStore.contactStore.contactMap}
                    createEntity={() => new Contact()}
                    masterComponent={Master}
                    detailComponent={ContactForm}
                />
            </div>
        );
    }
}

export const ContactsPage = withStyles(styles)(ContactsPageBase);
