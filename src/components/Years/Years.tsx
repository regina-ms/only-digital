import { getYearRange } from "@/features/getYearRange"
import { Data } from "@/index"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import React, { useRef } from "react"
import styles from "./Years.module.scss"
gsap.registerPlugin(useGSAP)

type Props = {
  prevRange: {
    from: number
    to: number
  }
} & Pick<Data, "content">

function Years({ content, prevRange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const fromObj = { val: prevRange.from }
      const toObj = { val: prevRange.to }
      const currentRange = getYearRange(content)

      gsap.to(fromObj, {
        val: currentRange.from,
        duration: 4,
        onUpdate: function () {
          document.querySelector(".from").textContent = Math.round(
            fromObj.val,
          ).toString()
        },
      })

      gsap.to(toObj, {
        val: currentRange.to,
        duration: 4,
        onUpdate: function () {
          document.querySelector(".to").textContent = Math.round(
            toObj.val,
          ).toString()
        },
      })
    },
    { scope: containerRef, dependencies: [content, prevRange] },
  )

  return (
    <div className={`container ${styles.container}`} ref={containerRef}>
      <span className={`from ${styles.from}`}>0</span>
      <span className={`to ${styles.to}`}>0</span>

    </div>
  )
}

export default Years
