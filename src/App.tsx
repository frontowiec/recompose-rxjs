import * as React from 'react';
import {IntlProvider} from 'react-intl';
import './App.css';
import FileList from "./components/FileList";

class App extends React.Component {
    public render() {
        return (
            <IntlProvider locale="en">
                <div style={{display: 'flex', justifyContent: 'center', padding: 24}}>
                    <FileList/>
                </div>
            </IntlProvider>
        );
    }
}

export default App;
