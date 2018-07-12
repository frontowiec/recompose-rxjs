import * as React from 'react';
import {StatelessComponent} from "react";
import {FileList} from "./FileList";

const Files: StatelessComponent = () => (
    <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', width: '100%'}}>
        <h1>File list</h1>
        <FileList/>
    </div>
);

export default Files;