import React from 'react'
import {
  Outlet,
  useParams,
} from "react-router-dom";
import { auth } from "../../firebase";
import "./Inbox.css";
import UserItem from './UserItem';

function Inbox() {
  let { user } = useParams();

  return (
    <div className="Chat">
      <div className="Chat-frame">
        <div className="Chat-user-view">
          <div className="Chat-username">
            <div className="Chat-select">
              <select name="Chat-user" id="Chat-user-name">
                <option value="min">
                  Min
                </option>
                <option value="min">
                  Min 1
                </option>
              </select>
            </div>
            <div className="Chat-edit">
              <i className='bx bx-edit'></i>
            </div>
          </div>
          <div className="Chat-user-list">
            <UserItem />
          </div>
        </div>
          {
            !user ?
              <div className="Chat-user-message">
                <svg aria-label="Direct" className="_8-yf5 "
                  color="#262626" fill="#262626" height="96"
                  role="img" viewBox="0 0 96 96" width="96">
                  <circle cx="48" cy="48" fill="none" r="47"
                    stroke="currentColor" strokeLinecap="round"
                    strokeLinejoin="round" strokeWidth="2"></circle>
                  <line fill="none" stroke="currentColor"
                    strokeLinejoin="round" strokeWidth="2"
                    x1="69.286" x2="41.447" y1="33.21" y2="48.804"></line>
                  <polygon fill="none"
                    points="47.254 73.123 71.376 31.998 24.546
       32.002 41.448 48.805 47.254 73.123"
                    stroke="currentColor" strokeLinejoin="round"
                    strokeWidth="2"></polygon></svg>
                <p>Your Messages</p>
                <p>Send private photos and messages to a friend or group.</p>
                <button className="btn btn-prim">Send Message</button>
              </div>
              : <Outlet />
          }
      </div>
    </div>
  )
}

export default Inbox