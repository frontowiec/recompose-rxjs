/*tslint:disable:jsx-no-lambda*/

import {Avatar, List} from 'antd';
import * as React from 'react';
import {FormattedRelative} from 'react-intl';
import {Subject} from "rxjs";
import {ajax} from "rxjs/ajax";
import {map, takeUntil, tap} from "rxjs/operators";

interface IAuthor {
    avatar: string;
    name: string;
}

interface IFile {
    author: IAuthor;
    name: string;
    type: string;
    ext: string;
    semver: string;
    createDate: Date;
}

interface IState {
    files: IFile[]
}

const onComponentUnmount$ = new Subject<boolean>();

export class FileList extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {files: []};
    }

    public componentDidMount() {
        ajax({
            method: 'GET',
            url: `http://localhost:5000/api/files`
        }).pipe(
            map(({response}) => response),
            tap(files => this.setState(files)),
            takeUntil(onComponentUnmount$)
        ).subscribe();
    }

    public componentWillUnmount() {
        onComponentUnmount$.next(true);
    }

    public render() {
        return (
            <div style={{width: '50%'}}>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.files}
                    renderItem={(file: IFile) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={file.author.avatar}/>}
                                title={
                                    <React.Fragment>
                                        <span>{file.author.name}</span>
                                        <span style={{fontWeight: 300}}> uploaded </span>
                                        <span style={{color: '#6151ff'}}>{file.name}</span>
                                    </React.Fragment>
                                }
                                description={
                                    <React.Fragment>
                                        <FormattedRelative value={file.createDate}/>
                                        <span> version: </span>
                                        <span style={{fontWeight: 500}}>{file.semver}</span>
                                    </React.Fragment>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
