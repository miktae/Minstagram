import React from 'react'
import styles from './ModalReminder.module.css'

function ModalReminder() {
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <i className='bx bxl-instagram'></i>
        <div className={styles.leftText}>
        <p>Log In to Instagram</p>
        <p>Log in to see photos and videos from
           friends and discover other accounts you'll love.</p> 
        </div>
      </div>
      <div className={styles.right}>
        <button className={styles.loginBtn}>
          Log In
        </button>
        <button className={styles.signupBtn}>
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default ModalReminder