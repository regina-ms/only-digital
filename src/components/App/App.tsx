import Circle from "@/components/Circle/Circle"
import Years from "@/components/Years/Years"
import { Data } from "@/index"
import React, { useCallback, useEffect, useState } from "react"
import styles from "./App.module.scss"

type Props = {
  data: Data[]
}

export const App = ({ data }: Props) => {
  const [activeDataId, setActiveDataId] = useState<string>(data[0].id)

  const getContent = useCallback(
    (id: string) => {
      return data.find((el) => el.id === id)?.content
    },
    [data],
  )

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Исторические даты</h2>
      <div className={styles.cross} />
      <Circle dots={data} setActive={(id: string) => setActiveDataId(id)} />
      <Years content={getContent(activeDataId)} />
    </div>
  )
}
