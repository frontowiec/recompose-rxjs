/*tslint:disable:jsx-no-lambda*/
import {Avatar, Input, List} from 'antd';
import {includes} from 'lodash';
import * as React from 'react';
import {FormattedRelative} from 'react-intl';
import {componentFromStream, createEventHandler, setObservableConfig,} from "recompose";
import {combineLatest, from, Observable} from "rxjs";
import {ajax} from "rxjs/ajax";
import {map, shareReplay, startWith, switchMap} from "rxjs/operators";

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

setObservableConfig({
    fromESObservable: from,
    toESObservable: stream => stream
});

type ChangeValueEvent = React.ChangeEvent<{ value: string }>;

export const FileList = componentFromStream(props$ => {
    const {handler: onInputChange, stream: onInputChange$} = createEventHandler<ChangeValueEvent, Observable<ChangeValueEvent>>();

    const onSearch$: Observable<string> = onInputChange$.pipe(
        map(event => event.target.value)
    );

    const files$: Observable<IFile[]> = ajax({
        method: 'GET',
        url: `http://localhost:5000/api/files`
    }).pipe(
        map(({response}) => response.files),
        shareReplay(1)
    );

    const searchedFiles$: Observable<IFile[]> = onSearch$.pipe(
        startWith(''),
        switchMap((searchedValue) => files$.pipe(
            map(files => files.filter(file => includes(file.name.toLowerCase(), searchedValue.toLowerCase())))
        ))
    );

    return combineLatest(props$, searchedFiles$)
        .pipe(
            map(([props, files]) => (
                <div style={{width: '50%'}}>
                    <Input type="text" placeholder="Type file name..."
                        /*todo: value={inputValue}*/
                           onChange={onInputChange}/>
                    <List
                        itemLayout="horizontal"
                        dataSource={files}
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
            ))
        )
});