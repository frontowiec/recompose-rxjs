/*tslint:disable:jsx-no-lambda*/
import {Avatar, Input, List} from 'antd';
import {includes} from 'lodash';
import * as React from 'react';
import {StatelessComponent} from "react";
import {FormattedRelative} from 'react-intl';
import {compose, lifecycle, withHandlers, withState} from "recompose";
import {BehaviorSubject, Subject} from "rxjs";
import {ajax} from "rxjs/ajax";
import {map, shareReplay, switchMap, takeUntil, tap} from "rxjs/operators";

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

interface IProps {
    inputValue: string;
    setInputValue: (inputValue: string) => { inputValue: string };
    files: IFile[];
    setFiles: (files: IFile[]) => { files: IFile[] };
}

interface IHandlers {
    onInputChange: (event: React.ChangeEvent<{ value: string }>) => void;
}

const onComponentUnmount$ = new Subject<boolean>();

const FileList: StatelessComponent<IProps & IHandlers> = ({inputValue, onInputChange, files}) => (
    <div style={{width: '50%'}}>
        <Input type="text" placeholder="Type file name..."
               value={inputValue}
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
);

const onSearch$ = new BehaviorSubject<string>('');

const files$ = ajax({
    method: 'GET',
    url: `http://localhost:5000/api/files`
}).pipe(
    map(({response}) => response.files),
    shareReplay(1)
);

const searchedFiles$ = (setFiles: (files: IFile[]) => void) => onSearch$.asObservable().pipe(
    switchMap(searchedExtension => files$.pipe(
        map((files: IFile[]) => files.filter(file => includes(file.name.toLowerCase(), searchedExtension.toLowerCase())))
    )),
    tap(files => setFiles(files)), // side effect
    takeUntil(onComponentUnmount$)
);

const cmpWithInputValueState = withState('inputValue', 'setInputValue', '');
const cmpWithFilesState = withState('files', 'setFiles', []);

const cmpWithHandlers = withHandlers<IProps, IHandlers>({
    onInputChange: props => event => {
        onSearch$.next(event.target.value);
        props.setInputValue(event.target.value);
    }
});

const cmpLifecycle = lifecycle<IProps, {}>({
    componentDidMount() {
        searchedFiles$(this.props.setFiles).subscribe();
    },
    componentWillUnmount() {
        onComponentUnmount$.next(true);
    }
});

const enhance = compose(
    cmpWithInputValueState,
    cmpWithFilesState,
    cmpWithHandlers,
    cmpLifecycle
);

export default enhance(FileList);