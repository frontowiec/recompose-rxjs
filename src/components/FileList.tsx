/*tslint:disable:jsx-no-lambda*/
/*tslint:disable:no-console*/

import {Avatar, Input, List} from 'antd';
import {includes} from 'lodash';
import * as React from 'react';
import {FormattedRelative} from 'react-intl';
import {BehaviorSubject, Subject} from "rxjs";
import {ajax} from "rxjs/ajax";
import {shareReplay, switchMap} from "rxjs/internal/operators";
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
    files: IFile[];
    value: string;
}

const onComponentUnmount$ = new Subject<boolean>();

export class FileList extends React.Component<{}, IState> {
    private onSearch$ = new BehaviorSubject<string>('');
    private files$ = ajax({
        method: 'GET',
        url: `http://localhost:5000/api/files`
    }).pipe(
        map(({response}) => response.files),
        shareReplay(1)
    );

    constructor(props: {}) {
        super(props);

        this.state = {files: [], value: ''};
    }

    public componentDidMount() {
        this.onSearch$.asObservable().pipe(
            tap(value => this.setState({value})),
            switchMap(searchedExtension => this.files$.pipe(
                map((files: IFile[]) => files.filter(file => includes(file.name.toLowerCase(), searchedExtension.toLowerCase())))
            )),
            tap(files => this.setState({files})),
            takeUntil(onComponentUnmount$)
        ).subscribe();
    }

    public componentWillUnmount() {
        onComponentUnmount$.next(true);
    }

    public render() {
        return (
            <div style={{width: '50%'}}>
                <Input type="text" placeholder="Type file name..."
                       value={this.state.value}
                       onChange={(event: React.ChangeEvent<{ value: string }>) => this.onSearch$.next(event.target.value)}/>
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
