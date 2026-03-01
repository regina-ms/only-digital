import styles from "./CrossContainer.scss"
import React, { PropsWithChildren } from "react"

function CrossContainer({ children }: PropsWithChildren) {
  return <div className={styles.container}>{children}</div>
}

export default CrossContainer
