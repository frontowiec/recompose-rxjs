import * as React from 'react';
import {IntlProvider} from 'react-intl';
import './App.css';
import Files from "./components/Files/Files";

class App extends React.Component {
    public render() {
        return (
            <IntlProvider locale="en">
                <div style={{display: 'flex', justifyContent: 'center', padding: 24}}>
                    <Files/>
                </div>
            </IntlProvider>
        );
    }
}

export default App;
