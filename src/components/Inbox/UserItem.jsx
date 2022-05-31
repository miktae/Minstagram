import React from 'react';
import {
    NavLink,
    useResolvedPath,
} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";

const UserItem = (props) => {
    let resolved = useResolvedPath(props.to)

    return (
        <NavLink className="user-item"
            to={props.to}>
            <Avatar />
            <div >
                <div className="Chat-user-list-item-info">
                    <div className="Chat-user-list-item-name">
                        {props.name}
                    </div>
                    <div className="Chat-user-list-item-lastest">
                        <div className="Chat-user-list-item-lastest-content">
                            {props.lastestContent}
                        </div>
                        <div className="Chat-user-list-item-lastest-since">
                            {props.lastestSince}
                        </div>
                    </div>
                </div>
            </div>
        </NavLink>
    );
}

export default UserItem