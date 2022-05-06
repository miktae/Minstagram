import React from 'react'
import "./Inbox.css"

function Inbox() {
  return (
    <div className="Chat">
      <div className="Chat-frame">
        <div className="Chat-user-view">
          <div className="Chat-username">
            <select name="Chat-user" id="Chat-user-name">
              <option value="min">
                Min
              </option>
              <option value="min">
                Min 1
              </option>
            </select>
            <i className='bx bx-edit'></i>
          </div>
          <div className="Chat-user-list">
            {
              [1, 2, 3, 4, 5, 6].map((item, index) => {
                return (
                  <div className="Chat-user-item" key={index}>
                    <div className="Chat-user-avatar">
                      <img src="https://via.placeholder.com/48" alt="avatar" />
                    </div>
                    <div className="Chat-user-name">
                      <span>Min</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="Chat-user-message">
          <svg aria-label="Direct" class="_8-yf5 "
            color="#262626" fill="#262626" height="96"
            role="img" viewBox="0 0 96 96" width="96">
            <circle cx="48" cy="48" fill="none" r="47"
              stroke="currentColor" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="2"></circle>
            <line fill="none" stroke="currentColor"
              stroke-linejoin="round" stroke-width="2"
              x1="69.286" x2="41.447" y1="33.21" y2="48.804"></line>
            <polygon fill="none"
              points="47.254 73.123 71.376 31.998 24.546
             32.002 41.448 48.805 47.254 73.123"
              stroke="currentColor" stroke-linejoin="round"
              stroke-width="2"></polygon></svg>
          <p>Your Messages</p>
          <p>Send private photos and messages to a friend or group.</p>
        </div>
      </div>
    </div>
  )
}

export default Inbox