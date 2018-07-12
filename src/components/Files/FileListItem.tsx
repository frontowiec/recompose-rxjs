import {Avatar, Button, Dropdown, List, Menu} from 'antd';
import * as React from 'react';
import {StatelessComponent} from "react";
import {FormattedRelative} from 'react-intl';
import {IFile} from "./FileList";

const menu = (
    <Menu>
        <Menu.Item key="0">
            <a onClick={console.log}>Edytuj</a>
        </Menu.Item>
        <Menu.Item key="1">
            <a onClick={console.log}>Usuń</a>
        </Menu.Item>
    </Menu>
);

export const FileListItem: StatelessComponent<{ file: IFile }> = ({file}) => (
    <List.Item actions={[
        <Dropdown key={0} overlay={menu} trigger={['click']}>
            <Button type="ghost" shape="circle" icon="ellipsis" />
        </Dropdown>,
    ]}>
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
);