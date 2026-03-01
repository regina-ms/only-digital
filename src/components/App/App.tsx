import Circle from "@/components/Circle/Circle"
import CrossContainer from "@/components/CrossContainer/CrossContainer"
import Years from "@/components/Years/Years"
import { getYearRange } from "@/features/getYearRange"
import { Data } from "@/index"
import React, { useCallback, useEffect, useState } from "react"
import styles from "./App.module.scss"

type Props = {
  data: Data[]
}

export const App = ({ data }: Props) => {
  const [activeDataId, setActiveDataId] = useState<string>(data[0].id)
  const [prevDataId, setPrevDataId] = useState<string>()

  const getContent = useCallback(
    (id: string) => {
      return data.find((el) => el.id === id)?.content
    },
    [data],
  )

  const getPrevRange = useCallback(() => {
    if (!prevDataId) return { from: 0, to: 0 }
    const prevContent = getContent(prevDataId)
    return getYearRange(prevContent)
  }, [getContent, prevDataId])


  return (
    <div className={styles.mainContainer}>
      <CrossContainer>
        <h2 className={styles.title}>Исторические даты</h2>
        <Circle
          dots={data}
          setActive={(id: string) => setActiveDataId(id)}
          setPrev={(id: string) => setPrevDataId(id)}
        />
        <Years content={getContent(activeDataId)} prevRange={getPrevRange()} />
      </CrossContainer>
    </div>
  )
}
